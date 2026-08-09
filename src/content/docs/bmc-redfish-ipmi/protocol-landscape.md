---
title: The Protocol Landscape
description: The practical difference between IPMI, Redfish, and SNMP for server management
sidebar:
  label: Protocol Landscape
  order: 2
---

You will mostly deal with three management protocols in datacenter work: IPMI, Redfish, and SNMP. The useful mental model is:

- IPMI: old, common, and still everywhere on older hardware
- Redfish: modern, standardized, and the direction new hardware is moving
- SNMP: mostly for monitoring and network gear, not the default choice for new server-management automation

## IPMI

IPMI is the older standard. It is still common on older servers and is usually the fallback when newer APIs are not available.

- Transport: UDP 623, usually over RMCP
- Typical use: power control, sensors, event log, console access, inventory
- Reality: it is older, less consistent, and often feels more tooling-heavy than Redfish

If you need to work with old hardware, you will likely run into IPMI and tools like ipmitool.

## Redfish

Redfish is the modern standard. It is the one you should prefer for new automation.

- Transport: HTTP/HTTPS
- Payloads: JSON
- Model: REST-style API with resource URLs like `/redfish/v1/`
- Typical use: power control, sensors, logs, inventory, configuration
- Why it matters: it is standardized across vendors, so one client can often work across Dell, HPE, Lenovo, and others

A good rule is: if the hardware supports Redfish, use Redfish.

## SNMP

SNMP is older than both. You will see it a lot in networking gear, PDUs, UPS systems, and some legacy monitoring setups.

- It is mostly about polling values and receiving traps
- It is useful for monitoring, but not the best base for modern server-management automation
- In practice, you will encounter it, but you usually would not build new server-management workflows on top of it

## What matters on the job

- Do not assume Redfish is available just because the hardware is new
- In many fleets, you will find a mix of old and new systems
- Before writing automation, check what the target actually supports
- If you are debugging a BMC issue, know which protocol your tool is speaking

## Quick reference

If you remember one thing, remember this:

- IPMI = old, common, and still real
- Redfish = modern, standardized, and preferred
- SNMP = monitoring/legacy tooling, not your default path for new server automation

## References

- [DMTF Redfish Specification — dmtf.org](https://www.dmtf.org/standards/redfish)
- [Intel IPMI Specification v2.0 — intel.com](https://www.intel.com/content/www/us/en/products/docs/servers/ipmi/ipmi-second-gen-interface-spec-v2-rev1-1.html)
- [IPMI Security Best Practices — US-CERT](https://www.cisa.gov/news-events/alerts/2013/07/26/risks-using-intelligent-platform-management-interface-ipmi)
- [Dan Farmer: IPMI: Freight Train to Hell (2013)](https://fish2.com/ipmi/itrain.pdf)
- [DMTF Redfish Schema Bundle — dmtf.org](https://redfish.dmtf.org/schemas/)
- [RFC 3411 — SNMP Architecture](https://datatracker.ietf.org/doc/html/rfc3411)
