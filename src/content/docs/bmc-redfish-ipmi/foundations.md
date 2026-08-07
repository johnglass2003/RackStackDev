---
title: Foundations
description: What a BMC is, what it does, and why it's important
sidebar:
  label: Foundations
  order: 1
---

A BMC is a separate chip with its own CPU, RAM, firmware, and network port, soldered onto the server motherboard. It provides the ability to manage a server, even when it crashes.

## What a BMC physically is

A BMC (Baseboard Management Controller) is what's called a System on Chip, or SoC, that is embedded directly on the server's motherboard. It runs its own firmware independently of the host CPU and OS. It has its own dedicated network interface, separate from the NICs the OS uses for traffic during production.

## Why it exists and what it can do

As I mentioned earlier, if your server crashes the BMC gives you a management channel independent of the OS and its state.

What you can do through the BMC:

- Power the server on, off, or cycle it from anywhere
- Read hardware sensors to get information like temperature, fan speed, voltage, etc. before or without an OS running
- Access a serial console when SSH is down
- Read hardware inventory
- View the system event log that gives a hardware-level record of failures, events, errors
- Provision a new server before an OS is installed

## Vendor names

Every major server vendor ships a BMC.

| Vendor | BMC Name |
| --- | --- |
| Dell | iDRAC (Integrated Dell Remote Access Controller) |
| HPE | iLO (Integrated Lights-Out) |
| Lenovo | XCC (XClarity Controller) |
| Supermicro | IPMI / BMC (no proprietary name) |

## Standby power

The BMC runs on what is called standby power. A server that is "powered off" still has a running BMC, unless it is fully unplugged.

## Out-of-band vs. in-band management

| | In-band | Out-of-band |
| --- | --- | --- |
| Path | Through the host OS, over the production network | Through the BMC, over the management network |
| Requires OS | Yes | No |
| Common tools | SSH and agents | ipmitool and Redfish API |
| Use cases | Standard operations like log collection, CLI, software updates, system monitoring | Recovery, provisioning, hardware ops |

## Why this matters at scale

Even a single server with a crashed OS is a problem. That is capacity that is sitting there and going unused until someone fixes it. Issues across these massive fleets commonly surface in numbers and even a hundred servers going down without out-of-band access would be a crisis. Imagine having to navigate these large warehouses of racks trying to manually power cycle them in order to bring them back into production-ready states.

At scale, the BMC is the API that makes hardware automation possible. Fleet provisioning, firmware rollouts, power management, failure detection all go through the BMC regardless of problems on your servers.

## Resume takeaway

### Resume keywords

Out-of-band management, hardware lifecycle management, fleet automation, provisioning

## References

- [Intel IPMI Specification v2.0 — intel.com](https://www.intel.com/content/www/us/en/products/docs/servers/ipmi/ipmi-second-gen-interface-spec-v2-rev1-1.html)
- [DMTF Redfish Specification — dmtf.org](https://www.dmtf.org/standards/redfish)
- [OpenBMC](https://github.com/openbmc/docs)
