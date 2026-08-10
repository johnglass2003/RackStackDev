---
title: SSH and Remote Access
description: The basic SSH flows you will use constantly on Linux infrastructure.
sidebar:
  order: 9
---

SSH is the normal way into Linux hosts. You should be comfortable connecting, copying files, and checking client-side config quickly.

## Core commands

```bash
ssh user@host
ssh -i ~/.ssh/key user@host    # connect with a specific private key
scp file.txt user@host:/tmp/   # copy a local file to the remote host
scp user@host:/var/log/app.log .  # copy a remote file back locally
ssh -v user@host               # connect with verbose debug output
```

## High-value checks

See the effective SSH client config for a host:

```bash
ssh -G <host>   # print the effective SSH client config for that host
```

Test with verbose output:

```bash
ssh -v user@host
```

## What matters

- SSH keys are preferred over passwords.
- `~/.ssh/config` saves time if you use jump hosts, custom ports, or named identities.
- `ssh -v` is often enough to tell whether the failure is DNS, TCP reachability, auth, or host key mismatch.

## Common mistake

Do not debug SSH only from the server side. Client-side config, wrong key selection, or a stale known host entry are common causes.