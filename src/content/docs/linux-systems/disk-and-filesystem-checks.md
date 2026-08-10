---
title: Disk and Filesystem Checks
description: Check space, inode usage, mounts, and large paths without wasting time.
sidebar:
  order: 7
---

Disk issues usually show up as secondary failures: services stop writing, deploys fail, temp files break, or databases go read-only.

## Core commands

```bash
df -h                            # show filesystem space in human-readable units
df -i                            # show inode usage
du -sh /var/*                    # estimate size of each path under /var
du -sh ./*                       # estimate size of each path in the current directory
mount                            # list mounted filesystems
find /var/log -type f -size +100M  # find large log files
```

## What to check first

Space usage:

```bash
df -h
```

Inode usage:

```bash
df -i
```

Big directories:

```bash
du -sh /var/* | sort -h
```

## What matters

- A filesystem can have free space but no free inodes.
- Log growth is a common cause of disk pressure.
- Temporary directories filling up can break installs, deploys, and service restarts.

## Practical rule

Check both `df -h` and `df -i`. If you only check bytes, you can miss inode exhaustion completely.

## Common mistake

Do not run `du` blindly at the root of a large filesystem unless you need to. Start in likely hot spots like `/var/log`, `/var/lib`, `/tmp`, and app data directories.