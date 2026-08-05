---
title: systemd Services
description: Understanding and working with systemd service units in a data center context.
sidebar:
  order: 1
---

Understanding systemd services is extremely important to any kind of infrastructure, SRE, or platform engineering work. systemd is the process manager running underneath most modern Linux distributions, and most of the background agents (binary programs running) that keep a server healthy are just systemd services. These services are responsible for things like monitoring daemons, telemetry collecting, and a huge share of software operations.

## What is a systemd service?

systemd is an init system meaning it's the first process that starts when a Linux machine boots. It's assigned process ID 1 (PID 1). Its job is to start, stop, and supervise other process.

A service is one type of thing systemd manages (see [Terminology](./terminology) about stuff like units, services, daemons). It is a program systemd keeps running, restarts, and can start automatically on boot if enabled.

## Why it matters on the job

In a real infrastructure environment, you're almost certainly going to work on or at least interact with these programs. Any long-running agent (a metrics collector, a health-check daemon, a custom automation tool) gets wrapped as a systemd service so the OS can guarantee it stays running.

I've been working for almost 1 year now, and I've already done work on several agents that enable telemetry, reliability, and numerous vital software operations. This is baseline knowledge for anyone touching production Linux infrastructure.

## Basic commands

These six cover the large majority of day-to-day systemd usage:

```bash
# Check whether a service is running, and see recent log output
sudo systemctl status <service-name>

# Start a service
sudo systemctl start <service-name>

# Stop a service
sudo systemctl stop <service-name>

# Stop and then start a service (restart)
sudo systemctl restart <service-name>

# Reload a service's config without dropping active connections
sudo systemctl reload <service-name>

# Make a service start automatically on boot
sudo systemctl enable <service-name>

# Stop a service from starting automatically on boot
sudo systemctl disable <service-name>
```

**`restart` vs. `reload`:** `restart` fully stops and starts the process, anything connected to it gets dropped. `reload` tells the process to re-read its configuration in place. Not every service supports `reload` (it depends on how it was built), but it's preferable when available. For example, if you tweak a config value on a web server that's actively serving live traffic, a restart would briefly drop every open connection. A reload applies the same change with zero dropped connections, because it just re-reads its config file in place.

## Where unit files live

systemd has unit files in a few directories, and the directory of a file determines the file's priority:

| Directory | Purpose | Priority |
| --- | --- | --- |
| `/etc/systemd/system/` | Admin/site-specific units and overrides | Highest |
| `/run/systemd/system/` | Runtime-only units (cleared on reboot) | Middle |
| `/usr/lib/systemd/system/` (or `/lib/systemd/system/`) | Units installed by packages (e.g. `nginx`, `docker`, `sshd`) | Lowest |

When you install something via a package manager, its service file lands in the lowest-priority directory. Package updates can overwrite it here. When you want to customize a service's behavior, you don't want to edit that file directly because your changes may vanish on the next update.

If you want to customize a service:

```bash
# Creates an override file containing only your changes,
# stored safely in /etc/systemd/system/ where updates won't touch it
sudo systemctl edit <service-name>

# Copies the entire unit file into /etc/systemd/system/ as a starting point
# (use this if you want to edit the whole file rather than just override specific lines)
sudo systemctl edit --full <service-name>
```

After changing a unit file, you have to tell systemd to re-read its configuration:

```bash
sudo systemctl daemon-reload
```

## Writing a simple unit file

These three sections are important: `[Unit]`, `[Service]` and `[Install]`.

```ini
[Unit]
Description=Health-check agent for internal fleet monitoring
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
ExecStart=/usr/local/bin/health-check-agent
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

**Quick reference** - If you want to go deeper, I've linked the official docs:

| Directive | What it controls | Docs |
| --- | --- | --- |
| `After=` / `Before=` | Ordering only, no dependency | [systemd.unit(5)](https://www.freedesktop.org/software/systemd/man/latest/systemd.unit.html) |
| `Wants=` / `Requires=` | Soft vs. hard dependencies | [systemd.unit(5)](https://www.freedesktop.org/software/systemd/man/latest/systemd.unit.html) |
| `Type=` | How systemd defines "started" | [systemd.service(5)](https://www.freedesktop.org/software/systemd/man/latest/systemd.service.html) |
| `Restart=` | Auto-restart behavior | [systemd.service(5)](https://www.freedesktop.org/software/systemd/man/latest/systemd.service.html) |
| `WantedBy=` | Boot stage that enables it | [systemd.unit(5)](https://www.freedesktop.org/software/systemd/man/latest/systemd.unit.html) |

## Resume takeaway

### Keywords worth working in

ATS systems and recruiters might scan for reliability, uptime, monitoring / observability, automation, self-healing, fault tolerance, production services, scalability, and distributed systems. Don't force all of these into your resume, pick 2-3 that are actually true of what you built, and it's best when they can show up across multiple areas.

### Project ideas

1. **Host health-check agent** A background service that checks CPU, memory, and disk usage on a schedule and logs anything abnormal. Runs continuously, restarts itself if it crashes, and survives a reboot.
2. **Log watcher / alerting stub** A service that watches a log file for error patterns and writes a summary when it finds one.
3. **Uptime monitor for a list of endpoints** A service that checks a list of URLs or hosts on an interval and logs whether each one is up and how fast it responded. You can extend this into a dashboard, another thing you will commonly run into every day at these jobs.

### Sample bullet

> "Built and deployed a host health-check agent as a self-healing systemd service, automating reliability monitoring and surviving reboots without manual intervention."

Note: hard metrics specific to your project and what it accomplishes are gold for your resume.

## References

- [systemd.unit(5) man page — freedesktop.org](https://www.freedesktop.org/software/systemd/man/latest/systemd.unit.html)
- [systemd.service(5) man page — freedesktop.org](https://www.freedesktop.org/software/systemd/man/latest/systemd.service.html)
- [Red Hat: Working with systemd unit files](https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/9/html/using_systemd_unit_files_to_customize_and_optimize_your_system/assembly_working-with-systemd-unit-files_working-with-systemd)
- [DigitalOcean: Understanding systemd Units and Unit Files](https://www.digitalocean.com/community/tutorials/understanding-systemd-units-and-unit-files)
- [Learn Linux TV — "Systemd Deep-Dive" (YouTube)](https://www.youtube.com/watch/Kzpm-rGAXos)
