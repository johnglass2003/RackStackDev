---
title: Packages and Binaries
description: How software is installed on Linux hosts and how to verify what is actually running.
sidebar:
  order: 8
---

When something behaves unexpectedly, confirm what binary is being executed and where it came from.

## Core commands

```bash
which <command>
type <command>                # show whether it is a binary, alias, or shell builtin
whereis <command>             # show likely binary and manpage locations
<command> --version
apt list --installed          # list installed packages on Debian-based systems
dnf list installed            # list installed packages on RPM-based systems
rpm -q <package>              # query one RPM package by name
dpkg -l | grep <package>      # search installed Debian packages
```

## What to check

Binary path:

```bash
which <command>
readlink -f $(which <command>) # resolve symlinks to the real binary
```

Package ownership on Debian-based systems:

```bash
dpkg -S /path/to/file
```

Package ownership on RPM-based systems:

```bash
rpm -qf /path/to/file
```

## What matters

- Packaged binaries usually live in `/usr/bin` or `/usr/sbin`.
- Locally installed tools often land in `/usr/local/bin`.
- Custom software may live in `/opt` or a team-owned directory.
- Multiple versions of the same command in `PATH` cause a lot of confusion.

## Common mistake

Do not assume the binary you run interactively is the same one a service uses. Check `ExecStart=` in the unit file if systemd owns it.