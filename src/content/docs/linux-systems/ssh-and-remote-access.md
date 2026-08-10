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
rsync -av ./dir/ user@host:/srv/dir/  # sync a local directory to the remote host
ssh-copy-id user@host          # install your public key on the remote host
ssh -v user@host               # connect with verbose debug output
```

## A simple SSH config

```ini
Host web-01
  HostName 10.0.0.25
  User deploy
  IdentityFile ~/.ssh/id_ed25519
  Port 2222
```

## Jump hosts

```bash
ssh -J bastion-user@bastion target-user@target
```

```ini
ProxyJump bastion-user@bastion
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

Clear a stale known_hosts entry after a host key change:

```bash
ssh-keygen -R <host>
```

## What matters

- SSH keys are preferred over passwords.
- `~/.ssh/config` saves time if you use jump hosts, custom ports, or named identities.
- `rsync` is usually the better default for repeated remote copies or directory syncs.
- `ssh -v` is often enough to tell whether the failure is DNS, TCP reachability, auth, or host key mismatch.
- A "host key changed" error usually means the remote host was rebuilt, reprovisioned, or you hit the wrong host for that name or IP.

## Common mistake

Do not debug SSH only from the server side. Client-side config, wrong key selection, or a stale known host entry are common causes.