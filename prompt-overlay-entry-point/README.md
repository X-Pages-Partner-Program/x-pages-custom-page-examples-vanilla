# Prompt Overlay Entry Point Example

Exploratory example for the Prompt Overlay entry point (`prompt_overlay__v`) in Vault CRM.

## Purpose

The Prompt Overlay entry point (`getOverlayContext`) is not fully documented. This example
fires `getOverlayContext` and logs the full raw response so we can understand what context
is available and how to detect whether the overlay was triggered from an Account or Territory context.

`getDataForCurrentObject` is also probed speculatively across a range of object types —
the overlay may or may not expose object context depending on where it was triggered from.

All raw responses are rendered as JSON on the page and logged to the console.

## What it calls

- `getOverlayContext` — primary overlay API; response shape TBC from live testing
- `getDataForCurrentObject` on `account__v id`, `account__v name__v`, `user__sys name__v`,
  `html_report__v id`, `html_report__v name__v` — speculative probes; log resolve/reject for each

## Important

**The X-Pages JS Library calls only work when deployed inside Vault CRM.** Running this example
locally will produce errors from the library — this is expected behaviour. To test, zip the
contents of this folder (so `index.html` is at the root of the zip) and deploy as an X-Page
with a Prompt Overlay entry point in your Vault CRM environment.

## File Structure

```
prompt-overlay-entry-point/
  index.html          # Entry point
  css/style.css       # Styles
  js/main.js          # Data calls and rendering logic
  lib/q.js            # Q promise library (unmodified)
  lib/X-PagesLibrary.js  # X-Pages JS Library (unmodified)
```
