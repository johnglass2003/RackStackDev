---
title: Terminology
description: Key terms and definitions for Linux and systems concepts in data center infrastructure.
sidebar:
  label: Terminology
  order: 12
---

- **PID** - Process ID; the numeric identifier for a running process.
- **PPID** - Parent Process ID; the process that started another process.
- **Daemon** - A long-running background process.
- **Init** - The first userspace process started at boot; on most modern systems this is systemd.
- **Unit file** - A systemd config file describing a service, socket, timer, or other managed object.
- **journald** - The system service that collects and stores structured logs.
- **stdout / stderr** - Standard output and standard error; many services write logs here and let systemd collect them.
- **Signal** - A message sent to a process, such as `TERM`, `KILL`, or `HUP`.
- **Exit code** - The numeric status a process returns when it ends.
- **PATH** - The environment variable that controls where the shell looks for commands.
- **Permission bits** - The read, write, and execute flags on files and directories.
- **Owner** - The user that owns a file.
- **Group** - The group associated with a file or process.
- **Root** - The superuser account with full privileges.
- **Socket** - An endpoint a program uses for network or local IPC communication.
- **Listener** - A process waiting on a port or socket for incoming connections.
- **Mount** - Attaching a filesystem at a path in the directory tree.
- **Inode** - Filesystem metadata for a file; you can run out of inodes even if bytes remain.
- **Package manager** - The tool that installs, upgrades, and removes software packages.
- **DNS** - The system that maps names to IP addresses.
- **Loopback** - The local host network interface, usually `127.0.0.1`.
- **TTY** - A terminal device or session.
