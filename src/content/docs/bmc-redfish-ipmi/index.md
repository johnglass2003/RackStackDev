---
title: BMC / Out-of-Band Management
description: A practical guide to server hardware management — BMCs, IPMI, and Redfish — for software engineers with no hardware background.
sidebar:
  label: Overview
  order: 0
---

A Baseboard Management Controller (BMC) is a small independent chip on a server that gives access to your host independent of its OS. Even if your node goes down, the BMC enables power operations, sensor reads, console access, reboots and more. In order to communicate with it, you use protocols like IPMI and Redfish.

## What's in this guide

| Page | Content |
| --- | --- |
| [Foundations](./foundations) | What a BMC is, what they do, out-of-band vs. in-band |
| [Protocol Landscape](./protocol-landscape) | IPMI and Redfish |
| [IPMI in Practice](./ipmi-in-practice) | ipmitool and core commands |
| [Redfish in Practice](./redfish-in-practice) | REST/JSON model, resource types, auth, first API calls, automation at scale |
| [Terminology](./terminology) | Reference glossary for terms used across this section |
