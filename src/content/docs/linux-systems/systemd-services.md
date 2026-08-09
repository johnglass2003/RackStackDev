---
title: systemd Services
description: Understanding and working with systemd service units in a data center context.
sidebar:
  order: 1
---

systemd is the service manager on most Linux servers. If you work in infrastructure, SRE, or platform engineering, you will almost certainly interact with it.

## What is a systemd service?

systemd is the init system, which means it is the first process that starts when a Linux machine boots. It is PID 1, and its job is to start, stop, and supervise other processes.

A service is one type of thing systemd manages. In practice, it is a long-running program that systemd keeps running, restarts if needed, and can start automatically at boot.

## Why it matters on the job

In real environments, a lot of the software that keeps a host healthy runs as a systemd service: monitoring agents, telemetry collectors, automation tools, web servers, and more. If something is meant to keep running in the background on a Linux box, it is often a service.

## Basic commands

These cover most day-to-day usage:

```bash
sudo systemctl status <service-name>
sudo systemctl start <service-name>
sudo systemctl stop <service-name>
sudo systemctl restart <service-name>
sudo systemctl reload <service-name>
sudo systemctl enable <service-name>
sudo systemctl disable <service-name>
```

`restart` fully stops and starts the process. `reload` tells the process to re-read its config without dropping active connections. Not every service supports `reload`, but it is the better option when it does.

## Where unit files live

systemd unit files live in a few directories, and the location changes the priority:

| Directory | Purpose | Priority |
| --- | --- | --- |
| `/etc/systemd/system/` | Admin/site-specific units and overrides | Highest |
| `/run/systemd/system/` | Runtime-only units | Middle |
| `/usr/lib/systemd/system/` (or `/lib/systemd/system/`) | Units installed by packages | Lowest |

If you want to customize a service without editing the packaged unit file directly, use an override:

```bash
sudo systemctl edit <service-name>
```

If you want to change the whole unit file, use:

```bash
sudo systemctl edit --full <service-name>
```

After changing a unit file, reload systemd:

```bash
sudo systemctl daemon-reload
```

## Writing a simple unit file

The three sections you will see most often are `[Unit]`, `[Service]`, and `[Install]`:

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

## Quick reference

| Directive | What it controls |
| --- | --- |
| `After=` / `Before=` | Ordering only |
| `Wants=` / `Requires=` | Soft vs. hard dependency |
| `Type=` | How systemd decides whether the service has started |
| `Restart=` | Auto-restart behavior |
| `WantedBy=` | Which boot target enables the service |

## Resume takeaway

### Keywords worth working in

Reliability, uptime, monitoring / observability, automation, self-healing, fault tolerance, production services, scalability, and distributed systems.

### Project ideas

1. **Host health-check agent** A background service that checks CPU, memory, and disk usage on a schedule and logs anything abnormal. Runs continuously, restarts itself if it crashes, and survives a reboot.
2. **Log watcher / alerting stub** A service that watches a log file for error patterns and writes a summary when it finds one.
3. **Uptime monitor for a list of endpoints** A service that checks a list of URLs or hosts on an interval and logs whether each one is up and how fast it responded. You can extend this into a dashboard.

### Sample bullet

> "Built and deployed a host health-check agent as a self-healing systemd service, automating reliability monitoring and surviving reboots without manual intervention."

## References

- [systemd.unit(5) man page — freedesktop.org](https://www.freedesktop.org/software/systemd/man/latest/systemd.unit.html)
- [systemd.service(5) man page — freedesktop.org](https://www.freedesktop.org/software/systemd/man/latest/systemd.service.html)
- [Red Hat: Working with systemd unit files](https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/9/html/using_systemd_unit_files_to_customize_and_optimize_your_system/assembly_working-with-systemd-unit-files_working-with-systemd)
- [DigitalOcean: Understanding systemd Units and Unit Files](https://www.digitalocean.com/community/tutorials/understanding-systemd-units-and-unit-files)
- [Learn Linux TV — "Systemd Deep-Dive" (YouTube)](https://www.youtube.com/watch/Kzpm-rGAXos)
