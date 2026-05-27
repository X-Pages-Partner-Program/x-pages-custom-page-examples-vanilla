/**
 * Territory Entry Point - main.js
 *
 * Exploratory example: calls getDataForCurrentObject('account__v', 'id')
 * from a Territory entry point context.
 *
 * IMPORTANT: The Territory entry point is not listed in the official X-Pages
 * documentation as a supported context for getDataForCurrentObject. This call
 * is intentionally exploratory — the goal is to validate what is actually
 * returned (or whether an error is thrown) when the page is deployed and
 * launched from a Territory context in Vault CRM.
 *
 * The full raw response is logged to the console and rendered on the page
 * to make it easy to inspect the result.
 *
 * NOTE: These calls only work when deployed inside Vault CRM. Running this
 * file locally will produce errors from the X-Pages library, which is expected.
 */

document.addEventListener('DOMContentLoaded', function () {

  var resultsEl = document.getElementById('results');

  // Add a note to the page explaining the exploratory nature of this call
  var noteEl = document.createElement('p');
  noteEl.className = 'note';
  noteEl.textContent =
    'Exploratory call: getDataForCurrentObject is not documented for the ' +
    'Territory entry point. This page validates what Vault CRM actually returns.';
  resultsEl.parentNode.insertBefore(noteEl, resultsEl);

  // Attempt to retrieve the account ID from the Territory context
  ds.getDataForCurrentObject('account__v', 'id')
    .then(function (response) {

      // Log the full raw response for inspection
      console.log('[Territory Entry Point] Raw response - account__v id:', response);

      // Render the result to the page
      resultsEl.innerHTML = renderRow('account__v → id', formatValue(response));

    })
    .catch(function (error) {

      // Log the error — this may be the expected outcome in a Territory context
      console.error('[Territory Entry Point] Error fetching account__v id:', error);

      resultsEl.innerHTML =
        '<p class="error">Error fetching data. This may be expected behaviour ' +
        'if getDataForCurrentObject is not supported in the Territory entry point context. ' +
        'Check the console for the full error.</p>';

    });

});

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
