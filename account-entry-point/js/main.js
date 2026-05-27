/**
 * Account Entry Point - main.js
 *
 * Demonstrates using getDataForCurrentObject to retrieve account and user
 * data from the Vault CRM context. All three calls are made in parallel
 * using Promise.all().
 *
 * Response shape: each call returns an object keyed by the object name,
 * containing the requested field as a property. For example:
 *   ds.getDataForCurrentObject('account__v', 'id')
 *   → { account__v: { id: '...' } }
 *
 * NOTE: These calls only work when deployed inside Vault CRM. Running this
 * file locally will produce errors from the X-Pages library, which is expected.
 */

document.addEventListener('DOMContentLoaded', function () {

  var resultsEl = document.getElementById('results');

  // Make all three data calls in parallel
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

    // Render results to the page
    resultsEl.innerHTML =
      renderRow('Account ID',   accountId)   +
      renderRow('Account Name', accountName) +
      renderRow('Current User', userName);

  })
  .catch(function (error) {

    // Log the error for debugging
    console.error('[Account Entry Point] Error fetching data:', error);

    // Show error state on the page
    resultsEl.innerHTML =
      '<p class="error">Error fetching data from Vault CRM. ' +
      'Check the console for details. If running locally, this is expected — ' +
      'the X-Pages library requires a Vault CRM context.</p>';

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
      '<span class="data-value">' + (value != null ? value : '(no value)') + '</span>' +
    '</div>'
  );
}
