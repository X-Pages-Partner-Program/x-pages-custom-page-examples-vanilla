# Territory Entry Point Example

Exploratory example that fires multiple X-Pages JS Library calls from a Territory entry point context in Vault CRM.

## Purpose

The Territory entry point is **not fully documented** in the official X-Pages docs. This example is intentionally exploratory — each call is fired independently so its resolve/reject lifecycle can be observed in isolation. All raw responses are logged to the console.

## What it calls

- `getDataForCurrentObject` — fetches `user__sys name__v`, `html_report__v id`, and `html_report__v name__v` from the current context
- `getAvailableObjects` — logs all available objects to the console; renders a success/error row on the page
- `getAlignedTerritories()` — fires without `includeChildren`; renders territory rows (name + developerName) into the Aligned Territories section
- `getAlignedTerritories({ includeChildren: true })` — fires with `includeChildren: true`; appends child territories to the same section under a "With children" group label
- `getObjectMetadata({ object: 'territory__v' })` — fetches metadata for `territory__v`; renders success/error row, full response in console
- `getObjectMetadata({ object: 'account__v' })` — fetches metadata for `account__v` to inspect field and picklist details; renders success/error row, full response in console
- `queryRecord` on `account__v` — HCP List: first 5 accounts filtered by `object_type__v = 'professional__v'`. Each account renders as a clickable row with phone and email action buttons (phone/email are stubs, wired up later)
- `queryRecord` on `call2__v` — Recent Calls: first 5 in the territory, sorted by date descending. Each row is clickable and navigates to the call record via `ds.viewRecord`

## Important

**The X-Pages JS Library calls only work when deployed inside Vault CRM.** Running this example locally will produce errors from the library — this is expected behaviour. To test properly, zip the contents of this folder (so that `index.html` is at the root of the zip) and deploy it as an X-Page with a Territory entry point in your Vault CRM environment.

## File Structure

```
territory-entry-point/
  index.html                  # Entry point
  css/style.css               # Styles
  js/main.js                  # Data calls and rendering logic
  assets/icons/phone.svg      # Phone icon for account action button
  assets/icons/email.svg      # Email icon for account action button
  lib/q.js                    # Q promise library (unmodified)
  lib/X-PagesLibrary.js       # X-Pages JS Library (unmodified)
```
