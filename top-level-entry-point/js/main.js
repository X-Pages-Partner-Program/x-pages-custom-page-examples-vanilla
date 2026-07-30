/**
 * Top Level Entry Point - main.js
 *
 * API explorer for the Top-Level entry point (top_level__v).
 *
 * Fires a range of ds methods and renders the full raw response for each —
 * resolve and reject alike. The error responses are as interesting as the
 * successes here, since the top-level context may not expose all object types.
 *
 * Each call renders independently as it settles, giving a live view of what
 * the runtime provides in this context.
 *
 * NOTE: All ds calls only work when deployed inside Vault CRM. Running this
 * file locally will produce errors from the X-Pages library, which is expected.
 */

document.addEventListener('DOMContentLoaded', function () {

  var VERSION = '1.0.1';
  var versionEl = document.createElement('div');
  versionEl.className = 'version-stamp';
  versionEl.textContent = 'v' + VERSION;
  document.body.appendChild(versionEl);

  // Platform detection — set body class for CSS-driven feature visibility.
  if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.myInsightsAPI) {
    document.body.classList.add('platform-ipad');
  }

  console.log('[Top Level] DOMContentLoaded fired');

  var resultsEl = document.getElementById('results');
  resultsEl.innerHTML = '';

  // ─── Session / identity ───────────────────────────────────────────────────

  console.log('[Top Level] Firing: getDataForCurrentObject user__sys name__v');
  ds.getDataForCurrentObject('user__sys', 'name__v')
    .then(function (response) {
      console.log('[Top Level] Resolved: getDataForCurrentObject user__sys name__v', response);
      resultsEl.innerHTML += renderRawResponse('user__sys → name__v', response);
    })
    .catch(function (error) {
      console.log('[Top Level] Rejected: getDataForCurrentObject user__sys name__v', error);
      resultsEl.innerHTML += renderRawResponse('user__sys → name__v [error]', error);
    });

  console.log('[Top Level] Firing: getDataForCurrentObject html_report__v id');
  ds.getDataForCurrentObject('html_report__v', 'id')
    .then(function (response) {
      console.log('[Top Level] Resolved: getDataForCurrentObject html_report__v id', response);
      resultsEl.innerHTML += renderRawResponse('html_report__v → id', response);
    })
    .catch(function (error) {
      console.log('[Top Level] Rejected: getDataForCurrentObject html_report__v id', error);
      resultsEl.innerHTML += renderRawResponse('html_report__v → id [error]', error);
    });

  console.log('[Top Level] Firing: getDataForCurrentObject html_report__v name__v');
  ds.getDataForCurrentObject('html_report__v', 'name__v')
    .then(function (response) {
      console.log('[Top Level] Resolved: getDataForCurrentObject html_report__v name__v', response);
      resultsEl.innerHTML += renderRawResponse('html_report__v → name__v', response);
    })
    .catch(function (error) {
      console.log('[Top Level] Rejected: getDataForCurrentObject html_report__v name__v', error);
      resultsEl.innerHTML += renderRawResponse('html_report__v → name__v [error]', error);
    });

  // ─── Expected to error — try anyway ──────────────────────────────────────

  console.log('[Top Level] Firing: getDataForCurrentObject account__v id');
  ds.getDataForCurrentObject('account__v', 'id')
    .then(function (response) {
      console.log('[Top Level] Resolved: getDataForCurrentObject account__v id', response);
      resultsEl.innerHTML += renderRawResponse('account__v → id', response);
    })
    .catch(function (error) {
      console.log('[Top Level] Rejected: getDataForCurrentObject account__v id', error);
      resultsEl.innerHTML += renderRawResponse('account__v → id [error]', error);
    });

  console.log('[Top Level] Firing: getDataForCurrentObject territory__v id');
  ds.getDataForCurrentObject('territory__v', 'id')
    .then(function (response) {
      console.log('[Top Level] Resolved: getDataForCurrentObject territory__v id', response);
      resultsEl.innerHTML += renderRawResponse('territory__v → id', response);
    })
    .catch(function (error) {
      console.log('[Top Level] Rejected: getDataForCurrentObject territory__v id', error);
      resultsEl.innerHTML += renderRawResponse('territory__v → id [error]', error);
    });

  // ─── queryRecord — does it work without object context? ──────────────────

  console.log('[Top Level] Firing: queryRecord account__v');
  ds.queryRecord({ object: 'account__v', fields: ['id', 'name__v'], where: '', limit: 5 })
    .then(function (response) {
      console.log('[Top Level] Resolved: queryRecord account__v', response);
      resultsEl.innerHTML += renderRawResponse('queryRecord account__v', response);
    })
    .catch(function (error) {
      console.log('[Top Level] Rejected: queryRecord account__v', error);
      resultsEl.innerHTML += renderRawResponse('queryRecord account__v [error]', error);
    });

  console.log('[Top Level] Firing: queryRecord call2__v');
  ds.queryRecord({ object: 'call2__v', fields: ['id', 'name__v'], where: '', limit: 5 })
    .then(function (response) {
      console.log('[Top Level] Resolved: queryRecord call2__v', response);
      resultsEl.innerHTML += renderRawResponse('queryRecord call2__v', response);
    })
    .catch(function (error) {
      console.log('[Top Level] Rejected: queryRecord call2__v', error);
      resultsEl.innerHTML += renderRawResponse('queryRecord call2__v [error]', error);
    });

  // ─── Other ambient APIs ───────────────────────────────────────────────────

  console.log('[Top Level] Firing: getAlignedTerritories');
  ds.getAlignedTerritories({ includeChildren: false })
    .then(function (response) {
      console.log('[Top Level] Resolved: getAlignedTerritories', response);
      resultsEl.innerHTML += renderRawResponse('getAlignedTerritories', response);
    })
    .catch(function (error) {
      console.log('[Top Level] Rejected: getAlignedTerritories', error);
      resultsEl.innerHTML += renderRawResponse('getAlignedTerritories [error]', error);
    });

  console.log('[Top Level] Firing: getAvailableObjects');
  ds.getAvailableObjects()
    .then(function (response) {
      console.log('[Top Level] Resolved: getAvailableObjects', response);
      resultsEl.innerHTML += renderRawResponse('getAvailableObjects', response);
    })
    .catch(function (error) {
      console.log('[Top Level] Rejected: getAvailableObjects', error);
      resultsEl.innerHTML += renderRawResponse('getAvailableObjects [error]', error);
    });

});

/**
 * Renders a raw response object as a labelled row, JSON-stringified.
 * Used for both resolved and rejected responses — renders the error the same way.
 * @param {string} label
 * @param {*} response
 * @returns {string} HTML string
 */
function renderRawResponse(label, response) {
  var value;
  try {
    value = JSON.stringify(response, null, 2);
  } catch (e) {
    value = String(response);
  }
  return (
    '<div class="data-row">' +
      '<span class="data-label">' + label + '</span>' +
      '<pre class="data-value raw-response">' + value + '</pre>' +
    '</div>'
  );
}

/**
 * Renders a labelled data row.
 * @param {string} label
 * @param {string} value
 * @returns {string} HTML string
 */
function renderRow(label, value) {
  return (
    '<div class="data-row">' +
      '<span class="data-label">' + label + '</span>' +
      '<span class="data-value">' + (value != null ? value : '(no value)') + '</span>' +
    '</div>'
  );
}
