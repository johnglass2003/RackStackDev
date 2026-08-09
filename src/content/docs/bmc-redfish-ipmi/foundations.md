---
title: Foundations - BMC
description: What a BMC is, what it does, and why it's important
sidebar:
  label: Foundations - BMC
  order: 1
---

A BMC (Baseboard Management Controller) is a small embedded computer on the server motherboard. It runs independently of the host CPU and OS, so it can still work when the server is down, hung, or otherwise inaccessible.

## What it can do

Through the BMC, you can usually:

- Power the server on, off, or cycle it
- Read hardware sensors such as temperature, fan speed, and voltage
- Access a serial console when SSH is unavailable
- Read hardware inventory
- View the system event log for hardware-level failures and events
- Provision a server before the OS is installed

## Vendor names

| Vendor | BMC Name |
| --- | --- |
| Dell | iDRAC |
| HPE | iLO |
| Lenovo | XCC |
| Supermicro | BMC / IPMI |

## Standby power

The BMC runs on standby power. A server that is "powered off" can still have a working BMC unless it is fully unplugged.

## Out-of-band vs. in-band management

| | In-band | Out-of-band |
| --- | --- | --- |
| Path | Through the host OS, over the production network | Through the BMC, over the management network |
| Requires OS | Yes | No |
| Common tools | SSH and agents | ipmitool and Redfish API |
| Use cases | Standard operations like log collection and software updates | Recovery, provisioning, and hardware operations |

## Why this matters

At scale, the BMC is the control plane for hardware operations. If a host is hung, powered off, or missing an OS, the BMC is often the only reliable way to recover or inspect it.

## References

- [Intel IPMI Specification v2.0 — intel.com](https://www.intel.com/content/www/us/en/products/docs/servers/ipmi/ipmi-second-gen-interface-spec-v2-rev1-1.html)
- [DMTF Redfish Specification — dmtf.org](https://www.dmtf.org/standards/redfish)
- [OpenBMC](https://github.com/openbmc/docs)
