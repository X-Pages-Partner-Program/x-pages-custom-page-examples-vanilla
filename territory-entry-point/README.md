# Territory Entry Point Example

Exploratory example that fires multiple X-Pages JS Library calls from a Territory entry point context in Vault CRM.

## Purpose

The Territory entry point is **not fully documented** in the official X-Pages docs. This example is intentionally exploratory — each call is fired independently so its resolve/reject lifecycle can be observed in isolation. All raw responses are logged to the console.

## What it calls

- `getDataForCurrentObject` — fetches `user__sys name__v`, `html_report__v id`, and `html_report__v name__v` from the current context
- `getAvailableObjects` — logs all available objects to the console; renders a success/error row on the page
- `getAlignedTerritories()` — fires without `includeChildren`; renders success/error row, full response in console
- `getAlignedTerritories({ includeChildren: true })` — fires with `includeChildren: true`; renders success/error row, full response in console
- `getObjectMetadata({ object: 'territory__v' })` — fetches metadata for `territory__v`; renders success/error row, full response in console
- `queryRecord` on `account__v` — fetches the first 5 accounts (`id`, `name__v`). Each account renders as a clickable row with phone and email action buttons. Clicking the account name fires `ds.viewRecord` to navigate to that account's X-Page tab. Phone and email buttons log to the console (stubs, wired up later).

## Important

**The X-Pages JS Library calls only work when deployed inside Vault CRM.** Running this example locally will produce errors from the library — this is expected behaviour. To test properly, zip the contents of this folder (so that `index.html` is at the root of the zip) and deploy it as an X-Page with a Territory entry point in your Vault CRM environment.

## File Structure

```
territory-entry-point/
  index.html                  # Entry point
  css/style.css               # Styles
  js/main.js                  # Exploratory data calls and rendering logic
  assets/icons/phone.svg      # Phone icon for account action button
  assets/icons/email.svg      # Email icon for account action button
  lib/q.js                    # Q promise library (unmodified)
  lib/X-PagesLibrary.js       # X-Pages JS Library (unmodified)
```
