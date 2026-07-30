/**
 * Prompt Overlay Entry Point - main.js
 *
 * Exploratory example for the Prompt Overlay entry point (prompt_overlay__v).
 *
 * The primary method here is getOverlayContext — the overlay-specific API
 * for determining where the overlay was triggered from and what context is
 * available. The response shape is not yet documented; this example fires it
 * and logs everything so we can inspect the raw response and understand what
 * fields are available.
 *
 * getDataForCurrentObject is also fired speculatively — the overlay may provide
 * no object context, but we try a range of object types and log what comes back.
 *
 * All raw responses are logged to the console before any values are extracted.
 * This is intentional — verify shapes here before building on top of them.
 *
 * NOTE: All ds calls only work when deployed inside Vault CRM. Running this
 * file locally will produce errors from the X-Pages library, which is expected.
 */

document.addEventListener('DOMContentLoaded', function () {

  var VERSION = '1.0.0';
  var versionEl = document.createElement('div');
  versionEl.className = 'version-stamp';
  versionEl.textContent = 'v' + VERSION;
  document.body.appendChild(versionEl);

  // Platform detection — set body class for CSS-driven feature visibility.
  // sendToMySchedule is iPad only; body:not(.platform-ipad) hides the button on other platforms.
  if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.myInsightsAPI) {
    document.body.classList.add('platform-ipad');
  }

  console.log('[Prompt Overlay] DOMContentLoaded fired');

  var overlayContextEl = document.getElementById('overlay-context');
  var currentObjectEl  = document.getElementById('current-object');

  overlayContextEl.innerHTML = '';
  currentObjectEl.innerHTML  = '';

  // ─── getOverlayContext ────────────────────────────────────────────────────
  // Primary call for this entry point. Response shape is unknown — log everything.
  // Expected to return some indication of where the overlay was triggered from
  // (e.g. account context, territory context) and relevant IDs.
  console.log('[Prompt Overlay] Firing: getOverlayContext');
  ds.getOverlayContext()
    .then(function (response) {
      console.log('[Prompt Overlay] Resolved: getOverlayContext', response);
      overlayContextEl.innerHTML = renderRawResponse('getOverlayContext', response);
    })
    .catch(function (error) {
      console.log('[Prompt Overlay] Rejected: getOverlayContext', error);
      var errorMessage = error ? (error.message || String(error)) : 'Unknown error';
      overlayContextEl.innerHTML = renderRow('getOverlayContext', 'Error: ' + errorMessage);
    });

  // ─── getDataForCurrentObject — speculative probes ─────────────────────────
  // The overlay may or may not expose object context via getDataForCurrentObject.
  // Fire a selection of likely object types and log what resolves vs rejects.
  // If the overlay is triggered from an account page, account__v may work.
  // If from territory, html_report__v / user__sys may work. All are worth trying.
  var probes = [
    { object: 'account__v',     field: 'id' },
    { object: 'account__v',     field: 'name__v' },
    { object: 'user__sys',      field: 'name__v' },
    { object: 'html_report__v', field: 'id' },
    { object: 'html_report__v', field: 'name__v' }
  ];

  probes.forEach(function (probe) {
    var label = probe.object + ' → ' + probe.field;
    console.log('[Prompt Overlay] Firing: getDataForCurrentObject', label);
    ds.getDataForCurrentObject(probe.object, probe.field)
      .then(function (response) {
        console.log('[Prompt Overlay] Resolved: getDataForCurrentObject ' + label, response);
        currentObjectEl.innerHTML += renderRawResponse(label, response);
      })
      .catch(function (error) {
        console.log('[Prompt Overlay] Rejected: getDataForCurrentObject ' + label, error);
        var errorMessage = error ? (error.message || String(error)) : 'Unknown error';
        currentObjectEl.innerHTML += renderRow(label, 'Error: ' + errorMessage);
      });
  });

});

/**
 * Renders a raw response object as a labelled row, JSON-stringified.
 * Used for unknown response shapes — shows everything so nothing is missed.
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
