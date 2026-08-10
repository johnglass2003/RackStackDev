---
title: Filesystem and Paths
description: The Linux directories and path patterns you will keep using on real hosts.
sidebar:
  order: 1
---

If you do not know where to look on a Linux host, you move slowly. Most day-to-day work starts with knowing which directory probably has the answer.

## High-value paths

| Path | What it usually holds |
| --- | --- |
| `/etc` | Config files |
| `/var/log` | Application and system log files |
| `/var/lib` | Persistent app state |
| `/var/run` or `/run` | Runtime state like PID files and sockets |
| `/usr/bin` | Most packaged user commands |
| `/usr/sbin` | Admin-focused packaged commands |
| `/usr/local/bin` | Locally installed commands |
| `/tmp` | Temporary files |
| `/home` | User home directories |
| `/proc` | Kernel and process view |
| `/sys` | Device and kernel state |

## Fast checks

```bash
pwd
ls -lah
cd /etc
find /etc -maxdepth 2 -name '*nginx*'
readlink -f /var/run                 # resolve the real path behind a symlink
which <command>
whereis <command>                    # show likely binary, source, and manpage locations
```

## What matters on the job

- Config usually lives in `/etc`.
- Logs are often in `/var/log`, but many services now log straight to journald.
- If a package installed a binary, it is usually in `/usr/bin` or `/usr/sbin`.
- If a team dropped in a custom script, check `/usr/local/bin`, `/opt`, or a repo checkout under `/srv` or `/home`.
- `/proc` is not a normal filesystem. It is a live kernel view. Use it to inspect processes and system state.

## Quick examples

Find the config directory for a service:

```bash
systemctl cat <service-name>   # print the full unit file and overrides
```

Find where a running process was started from:

```bash
readlink -f /proc/<pid>/exe        # show the real executable path
tr '\0' ' ' < /proc/<pid>/cmdline  # show the full process command line
```

## Common mistake

Do not assume logs are always in `/var/log`. On many modern systems, the real answer is `journalctl -u <service-name>`.