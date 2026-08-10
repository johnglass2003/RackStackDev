---
title: Networking on a Host
description: Quick host-side checks for reachability, listeners, routes, and DNS.
sidebar:
  order: 6
---

When a service is unreachable, figure out whether the problem is the process, the local host, DNS, or the network path.

## Core commands

```bash
ip addr                    # show network interfaces and assigned IPs
ip route                   # show the routing table
ss -ltnp                   # show listening TCP ports and owning processes
ss -lunp                   # show listening UDP ports and owning processes
ping <host>
curl -I http://<host>:<port>  # fetch response headers only
dig <name>                 # query DNS records for a name
nslookup <name>            # simple DNS lookup
```

## Fast workflow

1. Is the service listening?

```bash
ss -ltnp | grep <port>
```

2. Is the interface up and does the host have the expected IP?

```bash
ip addr
```

3. Is the route sane?

```bash
ip route
```

4. Does DNS resolve the name you are using?

```bash
dig <hostname>
```

5. Can you reach the endpoint from this host?

```bash
curl -v http://<host>:<port>
```

## What matters

- `0.0.0.0:<port>` means listening on all IPv4 interfaces.
- `127.0.0.1:<port>` means local only.
- A healthy process can still be unreachable if it bound to the wrong address.

## Common mistake

People often stop at "the service is running." That is not enough. It also needs to be listening on the right port and bound to the right interface.