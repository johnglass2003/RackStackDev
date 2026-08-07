---
title: Redfish in Practice
description: The REST/JSON model, core resource types, authentication, making your first API call, and why Redfish matters for automation at scale.
sidebar:
  label: Redfish in Practice
  order: 4
---

Redfish is what server management looks like when you design it for the modern world — HTTP, JSON, standard auth, self-describing schemas. It's where the industry is heading, and if you're writing any kind of infrastructure automation that touches hardware, Redfish is what you want to be building against.

This page covers the model, the resource structure, and how to actually make calls — starting with curl, building toward real automation.

## REST/JSON model — what makes it different from IPMI

_Content coming — topics to cover:_

- HTTP/HTTPS transport — standard web protocols, works with any HTTP client
- JSON responses — structured, machine-readable, no text parsing
- HTTP verbs map to operations: GET reads state, POST triggers actions, PATCH modifies configuration
- Hypermedia links: responses include `@odata.id` links to related resources — the API is self-navigating
- Every resource has a URI — you can bookmark and link directly to a system, a sensor, a log entry
- TLS by default — not UDP with optional encryption
- Why this matters for tooling: any language with an HTTP client can talk Redfish; ipmitool is the only IPMI client anyone uses

## Core resource types

_Content coming — topics to cover:_

- `Systems` — the server itself: power state, boot configuration, processor/memory inventory
- `Chassis` — the physical enclosure: temperatures, fans, PSUs, physical location
- `Managers` — the BMC itself: network config, firmware version, log access
- `Sessions` — auth session management: creating and deleting session tokens
- `EventService` — subscribing to hardware events (push model vs. IPMI's polling)
- The resource tree: how these link together and how you navigate from root to a specific sensor
- `/redfish/v1/` — the root endpoint, where every Redfish interaction starts

## Authentication

_Content coming — topics to cover:_

- Session-based auth: POST to `/redfish/v1/SessionService/Sessions`, get a token back
- Token in `X-Auth-Token` header on subsequent requests
- Session lifecycle: sessions expire, have to be managed
- Basic auth: also supported, simpler for one-off scripts but not for production automation
- Why session tokens over basic auth: avoids sending credentials on every request
- Role-based access: Redfish has defined roles (Administrator, Operator, ReadOnly)

## Making your first Redfish call

_Content coming — topics to cover:_

- Prerequisites: access to a BMC's management IP, credentials, curl or Python
- Example: GET system power state
- Example: POST to power cycle a system
- Example: GET sensor readings from Chassis/Thermal
- Handling self-signed certificates (`-k` in curl — when it's acceptable and when it isn't)
- Reading `@odata.id` links and following them to explore the resource tree
- Python example using `requests` — structuring a simple Redfish client

## redfishtool and client libraries

_Content coming — topics to cover:_

- `redfishtool` — DMTF's official reference CLI, analogous to ipmitool for Redfish
- `python-redfish-library` — DMTF's Python client library
- Vendor SDKs: iDRAC's python-redfish-utility, HPE's ilorest
- When to use a library vs. raw HTTP: libraries handle session management, retries, schema navigation
- When raw HTTP is fine: one-off queries, quick debugging, environments where you can't install packages

## Schema-driven design — why it matters for automation at scale

_Content coming — topics to cover:_

- DMTF publishes JSON schemas for every Redfish resource type
- Vendors implement against the standard — a `ComputerSystem` on a Dell has the same fields as on an HPE
- One automation client can manage a multi-vendor fleet without vendor-specific branches
- IPMI's problem by contrast: every vendor named their sensors differently, structured their data differently
- Mockups and emulators: the DMTF publishes a Redfish mockup server for local development — you can build and test without real hardware
- Schema versioning: how Redfish handles backward compatibility as the standard evolves

## Resume takeaway

### Keywords worth working in

_Content coming._

### Project ideas

_Content coming._

### Sample bullet

_Content coming._

## References

_References coming._
