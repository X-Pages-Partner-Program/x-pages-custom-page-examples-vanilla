/**
 * Territory Entry Point - main.js
 *
 * Demonstrates using getDataForCurrentObject and getAvailableObjects from a
 * Territory entry point context. All calls are made in parallel using
 * Promise.allSettled().
 *
 * Promise.allSettled() is used instead of Promise.all() so that a failure on
 * one call does not prevent the others from returning. Each result is handled
 * individually, making it easy to see exactly which calls succeed or fail.
 *
 * Response shape: each getDataForCurrentObject call returns an object keyed
 * by the object name, containing the requested field as a property. For example:
 *   ds.getDataForCurrentObject('html_report__v', 'id')
 *   → { html_report__v: { id: '...' } }
 *
 * getAvailableObjects returns the full response — log and render as raw JSON
 * to confirm the response shape empirically before extracting values.
 *
 * The Navigation section below demonstrates ds.viewRecord, which navigates
 * to a different record. The optional target parameter specifies which X-Page
 * tab to land on at the destination. Buttons 2, 3, and 4 test the three
 * accepted target identifier types: id, studio_id__v, and external_id__v.
 * Hardcoded IDs are real values from our test environment.
 *
 * NOTE: These calls only work when deployed inside Vault CRM. Running this
 * file locally will produce errors from the X-Pages library, which is expected.
 */

document.addEventListener('DOMContentLoaded', function () {

  var resultsEl    = document.getElementById('results');
  var navigationEl = document.getElementById('navigation');

  // Fire all calls in parallel.
  // allSettled() ensures every call gets a chance to resolve or reject
  // independently — a failure on one will not abort the others.
  Promise.allSettled([
    ds.getDataForCurrentObject('user__sys', 'name__v'),
    ds.getDataForCurrentObject('html_report__v', 'id'),
    ds.getDataForCurrentObject('html_report__v', 'name__v'),
    ds.getAvailableObjects()
  ])
  .then(function (results) {

    var userNameResult          = results[0];
    var reportIdResult          = results[1];
    var reportNameResult        = results[2];
    var availableObjectsResult  = results[3];

    // Log all raw responses to the console for inspection
    console.log('[Territory Entry Point] Raw result - user__sys name__v:', userNameResult);
    console.log('[Territory Entry Point] Raw result - html_report__v id:', reportIdResult);
    console.log('[Territory Entry Point] Raw result - html_report__v name__v:', reportNameResult);
    console.log('[Territory Entry Point] Raw result - getAvailableObjects:', availableObjectsResult);

    // Render each result — fulfilled values are extracted from the confirmed
    // response shape; rejected calls show which call failed and the error message.
    // getAvailableObjects is rendered as raw JSON to confirm the response shape.
    resultsEl.innerHTML =
      renderResult('user__sys → name__v',      userNameResult,         function(v) { return v.user__sys.name__v; })         +
      renderResult('html_report__v → id',      reportIdResult,         function(v) { return v.html_report__v.id; })         +
      renderResult('html_report__v → name__v', reportNameResult,       function(v) { return v.html_report__v.name__v; })    +
      renderResult('getAvailableObjects',      availableObjectsResult, function(v) { return JSON.stringify(v); });

  });

  // Navigation — ds.viewRecord navigates to a different record in Vault CRM.
  // The optional target parameter specifies which X-Page tab to open at the
  // destination. Three target identifier formats are tested across buttons 2–4:
  // id, studio_id__v, and external_id__v. All IDs are real values from the
  // test environment.
  var buttons = [
    {
      label:  'Go to Adam Deutsch (default)',
      config: {
        object: 'account__v',
        fields: { id: 'V4T000000001010' }
      }
    },
    {
      label:  'Go to Adam Deutsch + X-Page (id)',
      config: {
        object: 'account__v',
        fields: { id: 'V4T000000001010' },
        target: [{ id: 'V8P000000001001' }]
      }
    },
    {
      label:  'Go to Adam Deutsch + X-Page (studio_id)',
      config: {
        object: 'account__v',
        fields: { id: 'V4T000000001010' },
        target: [{ studio_id__v: '2737291c-457b-414a-b1b5-1f9be644b0a2' }]
      }
    },
    {
      label:  'Go to Adam Deutsch + X-Page (external_id)',
      config: {
        object: 'account__v',
        fields: { id: 'V4T000000001010' },
        target: [{ external_id__v: 'Commercial HCP Page - From OOTB' }]
      }
    }
  ];

  var actionsHtml = '<div class="nav-actions">';
  buttons.forEach(function (btn) {
    actionsHtml += '<button class="nav-button" data-label="' + btn.label + '">' + btn.label + '</button>';
  });
  actionsHtml += '</div>';
  navigationEl.innerHTML = actionsHtml;

  // Attach click handlers after the buttons are in the DOM.
  // Each handler fires the corresponding ds.viewRecord call and logs the result.
  var buttonEls = navigationEl.querySelectorAll('.nav-button');
  buttonEls.forEach(function (buttonEl, index) {
    buttonEl.addEventListener('click', function () {
      var config = buttons[index].config;
      ds.viewRecord(config)
        .then(function (response) {
          console.log('[Territory Entry Point] Navigation — ' + buttons[index].label + ' resolved:', response);
        })
        .catch(function (error) {
          console.log('[Territory Entry Point] Navigation — ' + buttons[index].label + ' rejected:', error);
        });
    });
  });

});

/**
 * Renders a single allSettled result as a labelled row.
 * Fulfilled results extract and show the value via the provided extractor
 * function; rejected results show which call failed and the error message.
 * @param {string} label - human-readable label for the call
 * @param {PromiseSettledResult} result - the allSettled result object
 * @param {Function} extractor - extracts the display value from result.value
 * @returns {string} HTML string
 */
function renderResult(label, result, extractor) {
  if (result.status === 'fulfilled') {
    var value = extractor(result.value);
    return renderRow(label, value != null ? String(value) : '(no value)');
  }

  // Rejection — extract a useful message from the error if possible
  var errorMessage = result.reason
    ? (result.reason.message || String(result.reason))
    : 'Unknown error';

  return (
    '<div class="data-row">' +
      '<span class="data-label">' + label + '</span>' +
      '<span class="data-value error-inline">Error: ' + errorMessage + '</span>' +
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
      '<span class="data-value">' + value + '</span>' +
    '</div>'
  );
}
