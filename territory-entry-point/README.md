# Territory Entry Point Example

Exploratory example that calls `getDataForCurrentObject` from a Territory entry point context in Vault CRM.

## Purpose

The Territory entry point is **not listed in the official X-Pages documentation** as a supported context for `getDataForCurrentObject`. This example is intentionally exploratory — it is designed to validate what Vault CRM actually returns (or whether an error is thrown) when this call is made from a Territory context.

## What it attempts to fetch

- `account__v` → `id` — the Vault ID of the current account (if available in this context)

The full raw response is logged to the console and rendered on the page to make it easy to inspect the result when deployed.

## Important

**The X-Pages JS Library calls only work when deployed inside Vault CRM.** Running this example locally will produce errors from the library — this is expected behaviour. To test properly, zip the contents of this folder (so that `index.html` is at the root of the zip) and deploy it as an X-Page with a Territory entry point in your Vault CRM environment.

## File Structure

```
territory-entry-point/
  index.html          # Entry point
  css/style.css       # Minimal styles
  js/main.js          # Exploratory data call and rendering logic
  lib/q.js            # Q promise library (unmodified)
  lib/X-PagesLibrary.js  # X-Pages JS Library (unmodified)
```
