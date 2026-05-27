# Account Entry Point Example

Demonstrates how to use `getDataForCurrentObject` from the X-Pages JS Library to retrieve data about the current account and logged-in user when an X-Page is launched from an Account record.

## What it fetches

- `account__v` → `id` — the Vault ID of the current account
- `account__v` → `name__v` — the name of the current account
- `user__sys` → `name__v` — the name of the currently logged-in user

All three calls are made in parallel using `Promise.all()`. The full raw response for each call is logged to the console, and the values are rendered on the page.

## Important

**The X-Pages JS Library calls only work when deployed inside Vault CRM.** Running this example locally will produce errors from the library — this is expected behaviour. To test properly, zip the contents of this folder (so that `index.html` is at the root of the zip) and deploy it as an X-Page in your Vault CRM environment.

## File Structure

```
account-entry-point/
  index.html          # Entry point
  css/style.css       # Minimal styles
  js/main.js          # Data calls and rendering logic
  lib/q.js            # Q promise library (unmodified)
  lib/X-PagesLibrary.js  # X-Pages JS Library (unmodified)
```
