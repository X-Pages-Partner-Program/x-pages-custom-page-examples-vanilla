/**
 * Account Entry Point - main.js
 *
 * Demonstrates two X-Pages JS Library data methods:
 *
 *   1. getDataForCurrentObject — retrieves fields from the current account and
 *      user context. These values are provided by the Vault CRM runtime and do
 *      not require a query.
 *
 *   2. queryRecord — queries call2__v records for the current account. The
 *      account ID retrieved in step 1 is used as the WHERE clause value, so
 *      queryRecord is chained after getDataForCurrentObject resolves.
 *
 * Response shape for getDataForCurrentObject:
 *   Each call returns an object keyed by the object name, e.g.:
 *   ds.getDataForCurrentObject('account__v', 'id') → { account__v: { id: '...' } }
 *
 * Response shape for queryRecord:
 *   Returns an array of record objects with the requested fields as properties.
 *   The full raw response is logged to the console before any values are extracted —
 *   verify the shape in the console when testing in Vault CRM.
 *
 * NOTE: All ds calls only work when deployed inside Vault CRM. Running this
 * file locally will produce errors from the X-Pages library, which is expected.
 */

document.addEventListener('DOMContentLoaded', function () {

  // Render the platform badge immediately — this is independent of any data calls
  renderPlatformBadge();

  var resultsEl = document.getElementById('results');
  var callsEl   = document.getElementById('calls');

  // Step 1: Fetch context data in parallel.
  // All three getDataForCurrentObject calls are fired together — the library
  // serialises queries internally, so firing them as a group via Promise.all()
  // is faster than chaining them sequentially.
  Promise.all([
    ds.getDataForCurrentObject('account__v', 'id'),
    ds.getDataForCurrentObject('account__v', 'name__v'),
    ds.getDataForCurrentObject('user__sys', 'name__v')
  ])
  .then(function (responses) {

    var accountIdResponse   = responses[0];
    var accountNameResponse = responses[1];
    var userNameResponse    = responses[2];

    // Log the full raw responses to the console for inspection
    console.log('[Account Entry Point] Raw response - account__v id:', accountIdResponse);
    console.log('[Account Entry Point] Raw response - account__v name__v:', accountNameResponse);
    console.log('[Account Entry Point] Raw response - user__sys name__v:', userNameResponse);

    // Extract values from the confirmed response shape
    var accountId   = accountIdResponse.account__v.id;
    var accountName = accountNameResponse.account__v.name__v;
    var userName    = userNameResponse.user__sys.name__v;

    // Render context data to the page
    resultsEl.innerHTML =
      renderRow('Account ID',   accountId)   +
      renderRow('Account Name', accountName) +
      renderRow('Current User', userName);

    // Step 2: Query recent calls for this account.
    // This is chained after step 1 because the WHERE clause depends on
    // the account ID retrieved above.
    //
    // WHERE clause note: simple equality syntax works across Browser and iPad.
    // More complex syntax may differ by platform — see X-Pages CLAUDE.md.
    ds.queryRecord({
      object: 'call2__v',
      fields: ['id', 'name__v', 'call_date__v', 'status_vod__v'],
      where:  'account__v = \'' + accountId + '\'',
      limit:  10
    })
    .then(function (callsResponse) {

      // Log the full raw response before extracting any values.
      // Verify this shape in the console when testing in Vault CRM.
      console.log('[Account Entry Point] Raw response - queryRecord call2__v:', callsResponse);

      if (!callsResponse || callsResponse.length === 0) {
        callsEl.innerHTML = '<p class="no-results">No recent calls found for this account.</p>';
        return;
      }

      callsEl.innerHTML = callsResponse.map(function (call) {
        return renderCallRow(call);
      }).join('');

    })
    .catch(function (error) {
      console.error('[Account Entry Point] Error fetching calls:', error);
      callsEl.innerHTML = '<p class="error">Error fetching calls. Check the console for details.</p>';
    });

  })
  .catch(function (error) {

    // Log the error for debugging
    console.error('[Account Entry Point] Error fetching context data:', error);

    // Show error state on the page — calls section also won't load since
    // the account ID needed for the query is unavailable
    resultsEl.innerHTML =
      '<p class="error">Error fetching data from Vault CRM. ' +
      'Check the console for details. If running locally, this is expected — ' +
      'the X-Pages library requires a Vault CRM context.</p>';

    callsEl.innerHTML = '<p class="error">Calls unavailable — account ID could not be retrieved.</p>';

  });

});

/**
 * Detects the current platform and renders a fixed badge in the top-right corner.
 * Detection logic mirrors what the X-Pages library uses internally.
 */
function renderPlatformBadge() {
  var platform;
  var modifier;

  if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.myInsightsAPI) {
    platform = 'iPad';
    modifier = 'platform-badge--ipad';
  } else if (typeof window.external !== 'undefined' && 'notify' in window.external) {
    platform = 'Windows';
    modifier = 'platform-badge--windows';
  } else {
    platform = 'Browser';
    modifier = 'platform-badge--browser';
  }

  var badge = document.createElement('div');
  badge.className = 'platform-badge ' + modifier;
  badge.textContent = platform;
  document.body.appendChild(badge);
}

/**
 * Renders a single call record as a row with all four requested fields.
 * @param {Object} call - a record object from the queryRecord response
 * @returns {string} HTML string
 */
function renderCallRow(call) {
  return (
    '<div class="call-row">' +
      '<div class="call-field"><span class="data-label">Name</span><span class="data-value">'        + safeValue(call.name__v)        + '</span></div>' +
      '<div class="call-field"><span class="data-label">Date</span><span class="data-value">'        + safeValue(call.call_date__v)   + '</span></div>' +
      '<div class="call-field"><span class="data-label">Status</span><span class="data-value">'      + safeValue(call.status_vod__v)  + '</span></div>' +
      '<div class="call-field call-field--id"><span class="data-label">ID</span><span class="data-value">' + safeValue(call.id) + '</span></div>' +
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

/**
 * Returns a display-safe string for a field value.
 * @param {*} value
 * @returns {string}
 */
function safeValue(value) {
  if (value === null || value === undefined || value === '') {
    return '<span class="no-value">—</span>';
  }
  return String(value);
}
