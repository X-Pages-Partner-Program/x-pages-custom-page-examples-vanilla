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

  var VERSION = '1.0.5';
  var versionEl = document.createElement('div');
  versionEl.className = 'version-stamp';
  versionEl.textContent = 'v' + VERSION;
  document.body.appendChild(versionEl);

  // Render the platform badge immediately — this is independent of any data calls
  renderPlatformBadge();

  var resultsEl    = document.getElementById('results');
  var callsEl      = document.getElementById('calls');
  var navigationEl = document.getElementById('navigation');

  // Navigation — viewRecord buttons. Currently empty; buttons will be added
  // once target IDs are confirmed from testing.
  var navButtons = [];

  var actionsHtml = '<div class="nav-actions">';
  navButtons.forEach(function (btn) {
    actionsHtml += '<button class="nav-button" data-label="' + btn.label + '">' + btn.label + '</button>';
  });
  actionsHtml += '</div>';
  navigationEl.innerHTML = actionsHtml;

  // Attach click handlers after the buttons are in the DOM.
  // Each handler fires the corresponding ds.viewRecord call and logs the result.
  var buttonEls = navigationEl.querySelectorAll('.nav-button');
  buttonEls.forEach(function (buttonEl, index) {
    buttonEl.addEventListener('click', function () {
      var config = navButtons[index].config;
      ds.viewRecord(config)
        .then(function (response) {
          console.log('[Account Entry Point] Navigation — ' + navButtons[index].label + ' resolved:', response);
        })
        .catch(function (error) {
          console.log('[Account Entry Point] Navigation — ' + navButtons[index].label + ' rejected:', error);
        });
    });
  });

  // viewSection switches to a different tab within the current page context.
  // It takes a section ID directly rather than a record config object, so it
  // is wired up separately from the viewRecord buttons above.
  var viewSectionBtn = document.createElement('button');
  viewSectionBtn.className = 'nav-button';
  viewSectionBtn.textContent = 'Switch Tab to HCP OOTB';
  navigationEl.querySelector('.nav-actions').appendChild(viewSectionBtn);

  viewSectionBtn.addEventListener('click', function () {
    ds.viewSection({ id: 'V8P000000001001' })
      .then(function (response) {
        console.log('[Account Entry Point] Navigation — Switch Tab to HCP OOTB resolved:', response);
      })
      .catch(function (error) {
        console.log('[Account Entry Point] Navigation — Switch Tab to HCP OOTB rejected:', error);
      });
  });

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

    // Step 2: Query recent calls for this account, sorted by date descending.
    // This is chained after step 1 because the WHERE clause depends on
    // the account ID retrieved above.
    //
    // WHERE clause note: simple equality syntax works across Browser and iPad.
    // More complex syntax may differ by platform — see X-Pages CLAUDE.md.
    ds.queryRecord({
      object: 'call2__v',
      fields: ['id', 'name__v', 'call_date__v', 'status__v'],
      where:  'account__v = \'' + accountId + '\'',
      sort:   ['call_date__v DESC'],
      limit:  10
    })
    .then(function (callsResponse) {

      // Log the full raw response before extracting any values.
      // Verify this shape in the console when testing in Vault CRM.
      console.log('[Account Entry Point] Raw response - queryRecord call2__v:', callsResponse);

      var records = callsResponse.call2__v;

      if (!records || records.length === 0) {
        callsEl.innerHTML = '<p class="no-results">No recent calls found for this account.</p>';
        return;
      }

      callsEl.innerHTML = records.map(function (call) {
        return renderCallRow(call);
      }).join('');

      // Attach click handlers to each ID link after the rows are in the DOM.
      // Clicking navigates to that call record via ds.viewRecord.
      callsEl.querySelectorAll('.call-id-link').forEach(function (el) {
        el.addEventListener('click', function () {
          var callId = el.getAttribute('data-call-id');
          console.log('[Account Entry Point] Navigating to call:', callId);
          ds.viewRecord({ object: 'call2__v', fields: { id: callId } })
            .then(function (response) {
              console.log('[Account Entry Point] viewRecord call2__v resolved:', response);
            })
            .catch(function (error) {
              console.log('[Account Entry Point] viewRecord call2__v rejected:', error);
            });
        });
      });

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
      '<div class="call-field"><span class="data-label">Status</span><span class="data-value">'      + safeValue(call.status__v)      + '</span></div>' +
      '<div class="call-field call-field--id"><span class="data-label">ID</span><span class="data-value call-id-link" data-call-id="' + safeValue(call.id) + '">' + safeValue(call.id) + '</span></div>' +
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
