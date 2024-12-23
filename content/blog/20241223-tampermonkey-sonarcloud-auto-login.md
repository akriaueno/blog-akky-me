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

```javascript
// ==UserScript==
// @name         SonarCloud Auto Login
// @namespace    http://tampermonkey.net/
// @version      2024-12-23
// @description  Automatically handles login and navigates SonarCloud pages
// @author       akiraueno
// @match        https://sonarcloud.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sonarcloud.io
// @grant        none
// @run-at       document-idle
// ==/UserScript==
(function() {
  'use strict';

  const TIMEOUT_CONFIG = {
      maxRetries: 20,　 // Maximum number of retry attempts (10 seconds)
      interval: 500,　  // Check interval in milliseconds
  };

  // Utility function: Waits until a condition is met
  const waitUntil = async (condition, description) => {
      return new Promise((resolve, reject) => {
          let retries = 0;

          const check = () => {
              if (condition()) {
                  console.log(`Condition met: ${description}`);
                  resolve(true);
              } else if (retries < TIMEOUT_CONFIG.maxRetries) {
                  retries++;
                  console.log(`Waiting for: ${description} (${retries}/${TIMEOUT_CONFIG.maxRetries})`);
                  setTimeout(check, TIMEOUT_CONFIG.interval);
              } else {
                  console.warn(`Timeout waiting for: ${description}`);
                  reject(new Error(`Timeout: ${description}`));
              }
          };

          check();
      });
  };

  // Utility function: Finds and clicks an element using XPath
  const findAndClick = async (xpath, description) => {
      await waitUntil(
          () => document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue,
          `Finding element: ${description}`
      );

      const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      element.click();
      console.log(`Clicked: ${description}`);
  };

  // Handles error page authentication
  const handleErrorPage = async () => {
      const ERROR_TEXT = "The requested project does not exist, or you have not authenticated with SonarQube Cloud.";
      try {
          await waitUntil(
              () => document.body.textContent.includes(ERROR_TEXT),
              'Checking for error message'
          );
          console.log('Error page detected');
          await findAndClick('//a[text()="Login"]', 'Login button');
      } catch (error) {
          console.error('Error page handling failed:', error);
      }
  };

  // Handles login page with Social authentication
  const handleLoginPage = async () => {
      const SOCIAL_IDENTITY_PROVIDER = 'GitHub';
      try {
          await findAndClick(`//button[.//img[@alt="${SOCIAL_IDENTITY_PROVIDER}"]]`, `${SOCIAL_IDENTITY_PROVIDER} login button`);
      } catch (error) {
          console.error('Login page handling failed:', error);
      }
  };

  // Main initialization
  const init = async () => {
      console.log('Current URL:', location.href);

      if (location.href.includes('https://sonarcloud.io/login')) {
          await handleLoginPage();
      } else {
          await handleErrorPage();
      }
  };

  init();
})();
```

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
