---
title: Troubleshooting Playbooks
description: Short workflows for common Linux host and service failures.
sidebar:
  order: 10
---

The point of a playbook is to reduce flailing. Start with the shortest checks that rule out the biggest failure classes.

## Service is down

```bash
systemctl status <service-name>
journalctl -u <service-name> -n 50 --no-pager
systemctl cat <service-name>
ss -ltnp | grep <port>
```

Check whether the process failed to start, failed after start, or is running but not listening.

## Host is full

```bash
df -h
df -i
du -sh /var/* | sort -h
```

Look for log growth, temp file buildup, or app data growth.

## Cannot connect to a service

```bash
ss -ltnp | grep <port>
ip addr
ip route
dig <hostname>
curl -v http://<host>:<port>
```

Separate local process issues from DNS or path issues.

## Permission denied

```bash
ls -l <path>
id
systemctl cat <service-name>
sudo -u <user> <command>
```

Confirm which user is failing and which path is blocked.

## A good default order

1. Confirm the symptom.
2. Narrow to one service, one host, one port, or one path.
3. Check status and recent logs.
4. Check the exact runtime user, binary, config path, and listener.
5. Change one thing at a time.

## Common mistake

Do not restart first and investigate second. A restart can destroy the evidence you needed.