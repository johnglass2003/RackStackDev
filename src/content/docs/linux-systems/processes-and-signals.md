---
title: Processes and Signals
description: Find the right process, inspect it, and stop or reload it safely.
sidebar:
  order: 2
---

When something is broken, one of the first questions is: what process is actually running, and what state is it in?

## Core commands

```bash
ps aux                     # list running processes with CPU and memory usage
ps -ef | grep <name>
pgrep -a <name>           # find matching PIDs and print their command lines
top
htop                      # friendlier interactive process view
kill <pid>
kill -TERM <pid>          # ask a process to exit cleanly
kill -KILL <pid>          # force-kill a process
kill -HUP <pid>           # tell some daemons to reload config
```

## Signal cheat sheet

| Signal | Meaning | Typical use |
| --- | --- | --- |
| `TERM` | Ask process to exit cleanly | Normal stop |
| `KILL` | Force immediate stop | Last resort |
| `HUP` | Hangup or reload | Re-read config for some daemons |
| `INT` | Interrupt | Similar to Ctrl+C |

## Useful reads

```bash
ps -p <pid> -o pid,ppid,user,%cpu,%mem,stat,start,time,cmd  # detailed view for one PID
cat /proc/<pid>/status                                       # kernel-exposed process status
tr '\0' ' ' < /proc/<pid>/cmdline                            # print the full command line cleanly
readlink -f /proc/<pid>/cwd                                  # show the process working directory
```

`STAT` matters. A process in `D` state is stuck in uninterruptible sleep, often on disk or kernel I/O. `Z` means zombie.

## Practical rule

If systemd owns the process, use `systemctl restart <service-name>` instead of killing the PID directly. Otherwise systemd may just bring it back and you learn nothing.

## Common mistake

Do not jump straight to `kill -9`. Try a normal stop first so the process can flush state, close files, and log a useful error.