---
title: Redfish in Practice
description: The REST/JSON model, core resource types, authentication, making your first API call, and why Redfish matters for automation at scale.
sidebar:
  label: Redfish in Practice
  order: 4
---

Redfish is what server management looks like when you design it for the modern world — HTTP, JSON, standard auth, self-describing schemas. It is where the industry is heading, and if you are writing any kind of infrastructure automation that touches hardware, Redfish is what you want to be building against.

This page covers the model, the resource structure, and how to actually make calls — starting with curl, building toward real automation.

## REST/JSON model — what makes it different from IPMI

Redfish is a REST API. If you have consumed any web API before, the concepts are the same. The differences from IPMI are fundamental enough that it is worth making them explicit.

**HTTP/HTTPS transport.** Redfish runs on the same protocol stack as every web service you have ever built against. Port 443 (HTTPS) by default, with TLS. Any HTTP client works — curl, Python requests, Go net/http, wget. There is no specialized client library required.

**JSON responses.** Every Redfish response is a JSON document. Fields have defined names and types. You parse JSON, not text. The field `PowerState` is always `PowerState`, not `Power State` on one vendor and `power_state` on another.

**HTTP verbs map to operations:**

| Verb | What it does |
| --- | --- |
| `GET` | Read current state |
| `PATCH` | Modify configuration |
| `POST` | Trigger an action (power cycle, create a session) |
| `DELETE` | Remove a resource (delete a session, delete a log entry) |

**Hypermedia navigation.** Responses include `@odata.id` fields that contain the URIs of related resources. You start at `/redfish/v1/` and follow links rather than constructing URLs from documentation. The API describes itself.

**TLS by default.** Redfish is HTTPS. The credential exchange is encrypted in transit. This is a meaningful improvement over IPMI-over-LAN, where credentials are protected only by the RAKP handshake, which has known weaknesses.

## Core resource types

The Redfish resource tree is organized into a small set of top-level collections. Understanding these is the mental model you need before making any calls.

**`/redfish/v1/Systems`** — represents the server itself. Each entry is a `ComputerSystem` resource containing:
- Current power state
- Boot configuration (what to boot next, boot order)
- Processor count, memory size, memory summary
- Links to the chassis it lives in and the BMC managing it
- An `Actions` block for operations like power reset

**`/redfish/v1/Chassis`** — represents the physical enclosure. Contains:
- Temperature sensors and fan readings (under `Thermal`)
- Power supply status and power consumption readings (under `Power`)
- Physical location data
- Links to the systems housed in this chassis

**`/redfish/v1/Managers`** — represents the BMC itself. Contains:
- BMC firmware version
- BMC network interface configuration
- Access to the system event log (under `LogServices`)
- Virtual media configuration
- Links to the systems this manager manages

**`/redfish/v1/SessionService/Sessions`** — manages authentication sessions. POST here to create a session and receive a token. DELETE a session to log out.

**`/redfish/v1/EventService`** — configures event subscriptions. Instead of polling for changes, you register a webhook endpoint and the BMC pushes event notifications to you when hardware events occur. This is the Redfish equivalent of SNMP traps, but over HTTP.

**How the tree fits together:**

```
/redfish/v1/
├── Systems/
│   └── 1/                    ← the server
│       └── Actions/
│           └── ComputerSystem.Reset
├── Chassis/
│   └── 1/                    ← the physical enclosure
│       ├── Thermal           ← temperatures, fans
│       └── Power             ← PSUs, power draw
├── Managers/
│   └── BMC/                  ← the BMC
│       └── LogServices/
│           └── Sel/          ← system event log
│               └── Entries/
└── SessionService/
    └── Sessions/
```

The exact paths vary by vendor and hardware. Use the links in responses rather than hardcoding paths.

## Authentication

Redfish supports two auth methods. Use session tokens for any automation that makes more than one request. Use basic auth only for one-off manual calls.

**Session-based auth:**

1. POST to `/redfish/v1/SessionService/Sessions` with username and password in the body
2. The response includes an `X-Auth-Token` header containing the session token
3. Include that token as `X-Auth-Token: <token>` on all subsequent requests
4. DELETE the session resource when done (the URI is in the response `Location` header)

```bash
# Create a session
curl -sk -X POST https://<bmc-ip>/redfish/v1/SessionService/Sessions \
  -H "Content-Type: application/json" \
  -d '{"UserName": "admin", "Password": "password"}' \
  -i | grep -E "X-Auth-Token|Location"

# Use the token
curl -sk -H "X-Auth-Token: <token>" \
  https://<bmc-ip>/redfish/v1/Systems/1
```

Sessions expire. BMC firmware varies on timeout — common values are 30 minutes to a few hours of inactivity. Production automation needs to handle session expiry and re-authenticate.

**Basic auth:**

```bash
curl -sk -u admin:password https://<bmc-ip>/redfish/v1/Systems/1
```

Basic auth sends credentials on every request. The credentials are base64-encoded (not encrypted) in the Authorization header, so this requires TLS to be meaningful. Fine for ad hoc calls from a trusted workstation, not appropriate for stored automation where credentials would appear in logs or process lists.

**Roles.** Redfish defines standard roles: `Administrator` (full access), `Operator` (most operations, no user management), `ReadOnly` (GET only). Automation should run under the least privileged role that allows the operations it needs.

## Making your first Redfish call

These examples use curl. `-s` suppresses progress output. `-k` skips TLS certificate verification — BMCs ship with self-signed certificates, so `-k` is common in internal environments. See the note on certificates below.

**GET: read power state**

```bash
curl -sk -u admin:password \
  https://<bmc-ip>/redfish/v1/Systems/1 \
  | python3 -m json.tool | grep PowerState
```

The response is a full `ComputerSystem` object. `PowerState` will be `"On"`, `"Off"`, or `"PoweringOn"` / `"PoweringOff"` during transitions.

**POST: trigger a power action**

```bash
# Graceful shutdown (OS-cooperative)
curl -sk -u admin:password -X POST \
  https://<bmc-ip>/redfish/v1/Systems/1/Actions/ComputerSystem.Reset \
  -H "Content-Type: application/json" \
  -d '{"ResetType": "GracefulShutdown"}'

# Hard power off (immediate, like pulling the plug)
curl -sk -u admin:password -X POST \
  https://<bmc-ip>/redfish/v1/Systems/1/Actions/ComputerSystem.Reset \
  -H "Content-Type: application/json" \
  -d '{"ResetType": "ForceOff"}'

# Power cycle
curl -sk -u admin:password -X POST \
  https://<bmc-ip>/redfish/v1/Systems/1/Actions/ComputerSystem.Reset \
  -H "Content-Type: application/json" \
  -d '{"ResetType": "PowerCycle"}'
```

Common `ResetType` values: `On`, `ForceOff`, `GracefulShutdown`, `GracefulRestart`, `ForceRestart`, `PowerCycle`. Not every BMC supports every value — the `AllowableValues` field in the `Actions` block of the System resource lists what the specific firmware supports.

**GET: temperature sensors**

```bash
curl -sk -u admin:password \
  https://<bmc-ip>/redfish/v1/Chassis/1/Thermal \
  | python3 -m json.tool
```

The response contains a `Temperatures` array. Each entry has `Name`, `ReadingCelsius`, `UpperThresholdCritical`, and `Status`. Fan readings are in the `Fans` array in the same document.

**Navigating with `@odata.id` links:**

```bash
# Start at root
curl -sk -u admin:password https://<bmc-ip>/redfish/v1/ | python3 -m json.tool

# Follow the Systems link from the root response
curl -sk -u admin:password https://<bmc-ip>/redfish/v1/Systems | python3 -m json.tool

# Members[0]["@odata.id"] gives you the path to the first system
```

**On self-signed certificates.** `-k` disables certificate verification. In a datacenter environment, BMC certificates are typically self-signed and not in any trust store, so `-k` is common practice for internal management tooling. For production automation, the right answer is to either install a known CA on BMCs during provisioning, or to fetch and pin the BMC's certificate on first connection. `-k` is acceptable for development and manual use; be deliberate about it in automation.

**Python example:**

```python
import requests
import urllib3

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

BMC = "https://192.168.1.100"
CREDS = ("admin", "password")

def get_power_state():
    r = requests.get(f"{BMC}/redfish/v1/Systems/1", auth=CREDS, verify=False)
    r.raise_for_status()
    return r.json()["PowerState"]

def power_action(reset_type):
    r = requests.post(
        f"{BMC}/redfish/v1/Systems/1/Actions/ComputerSystem.Reset",
        json={"ResetType": reset_type},
        auth=CREDS,
        verify=False,
    )
    r.raise_for_status()

print(get_power_state())
power_action("GracefulShutdown")
```

For anything beyond a few calls, replace basic auth with session-based auth and store the token in a variable rather than re-authenticating on every request.

## redfishtool and client libraries

**`redfishtool`** is the DMTF's reference CLI for Redfish, analogous to `ipmitool` for IPMI. It handles session management, follows `@odata.id` links, and provides subcommands for common operations.

```bash
pip install redfishtool

redfishtool -r <bmc-ip> -u admin -p password Systems
redfishtool -r <bmc-ip> -u admin -p password Chassis
redfishtool -r <bmc-ip> -u admin -p password reset ForceRestart
```

Useful for exploratory work and manual operations. Most teams build their own clients rather than depending on `redfishtool` in production automation, because it adds a dependency and its output format is not always convenient to parse.

**Client libraries:**

| Library | Language | Maintained by |
| --- | --- | --- |
| `python-redfish-library` | Python | DMTF |
| `iDRAC Python Redfish` | Python | Dell |
| `python-ilorest-library` | Python | HPE |
| `sushy` | Python | OpenStack community |

`sushy` is worth knowing if you work in an environment that uses OpenStack, as it is the Redfish client used by Ironic (the OpenStack bare-metal provisioning service).

**When to use a library vs. raw HTTP:**

Libraries handle session lifecycle, retries, and schema navigation for you. Use one when you are building automation that makes many calls over time or manages sessions explicitly. Raw `requests` (or curl) is fine for one-off scripts, debugging, or environments where you cannot install additional packages.

## Schema-driven design — why it matters for automation at scale

The DMTF publishes JSON Schema definitions for every Redfish resource type. These schemas define field names, types, allowed values, and relationships between resources. Vendor implementations are tested against them.

**What this means in practice:**

- A `ComputerSystem` on a Dell iDRAC has the same `PowerState` field, the same `ResetType` allowed values, and the same `Actions` structure as a `ComputerSystem` on an HPE iLO.
- Automation written against the DMTF schema works across vendors without vendor-specific branches.
- When a vendor extends the schema with proprietary fields, those fields use a vendor-namespaced prefix (e.g., `Dell.` or `Hpe.`). Standard fields are always standard.

Compare this to IPMI: two servers both claiming IPMI support could expose sensors under completely different names, structure their SDR data differently, and return different text formats from `ipmitool`. Multi-vendor IPMI automation requires vendor-specific branches everywhere.

**DMTF Redfish mockup server.** The DMTF publishes a static mockup of a complete Redfish resource tree. You can run it locally and develop automation against it without access to physical hardware. This is useful early in a project when hardware is not yet available, and for testing automation against vendor-specific resource layouts before deploying.

```bash
pip install Redfish-Mockup-Server
RedfishMockupServer -D /path/to/mockup
```

**Schema versioning.** Redfish schemas are versioned (e.g., `ComputerSystem.v1_13_0`). Vendors implement against specific schema versions. A BMC running an older firmware may not support fields added in recent schema versions. When building fleet automation, test against the oldest firmware version in your fleet, not just the newest. The `@odata.type` field in every response tells you which schema version that resource conforms to.

## Resume takeaway

### Keywords worth working in

Redfish API, REST/JSON infrastructure APIs, out-of-band management, hardware lifecycle management, fleet automation, schema-driven design, multi-vendor hardware management, bare-metal provisioning

### Project ideas

1. **Redfish fleet inventory collector** A script that connects to a list of BMC IPs via Redfish, pulls `Systems` and `Chassis` data, and outputs structured JSON inventory (model, serial number, memory, CPU count, power state). Demonstrates real fleet management work and multi-host Redfish automation.
2. **Hardware health dashboard** A tool that polls Redfish `Chassis/Thermal` and `Chassis/Power` endpoints across a list of BMCs and generates a summary — current temperatures, fan speeds, power draw, any sensors above threshold. Can be as simple as a CLI table or as complete as a web dashboard.
3. **Event subscription handler** A small HTTP server that registers itself as a Redfish event subscriber and receives push notifications from BMCs when hardware events occur (thermal alerts, power events, memory errors). Demonstrates understanding of the Redfish event model vs. polling, which is a meaningful capability difference from IPMI.

### Sample bullet

> "Built a Redfish-based fleet inventory and health monitoring system that collected hardware sensor data and power state across a multi-vendor server pool, enabling automated anomaly detection without OS-level access."

## References

- [DMTF Redfish Specification — dmtf.org](https://www.dmtf.org/standards/redfish)
- [DMTF Redfish Schema Bundle — redfish.dmtf.org](https://redfish.dmtf.org/schemas/)
- [DMTF Redfish Mockup Server — github.com/DMTF](https://github.com/DMTF/Redfish-Mockup-Server)
- [python-redfish-library — github.com/DMTF](https://github.com/DMTF/python-redfish-library)
- [redfishtool — github.com/DMTF](https://github.com/DMTF/Redfishtool)
- [sushy (OpenStack Ironic Redfish client) — opendev.org](https://opendev.org/openstack/sushy)
- [Dell iDRAC Redfish API Guide — dell.com](https://www.dell.com/support/manuals/en-us/idrac9-lifecycle-controller-v6.x-series/idrac9_6.xx_redfishapiguide/)
