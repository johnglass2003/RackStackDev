---
title: Permissions and Users
description: The ownership and access model behind many common Linux failures.
sidebar:
  order: 5
---

Permission problems are a lot more common than you expect.

## Core commands

```bash
ls -l
id                            # show your user ID and group membership
whoami
groups
chmod 640 <file>              # set read/write for owner and read for group
chmod 755 <dir-or-script>     # set common execute permissions for a dir or script
chown <user>:<group> <path>   # change file owner and group
sudo -u <user> <command>      # run a command as another user
```

## What the bits mean

`r` is read, `w` is write, `x` is execute.

The three groups are:

1. Owner
2. Group
3. Everyone else

Example:

```bash
-rw-r----- 1 app app config.yaml
```

That means owner can read and write, group can read, others get nothing.

## High-value checks

Check who owns a file:

```bash
ls -l /path/to/file
```

Check the user a service runs as:

```bash
systemctl cat <service-name>
```

Test a command as that user:

```bash
sudo -u <user> <command>
```

## Common failure patterns

- Service user cannot read its config
- Service user cannot write to its log or data directory
- Script is present but not executable
- Directory permissions block traversal even when file permissions look fine

## Practical rule

When debugging access problems, test as the same user the service runs as. Root succeeding does not prove the app can do the same thing.