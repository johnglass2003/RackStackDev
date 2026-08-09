---
title: Terminology
description: Key terms and definitions for BMC, Redfish, and IPMI concepts in data center infrastructure.
sidebar:
  label: Terminology
  order: 5
---

- **BMC** - Baseboard Management Controller; the embedded controller that gives you out-of-band access to a server.
- **iDRAC** - Dell's BMC implementation.
- **iLO** - HPE's BMC implementation.
- **XCC** - Lenovo's BMC implementation.
- **IPMI** - An older server management standard still common on legacy hardware.
- **Redfish** - A modern REST/JSON API for managing servers and BMCs.
- **DMTF** - The standards body that publishes the Redfish spec.
- **Out-of-band management** - Managing a server through the BMC instead of the OS.
- **In-band management** - Managing a server through the OS over the normal network.
- **SoC** - System on Chip; a small integrated computer like the BMC chip.
- **Standby power** - Power that keeps the BMC alive even when the server is off.
- **RMCP / RMCP+** - The network transport used by IPMI; RMCP+ is the newer IPMI 2.0 form.
- **SOL** - Serial-over-LAN; remote access to the server's serial console.
- **SEL** - System Event Log; the BMC's hardware-level event log.
- **FRU** - Field Replaceable Unit; hardware inventory information stored on the BMC.
- **SDR** - Sensor Data Repository; the collection of hardware sensor readings exposed by IPMI.
- **SNMP** - An older monitoring protocol common in networking gear and legacy environments.
- **Management network** - A separate network used for BMC and out-of-band access.
- **Cipher suite** - A set of crypto algorithms used for IPMI authentication and encryption.
- **RAKP** - The IPMI authentication handshake used for remote login.
- **@odata.id** - A Redfish link field pointing to a related resource.
- **REST** - A common web API style used by Redfish.
- **Session token** - A temporary Redfish credential used for authenticated API calls.
