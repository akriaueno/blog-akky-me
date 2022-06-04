---
title: "Lock Gnome Screen via SSH"
date: 2022-06-05T02:30:43+09:00
tags: [gnome, linux, ssh]
---

## Overview

I want to lock gnome-session(Desktop) with a user logged in via ssh user.

## Script

Save below script and execute it.

{{< gist akriaueno b83963eb4ce320ea21945720ac877c3d >}}

There are two key points at line 10.

### 1. `gnome-screensaver-command -l`

Execute `gnome-screensaver-command` as GNOME logged in user.

### 2. `DBUS_SESSION_BUS_ADDRESS`

Set dbus environment varibale to execute `gnome-screensaver-command`.

## Reference

- https://askubuntu.com/questions/7776/how-do-i-lock-the-desktop-screen-via-command-line
- https://askubuntu.com/questions/707984/lock-screen-with-gnome-screensaver-command-as-root-from-etc-pm-sleep-d-script
