---
title: IPMI in Practice
description: ipmitool commands, IPMI-over-LAN, security considerations, and where IPMI still shows up in production environments.
sidebar:
  label: IPMI in Practice
  order: 3
---

IPMI is old and has real security problems, but it is on nearly every server in production today. Knowing how to use it is not optional — it is something you will run into whether you want to or not. This page covers the actual commands, the security landscape you need to understand, and a realistic picture of where IPMI still lives.

## Core capabilities

These are the five things you will use IPMI for in practice:

**Power control.** Turn a server on, off, cycle it, or issue a hard reset. This works regardless of OS state. A server that is kernel-panicked, deadlocked, or otherwise completely unresponsive can still be power-cycled through the BMC.

**Sensor monitoring.** The BMC continuously reads hardware sensors and stores the results in the Sensor Data Repository (SDR). You can pull current readings for CPU temperatures, inlet/exhaust air temperatures, fan speeds (RPM), voltages, and power supply status. These are hardware readings, not OS-level metrics — they are available before the OS boots and remain readable when the OS is dead.

**System Event Log (SEL).** The BMC maintains a hardware event log stored in non-volatile memory on the BMC itself. It records POST failures, thermal threshold crossings, correctable and uncorrectable memory errors, power supply events, and other hardware-level events. The SEL is often the first place to look when a server fails unexpectedly — it records what the hardware saw, independently of what the OS may or may not have logged.

**Serial-over-LAN (SOL).** The server's physical serial console (the UART attached to the motherboard) can be redirected over the IPMI channel. When SSH is down and you have no other console path, SOL gives you a terminal. It is also how you watch POST output and interact with a server's BIOS/UEFI setup remotely.

**FRU data.** FRU (Field Replaceable Unit) records store hardware inventory: chassis manufacturer and serial number, motherboard product name and serial, DIMM part numbers, PSU part numbers. This data lives on the BMC and is readable without an OS. Useful for automated inventory collection during provisioning.

## ipmitool

`ipmitool` is the standard open-source CLI for IPMI. It is what almost everything in production uses, either directly or as a subprocess. Install it with your package manager (`apt install ipmitool`, `yum install ipmitool`).

**Two modes:**

| Mode | When to use | How the BMC is reached |
| --- | --- | --- |
| Local | Running on the host itself | Via `/dev/ipmi0` kernel device |
| Remote (LAN) | Talking to a different machine's BMC | Over the network using RMCP+ |

For local mode, the `ipmi_devintf` kernel module must be loaded. Most distributions load it automatically. If `/dev/ipmi0` does not exist, `modprobe ipmi_devintf` and `modprobe ipmi_si`.

**Remote mode flags.** Every remote command needs these:

```bash
ipmitool -H <bmc-ip> -U <username> -P <password> -I lanplus <subcommand>
```

`-I lanplus` selects RMCP+ (IPMI 2.0). Always use `lanplus` rather than `lan` — `lan` uses IPMI 1.5 which has weaker auth and no encryption. If the BMC does not respond with `lanplus`, try `-I lan`, but treat that as a problem to fix, not a normal configuration.

**Key commands:**

```bash
# Power operations
ipmitool -H <bmc-ip> -U <user> -P <pass> -I lanplus power status
ipmitool -H <bmc-ip> -U <user> -P <pass> -I lanplus power on
ipmitool -H <bmc-ip> -U <user> -P <pass> -I lanplus power off
ipmitool -H <bmc-ip> -U <user> -P <pass> -I lanplus power cycle
ipmitool -H <bmc-ip> -U <user> -P <pass> -I lanplus power reset

# Sensor readings (SDR)
ipmitool -H <bmc-ip> -U <user> -P <pass> -I lanplus sdr list
ipmitool -H <bmc-ip> -U <user> -P <pass> -I lanplus sdr type Temperature
ipmitool -H <bmc-ip> -U <user> -P <pass> -I lanplus sdr type Fan

# System Event Log
ipmitool -H <bmc-ip> -U <user> -P <pass> -I lanplus sel list
ipmitool -H <bmc-ip> -U <user> -P <pass> -I lanplus sel elist   # extended — includes sensor name and threshold info
ipmitool -H <bmc-ip> -U <user> -P <pass> -I lanplus sel clear   # clears the log — do this intentionally

# Serial-over-LAN console
ipmitool -H <bmc-ip> -U <user> -P <pass> -I lanplus sol activate
# Exit SOL with: ~.

# Hardware inventory
ipmitool -H <bmc-ip> -U <user> -P <pass> -I lanplus fru print

# BMC network configuration
ipmitool -H <bmc-ip> -U <user> -P <pass> -I lanplus lan print 1

# BMC user accounts
ipmitool -H <bmc-ip> -U <user> -P <pass> -I lanplus user list 1

# Cipher suites supported by the BMC
ipmitool -H <bmc-ip> -U <user> -P <pass> -I lanplus channel getciphers ipmi
```

**Parsing ipmitool output.** `ipmitool` outputs plain text. `sdr list` produces one sensor per line with fields separated by pipes and spaces. `sel list` gives timestamp, sensor name, and description as a human-readable string. There is no JSON mode, no structured output option. If you are building automation against IPMI, you are writing text parsing code. This is one of the concrete reasons Redfish exists.

A common pattern for automation:

```bash
# Pull power status and capture just the state
STATE=$(ipmitool -H "$BMC_IP" -U "$USER" -P "$PASS" -I lanplus power status 2>/dev/null | awk '{print $NF}')
```

Know that this breaks if ipmitool changes its output format between versions or if a vendor's firmware produces slightly different text.

## IPMI-over-LAN vs. local system interface

When IPMI automation runs on the host itself (a daemon, a provisioning agent, a telemetry collector), it can talk to the BMC directly via the local kernel interface instead of going over the network.

```bash
# Local — no -H, -U, -P required
ipmitool power status
ipmitool sdr list
ipmitool sel list
```

The local interface does not require BMC credentials. The kernel driver (`/dev/ipmi0`) provides a trusted channel — if you can write to the device, you have access. This matters for automation design: a local agent does not need BMC credentials stored on disk or passed as environment variables.

**When to use each:**

| | Local interface | IPMI-over-LAN |
| --- | --- | --- |
| Where it runs | On the managed host | On any machine with network access to the BMC |
| Requires credentials | No | Yes |
| Use cases | On-host telemetry agents, provisioning scripts | Remote management, out-of-band access when OS is down |
| Requires network | No | Yes — management network |

## Security considerations

IPMI has a documented, published vulnerability profile. You need to understand it because it directly shapes how production fleets are built.

**Cipher suite 0.** The IPMI 2.0 specification defines cipher suite 0 as "no authentication, no integrity, no confidentiality." It was included in the spec and shipped enabled by default on many BMCs. A client using cipher suite 0 can authenticate as any user on the BMC with no password. This is not a firmware bug — it is a spec-defined feature with no safe use case. Check whether it is enabled:

```bash
ipmitool -H <bmc-ip> -U "" -P "" -I lanplus -C 0 chassis power status
```

If that returns a result, cipher suite 0 is enabled. Disable it via the vendor's BMC configuration interface.

**RAKP authentication flaw (cipher suite 3).** The RAKP handshake that IPMI 2.0 uses for remote authentication has a structural problem: the server returns an HMAC computed over the BMC password's hash during the handshake, before the client has authenticated. An attacker who can reach UDP 623 can initiate a handshake, collect that HMAC, and brute-force the password hash offline. This does not require any existing credentials. Tools like `ipmipwd` and modules in Metasploit implement this attack.

**Credential reuse.** BMC credentials are typically set once during fleet provisioning and shared across machines in the same deployment. A single compromised credential set often works across hundreds of BMCs.

**The rule: IPMI must not be reachable from untrusted networks.** This is not a best practice recommendation — it is a hard requirement given the above. Production fleets handle this with:

- A dedicated out-of-band management network, physically separate from production traffic, on its own VLAN
- Firewalls blocking UDP 623 from anything except management infrastructure
- Bastion/jump hosts as the only path into the management network — engineers SSH to a bastion, then reach BMCs from there
- BMC interfaces with DHCP disabled and static IPs assigned from a management address space

If you are joining a team that manages servers and the IPMI network is not isolated this way, that is a real security risk worth raising.

**Cipher suite selection in automation.** Always specify `-C 3` (or the cipher suite your organization has standardized on) explicitly in automation rather than letting `ipmitool` negotiate. Unspecified negotiation can fall back to weaker suites.

## Where IPMI still shows up today

**Older hardware.** Servers from before roughly 2018 commonly support IPMI but not Redfish, or support a Redfish implementation so early and incomplete that it is not usable. That hardware does not disappear when Redfish is standardized — it stays in the fleet until it is physically retired.

**Existing automation.** Large infrastructure organizations have years of tooling built against IPMI. Rewriting that tooling requires time, testing, and coordination across teams. Functional IPMI automation that has been running for years is often left running rather than migrated to Redfish until there is a specific reason to change it.

**Provisioning workflows.** Some pre-OS provisioning workflows were built against IPMI before vendor Redfish implementations were mature. These workflows — PXE triggering, firmware staging, initial configuration — sometimes remain IPMI-based even when the fleet has moved to Redfish for ongoing management.

**Simple one-off operations.** When you need to check a sensor or power-cycle a machine quickly, `ipmitool` is fast and requires no setup. For ad hoc operations against a known machine, it is often the fastest path even if your fleet's automation is Redfish-based.

**The lifespan reality.** Server hardware has a useful life of five to seven years or longer. A server purchased in 2019 running only IPMI may not be retired until 2026 or later. IPMI will be present in production environments for the duration of your early career regardless of where the industry is heading.

## Resume takeaway

### Keywords worth working in

Out-of-band management, IPMI, ipmitool, hardware lifecycle management, fleet automation, BMC security, management network isolation, hardware sensor telemetry, Serial-over-LAN

### Project ideas

1. **BMC health collector** A script or daemon that connects to a list of BMC IPs via IPMI, pulls SDR sensor data, and writes structured output (JSON or a time-series format). Demonstrates real fleet instrumentation work and directly addresses the text-parsing challenge of IPMI automation.
2. **SEL parser and alerter** A tool that reads the System Event Log from a list of machines, parses the events, and surfaces anything that looks like a hardware problem (uncorrectable memory errors, thermal threshold crossings, PSU failures). Shows understanding of hardware failure signals that matter in production.
3. **BMC security auditor** A script that checks a list of BMCs for cipher suite 0 being enabled and reports which ones are vulnerable. Forces you to understand the IPMI security model and produces something directly useful in any fleet.

### Sample bullet

> "Built an IPMI-based BMC telemetry collector that scraped sensor data from a fleet of servers, parsed structured output from ipmitool, and surfaced hardware anomalies before they caused outages."

## References

- [Intel IPMI Specification v2.0 — intel.com](https://www.intel.com/content/www/us/en/products/docs/servers/ipmi/ipmi-second-gen-interface-spec-v2-rev1-1.html)
- [ipmitool man page — linux.die.net](https://linux.die.net/man/1/ipmitool)
- [Dan Farmer: IPMI Freight Train to Hell (2013) — fish2.com](https://fish2.com/ipmi/itrain.pdf)
- [CISA Advisory: Risks of Using IPMI — cisa.gov](https://www.cisa.gov/news-events/alerts/2013/07/26/risks-using-intelligent-platform-management-interface-ipmi)
- [OpenBMC documentation — github.com/openbmc](https://github.com/openbmc/docs)
