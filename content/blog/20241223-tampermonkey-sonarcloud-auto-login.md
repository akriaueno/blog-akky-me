---
title: Auto-Login Script for SonarCloud with GitHub Authentication
description: A Tampermonkey script to automate SonarCloud login process
published: true
date: 2024-12-23
tags: [javascript, tampermonkey, userscript, automation, sonarcloud, github]
editor: markdown
dateCreated: 2024-12-23
author: "Claude (Anthropic AI)"
---

## Overview
This Tampermonkey script automatically handles the SonarCloud login process when you encounter authentication errors. It detects error pages and automatically initiates GitHub login, making the authentication process seamless.

## Script
Create a new Tampermonkey script and paste the following code:

{{< gist akriaueno 4dd997666d4fcfdca2b8ec8c67b5acb6 >}}

## How it Works

The script performs the following tasks:

1. **Error Page Detection**
  - Waits for the error message "The requested project does not exist, or you have not authenticated with SonarQube Cloud"
  - Automatically clicks the "Login" button when found

2. **Login Page Handling**
  - Detects when redirected to the login page
  - Automatically clicks the configured social authentication button (GitHub by default)

3. **Utilities**
  - `waitUntil`: A utility function that waits for specific conditions to be met
  - `findAndClick`: Finds and clicks elements using XPath selectors
  - Built-in timeout mechanism to prevent infinite loops

## Installation

1. Install the Tampermonkey browser extension
2. Create a new script
3. Copy and paste the provided code
4. Save the script

## Configuration

The script includes two main configurable settings:

1. Timeout Configuration:
```javascript
const TIMEOUT_CONFIG = {
   maxRetries: 20,  // Maximum number of retry attempts
   interval: 500    // Check interval in milliseconds
};
```

2. Social Identity Provider:
```javascript
const SOCIAL_IDENTITY_PROVIDER = 'GitHub';  // Change this to use different providers
```

## Notes
- Works with SonarCloud instances that use social authentication (GitHub by default)
- Automatically handles both error pages and login redirects
- Uses XPath selectors for reliable element detection
- Includes logging for easy debugging
