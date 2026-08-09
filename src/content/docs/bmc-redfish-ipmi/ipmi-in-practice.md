---
title: IPMI in Practice
description: The commands and practical context you need to work with IPMI on real hardware.
sidebar:
  label: IPMI in Practice
  order: 3
---

IPMI is still common on older servers, and you will absolutely run into it in production. The useful thing to know is the small set of commands and security points that matter day to day.

## What you use it for

IPMI is mostly used for:

- Powering a server on, off, or cycling it
- Reading sensor data like temperature, fan speed, and voltage
- Checking the system event log
- Accessing the serial console over LAN
- Pulling hardware inventory

## ipmitool

`ipmitool` is the standard CLI for IPMI. The remote form you will use most often is:

```bash
ipmitool -H <bmc-ip> -U <user> -P <pass> -I lanplus <subcommand>
```

Use `lanplus` rather than `lan` when possible. `lanplus` is the modern IPMI 2.0 path and is the one you should expect to work with.

### Common commands

```bash
# Power state
ipmitool -H <bmc-ip> -U <user> -P <pass> -I lanplus power status
ipmitool -H <bmc-ip> -U <user> -P <pass> -I lanplus power on
ipmitool -H <bmc-ip> -U <user> -P <pass> -I lanplus power off
ipmitool -H <bmc-ip> -U <user> -P <pass> -I lanplus power cycle

# Sensors
ipmitool -H <bmc-ip> -U <user> -P <pass> -I lanplus sdr list
ipmitool -H <bmc-ip> -U <user> -P <pass> -I lanplus sdr type Temperature

# Event log
ipmitool -H <bmc-ip> -U <user> -P <pass> -I lanplus sel list

# Serial console
ipmitool -H <bmc-ip> -U <user> -P <pass> -I lanplus sol activate
# Exit SOL with: ~.

# Inventory
ipmitool -H <bmc-ip> -U <user> -P <pass> -I lanplus fru print
```

A practical detail: `ipmitool` output is plain text. If you build automation around it, expect to parse text rather than JSON.

## Local vs. remote

IPMI can also be used locally on the host itself via the kernel interface:

```bash
ipmitool power status
ipmitool sdr list
```

That local path is useful for on-host automation, but remote IPMI-over-LAN is what you will use for out-of-band access.

## Security points you should know

IPMI has a weak security story compared with modern management APIs. The two things to remember are:

- IPMI should not be reachable from untrusted networks
- Do not assume the BMC is safe just because it is “internal”

## Where it still shows up

You will still see IPMI in:

- older hardware
- existing automation that has not been migrated
- pre-OS provisioning workflows
- quick one-off operations when `ipmitool` is simply the fastest tool

## References

- [Intel IPMI Specification v2.0 — intel.com](https://www.intel.com/content/www/us/en/products/docs/servers/ipmi/ipmi-second-gen-interface-spec-v2-rev1-1.html)
- [ipmitool man page — linux.die.net](https://linux.die.net/man/1/ipmitool)
- [CISA Advisory: Risks of Using IPMI — cisa.gov](https://www.cisa.gov/news-events/alerts/2013/07/26/risks-using-intelligent-platform-management-interface-ipmi)
- [OpenBMC documentation — github.com/openbmc](https://github.com/openbmc/docs)
