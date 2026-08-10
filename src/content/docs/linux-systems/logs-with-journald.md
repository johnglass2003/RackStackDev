---
title: Logs with journald
description: The fastest ways to get useful service and boot logs with journalctl.
sidebar:
  order: 4
---

If a service failed, `journalctl` is often the shortest path to the reason.

## Core commands

```bash
journalctl -u <service-name>              # show logs for one service
journalctl -u <service-name> -n 100       # show the last 100 log lines for one service
journalctl -u <service-name> -f           # follow new log lines live
journalctl -b                             # show logs from the current boot
journalctl -b -1                          # show logs from the previous boot
journalctl -p err                         # show error-level logs
journalctl --since '1 hour ago'           # show logs from a recent time window
```

## Most useful patterns

Current boot only:

```bash
journalctl -b
```

Previous boot:

```bash
journalctl -b -1
```

Follow logs live for one service:

```bash
journalctl -u <service-name> -f
```

Last 50 lines with no pager noise:

```bash
journalctl -u <service-name> -n 50 --no-pager
```

## What to look for

- Restart loops
- Permission denied errors
- Missing file or bad path errors
- Port bind failures
- DNS or network timeout errors
- Config parse failures after a deploy

## Common mistake

If you restart a service several times, old failures can mix with new ones. Use `--since` or focus on the current boot to avoid reading stale noise.