---
title: The Protocol Landscape
description: The practical difference between IPMI, Redfish, and SNMP for server management
sidebar:
  label: Protocol Landscape
  order: 2
---

You will mostly deal with three management protocols in datacenter work: IPMI, Redfish, and SNMP.

| Protocol | Best use | Reality |
| --- | --- | --- |
| IPMI | Legacy server management | Still common on older fleets, but awkward and weaker on security |
| Redfish | New server-management automation | Structured, vendor-standardized, and easier to build against |
| SNMP | Monitoring and traps | Common on network gear and older environments, not a great base for control workflows |

## IPMI

IPMI is the older standard. It is still common on older servers and is usually the fallback when newer APIs are not available.

- Transport: UDP 623, usually over RMCP
- Typical use: power control, sensors, event log, console access, inventory
- Reality: it is older, less consistent, and comes with more security baggage than Redfish

If you need to work with old hardware, you will likely run into IPMI and tools like `ipmitool`.

## Redfish

Redfish is the modern standard.

- Transport: HTTP/HTTPS
- Payloads: JSON
- Model: REST-style API with resource URLs like `/redfish/v1/`
- Typical use: power control, sensors, logs, inventory, configuration
- Why it matters: it is standardized across vendors, so one client can often work across Dell, HPE, Lenovo, and others

A good rule is: if the hardware supports Redfish and you are building new automation, start there.

## SNMP

SNMP is older than both. You will see it a lot in networking gear, PDUs, UPS systems, and some legacy monitoring setups.

- It is mostly about polling values and receiving traps
- It is useful for monitoring, but not the best base for modern server-management automation
- In practice, you will encounter it, but you usually would not build new power-control or provisioning workflows on top of it

## What matters on the job

- Do not assume Redfish is available just because the hardware is new
- In many fleets, you will find a mix of old and new systems
- Before writing automation, check what the target actually supports
- If you are debugging a BMC issue, know which protocol your tool is speaking
- If security matters, IPMI usually needs more caution and tighter network isolation than Redfish

## References

- [DMTF Redfish Specification — dmtf.org](https://www.dmtf.org/standards/redfish)
- [Intel IPMI Specification v2.0 — intel.com](https://www.intel.com/content/www/us/en/products/docs/servers/ipmi/ipmi-second-gen-interface-spec-v2-rev1-1.html)
- [IPMI Security Best Practices — US-CERT](https://www.cisa.gov/news-events/alerts/2013/07/26/risks-using-intelligent-platform-management-interface-ipmi)
- [DMTF Redfish Schema Bundle — dmtf.org](https://redfish.dmtf.org/schemas/)
- [RFC 3411 — SNMP Architecture](https://datatracker.ietf.org/doc/html/rfc3411)
