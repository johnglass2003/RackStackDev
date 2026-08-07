---
title: IPMI in Practice
description: ipmitool commands, IPMI-over-LAN, security considerations, and where IPMI still shows up in production environments.
sidebar:
  label: IPMI in Practice
  order: 3
---

IPMI is old and has real security problems, but it's also on nearly every server in production today. Knowing how to use it is not optional — it's something you will run into whether you want to or not. This page covers the actual commands, the security landscape you need to understand, and a realistic picture of where IPMI still lives.

## Core capabilities

_Content coming — topics to cover:_

- Power control: power on, power off, power cycle, reset
- Sensor monitoring: temperature, fan speed, voltage, PSU status
- System Event Log (SEL): hardware event history — POST failures, thermal events, correctable/uncorrectable errors
- Serial-over-LAN (SOL): redirecting the server's serial console over the IPMI channel — how you get a console when SSH is down
- FRU (Field Replaceable Unit) data: reading hardware inventory (model, serial numbers, part numbers) without touching the OS

## ipmitool

_Content coming — topics to cover:_

- What ipmitool is: the standard open-source CLI for IPMI
- Two modes: local (via `/dev/ipmi0` kernel driver) and remote (over LAN with `-H`, `-U`, `-P`)
- Command structure walkthrough
- Key commands with examples:
  - `ipmitool power status / on / off / cycle / reset`
  - `ipmitool sdr list` — sensor data repository
  - `ipmitool sel list` — system event log
  - `ipmitool sol activate` — serial-over-LAN console
  - `ipmitool fru print` — hardware inventory
  - `ipmitool lan print` — BMC network configuration
  - `ipmitool user list` — BMC user accounts
- Parsing ipmitool output in scripts — it's text, not JSON, which is one of the reasons Redfish exists

## IPMI-over-LAN vs. local system interface

_Content coming — topics to cover:_

- Local: talking to the BMC from within the OS via the IPMI kernel module (`/dev/ipmi0`)
- Over-LAN: talking to the BMC remotely over the network using RMCP/RMCP+ (UDP 623)
- When you use each: local for automation running on the host, LAN for remote management and out-of-band access
- Authentication differences: local generally doesn't require credentials, LAN requires BMC username/password
- `ipmitool` flag differences: local needs no `-H` flag, LAN requires `-H <bmc-ip> -U <user> -P <pass> -I lanplus`

## Security considerations

_Content coming — topics to cover:_

- IPMI's documented vulnerabilities — why it's a known attack surface
- Cipher suite 0: the "anonymous" cipher that allows authentication bypass — still enabled by default on many BMCs
- Cipher suite 3 flaw (RAKP authentication): HMAC is computed over the password hash, allowing offline brute-force
- IPMI credentials often shared across a fleet — compromise of one BMC gives you a template for others
- The rule: IPMI should never be exposed to untrusted networks
- How production fleets handle this: dedicated out-of-band management network, isolated from production traffic
- Bastion/jump host pattern for reaching the management network
- Why this shapes fleet network architecture: the BMC network is a separate VLAN with strict access controls

## Where IPMI still shows up today

_Content coming — topics to cover:_

- Older hardware that doesn't support Redfish
- Automation that was written against IPMI and hasn't been migrated
- Scenarios where the simplicity of ipmitool is still the fastest path
- Firmware flashing and pre-OS operations where Redfish support may be limited
- The reality: IPMI won't disappear from production for many years — it outlasts the hardware refresh cycle

## Resume takeaway

### Keywords worth working in

_Content coming._

### Project ideas

_Content coming._

### Sample bullet

_Content coming._

## References

_References coming._
