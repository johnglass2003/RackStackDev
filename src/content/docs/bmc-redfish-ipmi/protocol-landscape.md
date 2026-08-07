---
title: The Protocol Landscape
description: IPMI, Redfish, and SNMP — what each protocol is, why the industry is migrating, and what you'll actually see on the job.
sidebar:
  label: Protocol Landscape
  order: 2
---

Once you understand what a BMC is, the next question is: how do you talk to it? The answer has changed significantly over the past decade. IPMI was the default for years and is still everywhere. Redfish is the modern standard and is where things are heading. SNMP predates both and still shows up in legacy monitoring stacks.

This page maps the protocol landscape — what each one is, why things moved the way they did, and what "the job" actually looks like in a fleet that hasn't finished migrating.

## IPMI — the original standard

_Content coming — topics to cover:_

- Origin: Intel-led consortium, first spec published in 1998
- What it standardized: a common interface for hardware-level server management across vendors
- Core transport: runs over UDP port 623, binary protocol
- What it gave the industry: vendor-independent power control, sensor reads, SEL (System Event Log), Serial-over-LAN
- Why it became the default: every server shipped with IPMI support for ~20 years
- IPMI versions: 1.5 and 2.0 — what changed (encryption, RMCP+)

## Why the industry moved toward Redfish

_Content coming — topics to cover:_

- IPMI's fragmentation: vendors implemented extensions inconsistently — "IPMI" on a Dell behaves differently than on an HPE
- Security problems: well-documented vulnerabilities in IPMI 2.0 (cipher suite 0, cipher suite 3 flaws, RAKP authentication bypass)
- Protocol age: binary, UDP-based, no real concept of structured schemas or discoverability
- Scaling problems: no good automation story — scripting IPMI means wrapping ipmitool and parsing its text output
- No standard schema: two servers that both "support IPMI" might expose different sensor names, different fields, different behavior

## Redfish

_Content coming — topics to cover:_

- What it is: a REST/JSON-based standard from the DMTF (Distributed Management Task Force), first released in 2015
- Designed as IPMI's modern successor — same core use cases, completely different architecture
- HTTP/HTTPS transport — standard web protocols instead of a custom binary protocol
- JSON payloads with defined schemas — machine-readable, consistent across vendors
- Hypermedia-driven: responses include links to related resources, making the API self-describing
- Why it's better for automation: one client can work across vendors because the schema is standardized
- Redfish versions and the DMTF update cadence

## Where SNMP fits in

_Content coming — topics to cover:_

- Simple Network Management Protocol — predates IPMI, designed for network devices (switches, routers)
- Still used for basic hardware monitoring in some fleets: trap alerts, OID-based sensor reads
- SNMP v1/v2c vs. v3 — security differences (v1/v2c send community strings in plaintext)
- Why it's mostly legacy at this point for server management: limited capabilities, vendor MIBs are inconsistent
- Where you still see it: older monitoring stacks, network devices, environments that haven't migrated

## Reality on the job: mid-migration fleets

_Content coming — topics to cover:_

- Most production fleets are not running pure Redfish — they're somewhere in the middle
- Older servers that only support IPMI, newer servers that support both, some that are Redfish-only
- The practical implication: you need to be able to work with both protocols, not just the new one
- Tooling reality: some automation targets IPMI, some targets Redfish, some abstracts both
- What "migration" actually looks like: it's not a switch flip, it's years of incremental hardware refresh

## Resume takeaway

### Keywords worth working in

_Content coming._

### Project ideas

_Content coming._

### Sample bullet

_Content coming._

## References

_References coming._
