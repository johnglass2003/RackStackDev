---
title: Redfish in Practice
description: The practical Redfish patterns you will use for modern server automation.
sidebar:
  label: Redfish in Practice
  order: 4
---

Redfish is the modern management API for servers. If you are writing automation against BMCs, this is the path you want to know.

## What it gives you

Redfish is useful because it is:

- HTTP/HTTPS-based
- JSON-based
- standardized across vendors
- better for automation than text-based IPMI tooling

The main things you will do with it are read server state, change power state, and inspect sensors or logs.

## The basic model

Redfish is a REST API. The important verbs are:

| Verb | Use |
| --- | --- |
| `GET` | Read state |
| `PATCH` | Change config |
| `POST` | Trigger an action |
| `DELETE` | Remove a resource |

You usually start at `/redfish/v1/` and follow links from there.

## The main resource areas

The ones you will see most often are:

- `/redfish/v1/Systems` - the server itself
- `/redfish/v1/Chassis` - the enclosure, temperatures, fans, power
- `/redfish/v1/Managers` - the BMC itself
- `/redfish/v1/SessionService/Sessions` - authentication sessions

A common working pattern is: discover the root, follow the `Systems` or `Chassis` link, then read the resource you care about.

## Authentication

For quick manual use, basic auth works:

```bash
curl -sk -u admin:password https://<bmc-ip>/redfish/v1/Systems/1
```

For automation, session-based auth is better. Create a session, keep the token, and delete it when you are done.

```bash
curl -sk -X POST https://<bmc-ip>/redfish/v1/SessionService/Sessions \
  -H "Content-Type: application/json" \
  -d '{"UserName": "admin", "Password": "password"}'
```

## Your first useful calls

### Read power state

```bash
curl -sk -u admin:password https://<bmc-ip>/redfish/v1/Systems/1
```

### Power actions

```bash
curl -sk -u admin:password -X POST \
  https://<bmc-ip>/redfish/v1/Systems/1/Actions/ComputerSystem.Reset \
  -H "Content-Type: application/json" \
  -d '{"ResetType": "GracefulShutdown"}'
```

Other common values include `ForceOff`, `PowerCycle`, and `GracefulRestart`.

### Read thermal data

```bash
curl -sk -u admin:password https://<bmc-ip>/redfish/v1/Chassis/1/Thermal
```

That is where you will usually find temperatures and fan information.

## Practical notes

- `-k` is common because BMCs often use self-signed certificates
- Use session auth for anything more than a quick one-off check
- If a vendor firmware is older, some fields or actions may be missing
- The API is structured JSON, so it is much easier to automate than IPMI

## Why it matters

Redfish is the direction new hardware management is moving. It is the one you should prefer when you have a choice, especially for automation that needs to be reliable across vendors.

## References

- [DMTF Redfish Specification — dmtf.org](https://www.dmtf.org/standards/redfish)
- [DMTF Redfish Schema Bundle — redfish.dmtf.org](https://redfish.dmtf.org/schemas/)
- [DMTF Redfish Mockup Server — github.com/DMTF](https://github.com/DMTF/Redfish-Mockup-Server)
- [python-redfish-library — github.com/DMTF](https://github.com/DMTF/python-redfish-library)
- [sushy (OpenStack Ironic Redfish client) — opendev.org](https://opendev.org/openstack/sushy)
