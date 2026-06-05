# Account Entry Point Example

Demonstrates how to use `getDataForCurrentObject`, `queryRecord`, `getAvailableObjects`, and `getObjectMetadata` from the X-Pages JS Library when an X-Page is launched from an Account record.

## What it fetches

- `getDataForCurrentObject` — retrieves `account__v id`, `account__v name__v`, and `user__sys name__v` from the current context (fired in parallel via `Promise.all`)
- `queryRecord` on `call2__v` — fetches the 5 most recent calls for the current account, sorted by date descending. Each call renders as a row; clicking the call ID navigates to that record via `ds.viewRecord`
- `getAvailableObjects` — logs all available objects to the console; renders a success/error row on the page
- `getObjectMetadata({ object: 'account__v' })` — fetches metadata for `account__v`; renders a success/error row on the page, full response in console

## Important

**The X-Pages JS Library calls only work when deployed inside Vault CRM.** Running this example locally will produce errors from the library — this is expected behaviour. To test properly, zip the contents of this folder (so that `index.html` is at the root of the zip) and deploy it as an X-Page in your Vault CRM environment.

## File Structure

```
account-entry-point/
  index.html          # Entry point
  css/style.css       # Styles
  js/main.js          # Data calls and rendering logic
  lib/q.js            # Q promise library (unmodified)
  lib/X-PagesLibrary.js  # X-Pages JS Library (unmodified)
```
