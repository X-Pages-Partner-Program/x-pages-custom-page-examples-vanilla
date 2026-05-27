/**
 * Territory Entry Point - main.js
 *
 * Exploratory example: calls getDataForCurrentObject from a Territory
 * entry point context using three different object/field combinations.
 *
 * IMPORTANT: The Territory entry point is not listed in the official X-Pages
 * documentation as a supported context for getDataForCurrentObject. These calls
 * are intentionally exploratory — the goal is to validate what is actually
 * returned (or whether errors are thrown) when the page is deployed and
 * launched from a Territory context in Vault CRM.
 *
 * Promise.allSettled() is used instead of Promise.all() so that a failure on
 * one call does not prevent the others from returning. Each result is handled
 * individually, making it easy to see exactly which calls succeed or fail.
 *
 * The full raw response of each call is logged to the console and rendered
 * on the page for inspection.
 *
 * NOTE: These calls only work when deployed inside Vault CRM. Running this
 * file locally will produce errors from the X-Pages library, which is expected.
 */

document.addEventListener('DOMContentLoaded', function () {

  var resultsEl = document.getElementById('results');

  // Add a note to the page explaining the exploratory nature of these calls
  var noteEl = document.createElement('p');
  noteEl.className = 'note';
  noteEl.textContent =
    'Exploratory: getDataForCurrentObject is not documented for the Territory ' +
    'entry point. This page validates what Vault CRM actually returns for each call.';
  resultsEl.parentNode.insertBefore(noteEl, resultsEl);

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

    // Render each result individually — fulfilled values are shown as data,
    // rejected calls show which call failed and the error message
    resultsEl.innerHTML =
      renderResult('user__sys → name__v',       userNameResult)   +
      renderResult('html_report__v → id',       reportIdResult)   +
      renderResult('html_report__v → name__v',  reportNameResult);

  });

});

/**
 * Renders a single allSettled result as a labelled row.
 * Fulfilled results show the value; rejected results show the error.
 * @param {string} label  - human-readable label for the call
 * @param {PromiseSettledResult} result - the allSettled result object
 * @returns {string} HTML string
 */
function renderResult(label, result) {
  if (result.status === 'fulfilled') {
    return renderRow(label, formatValue(result.value));
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

/**
 * Extracts a display value from a raw ds response.
 * Handles both plain values and response objects gracefully.
 * @param {*} response
 * @returns {string}
 */
function formatValue(response) {
  if (response === null || response === undefined) {
    return '(no value)';
  }
  if (typeof response === 'object') {
    return JSON.stringify(response);
  }
  return String(response);
}
