# Top Level Entry Point Example

API explorer for the Top-Level entry point (`top_level__v`) in Vault CRM.

## Purpose

Fires a range of `ds` methods from the top-level context and renders the full raw
response for each — resolve and reject alike. The error responses are as informative
as the successes, since the top-level context may not expose all object types.

Each call renders independently as it settles, giving a live view of what the runtime
provides in this context.

## What it calls

**Session / identity**
- `getDataForCurrentObject('user__sys', 'name__v')`
- `getDataForCurrentObject('html_report__v', 'id')`
- `getDataForCurrentObject('html_report__v', 'name__v')`

**Expected to error — fired anyway**
- `getDataForCurrentObject('account__v', 'id')`
- `getDataForCurrentObject('territory__v', 'id')`

**queryRecord — does it work without object context?**
- `queryRecord({ object: 'account__v', ... })`
- `queryRecord({ object: 'call2__v', ... })`

**Other ambient APIs**
- `getAlignedTerritories({ includeChildren: false })`
- `getAvailableObjects()`

## Important

**The X-Pages JS Library calls only work when deployed inside Vault CRM.** Running this
example locally will produce errors from the library — this is expected behaviour. To test,
zip the contents of this folder (so `index.html` is at the root of the zip) and deploy as
an X-Page with a Top-Level entry point in your Vault CRM environment.

## File Structure

```
top-level-entry-point/
  index.html             # Entry point
  css/style.css          # Styles
  js/main.js             # API calls and rendering logic
  lib/q.js               # Q promise library (unmodified)
  lib/X-PagesLibrary.js  # X-Pages JS Library (unmodified)
```
