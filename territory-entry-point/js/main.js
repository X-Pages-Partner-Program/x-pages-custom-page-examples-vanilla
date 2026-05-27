/**
 * Territory Entry Point - main.js
 *
 * Demonstrates using getDataForCurrentObject from a Territory entry point
 * context. Three calls are made in parallel using Promise.allSettled().
 *
 * Promise.allSettled() is used instead of Promise.all() so that a failure on
 * one call does not prevent the others from returning. Each result is handled
 * individually, making it easy to see exactly which calls succeed or fail.
 *
 * Response shape: each call returns an object keyed by the object name,
 * containing the requested field as a property. For example:
 *   ds.getDataForCurrentObject('html_report__v', 'id')
 *   → { html_report__v: { id: '...' } }
 *
 * The full raw response of each call is logged to the console and the
 * extracted value is rendered on the page.
 *
 * NOTE: These calls only work when deployed inside Vault CRM. Running this
 * file locally will produce errors from the X-Pages library, which is expected.
 */

document.addEventListener('DOMContentLoaded', function () {

  var resultsEl = document.getElementById('results');

  // Fire all three calls in parallel.
  // allSettled() ensures every call gets a chance to resolve or reject
  // independently — a failure on one will not abort the others.
  Promise.allSettled([
    ds.getDataForCurrentObject('user__sys', 'name__v'),
    ds.getDataForCurrentObject('html_report__v', 'id'),
    ds.getDataForCurrentObject('html_report__v', 'name__v')
  ])
  .then(function (results) {

    var userNameResult    = results[0];
    var reportIdResult    = results[1];
    var reportNameResult  = results[2];

    // Log all raw responses to the console for inspection
    console.log('[Territory Entry Point] Raw result - user__sys name__v:', userNameResult);
    console.log('[Territory Entry Point] Raw result - html_report__v id:', reportIdResult);
    console.log('[Territory Entry Point] Raw result - html_report__v name__v:', reportNameResult);

    // Render each result — fulfilled values are extracted from the confirmed
    // response shape; rejected calls show which call failed and the error message
    resultsEl.innerHTML =
      renderResult('user__sys → name__v',      userNameResult,   function(v) { return v.user__sys.name__v; })      +
      renderResult('html_report__v → id',      reportIdResult,   function(v) { return v.html_report__v.id; })      +
      renderResult('html_report__v → name__v', reportNameResult, function(v) { return v.html_report__v.name__v; });

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
