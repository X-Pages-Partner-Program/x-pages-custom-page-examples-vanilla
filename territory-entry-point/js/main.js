/**
 * Territory Entry Point - main.js
 *
 * Demonstrates using getDataForCurrentObject and getAvailableObjects from a
 * Territory entry point context. Each call is fired independently so its
 * resolve/reject lifecycle can be observed in isolation.
 *
 * Response shape: each getDataForCurrentObject call returns an object keyed
 * by the object name, containing the requested field as a property. For example:
 *   ds.getDataForCurrentObject('html_report__v', 'id')
 *   → { html_report__v: { id: '...' } }
 *
 * getAvailableObjects logs the full raw response to the console. The page
 * renders a success confirmation only — see the console for the full response.
 *
 * The Navigation section demonstrates ds.viewRecord, which navigates to a
 * different record. The optional target parameter specifies which X-Page tab
 * to land on at the destination. Buttons 2, 3, and 4 test the three accepted
 * target identifier types: id, studio_id__v, and external_id__v.
 * Hardcoded IDs are real values from our test environment.
 *
 * NOTE: These calls only work when deployed inside Vault CRM. Running this
 * file locally will produce errors from the X-Pages library, which is expected.
 */

document.addEventListener('DOMContentLoaded', function () {

  var VERSION = '1.0.6';
  var versionEl = document.createElement('div');
  versionEl.className = 'version-stamp';
  versionEl.textContent = 'v' + VERSION;
  document.body.appendChild(versionEl);

  console.log('[Territory Entry Point] DOMContentLoaded fired');

  var resultsEl     = document.getElementById('results');
  var territoriesEl = document.getElementById('territories');
  var accountsEl    = document.getElementById('accounts');
  var navigationEl  = document.getElementById('navigation');

  // Clear the loading placeholders before any results are appended
  resultsEl.innerHTML     = '';
  territoriesEl.innerHTML = '';
  accountsEl.innerHTML    = '';

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

  console.log('[Territory Entry Point] Building navigation buttons...');

  var actionsHtml = '<div class="nav-actions">';
  buttons.forEach(function (btn) {
    actionsHtml += '<button class="nav-button" data-label="' + btn.label + '">' + btn.label + '</button>';
  });
  actionsHtml += '</div>';
  navigationEl.innerHTML = actionsHtml;

  console.log('[Territory Entry Point] Navigation buttons rendered:', navigationEl.innerHTML);

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

  // viewSection switches to a different tab within the current page context.
  // It takes a section ID directly rather than a record config object, so it
  // is wired up separately from the viewRecord buttons above.
  var viewSectionBtn = document.createElement('button');
  viewSectionBtn.className = 'nav-button';
  viewSectionBtn.textContent = 'Switch Tab to OOTB Page';
  navigationEl.querySelector('.nav-actions').appendChild(viewSectionBtn);

  viewSectionBtn.addEventListener('click', function () {
    ds.viewSection({ id: 'V8P000000004001' })
      .then(function (response) {
        console.log('[Territory Entry Point] Navigation — Switch Tab to OOTB Page resolved:', response);
      })
      .catch(function (error) {
        console.log('[Territory Entry Point] Navigation — Switch Tab to OOTB Page rejected:', error);
      });
  });

  // Each data call is fired independently so its resolve/reject lifecycle is
  // visible in isolation. Results are appended to resultsEl as each call settles
  // rather than waiting for all calls to complete before rendering anything.

  console.log('[Territory Entry Point] Firing: getDataForCurrentObject user__sys name__v');
  ds.getDataForCurrentObject('user__sys', 'name__v')
    .then(function (response) {
      console.log('[Territory Entry Point] Resolved: getDataForCurrentObject user__sys name__v', response);
      var result = { status: 'fulfilled', value: response };
      resultsEl.innerHTML += renderResult('user__sys → name__v', result, function(v) { return v.user__sys.name__v; });
    })
    .catch(function (error) {
      console.log('[Territory Entry Point] Rejected: getDataForCurrentObject user__sys name__v', error);
      var result = { status: 'rejected', reason: error };
      resultsEl.innerHTML += renderResult('user__sys → name__v', result, function(v) { return v.user__sys.name__v; });
    });

  console.log('[Territory Entry Point] Firing: getDataForCurrentObject html_report__v id');
  ds.getDataForCurrentObject('html_report__v', 'id')
    .then(function (response) {
      console.log('[Territory Entry Point] Resolved: getDataForCurrentObject html_report__v id', response);
      var result = { status: 'fulfilled', value: response };
      resultsEl.innerHTML += renderResult('html_report__v → id', result, function(v) { return v.html_report__v.id; });
    })
    .catch(function (error) {
      console.log('[Territory Entry Point] Rejected: getDataForCurrentObject html_report__v id', error);
      var result = { status: 'rejected', reason: error };
      resultsEl.innerHTML += renderResult('html_report__v → id', result, function(v) { return v.html_report__v.id; });
    });

  console.log('[Territory Entry Point] Firing: getDataForCurrentObject html_report__v name__v');
  ds.getDataForCurrentObject('html_report__v', 'name__v')
    .then(function (response) {
      console.log('[Territory Entry Point] Resolved: getDataForCurrentObject html_report__v name__v', response);
      var result = { status: 'fulfilled', value: response };
      resultsEl.innerHTML += renderResult('html_report__v → name__v', result, function(v) { return v.html_report__v.name__v; });
    })
    .catch(function (error) {
      console.log('[Territory Entry Point] Rejected: getDataForCurrentObject html_report__v name__v', error);
      var result = { status: 'rejected', reason: error };
      resultsEl.innerHTML += renderResult('html_report__v → name__v', result, function(v) { return v.html_report__v.name__v; });
    });

  console.log('[Territory Entry Point] Firing: getAvailableObjects');
  ds.getAvailableObjects()
    .then(function (response) {
      console.log('[Territory Entry Point] Resolved: getAvailableObjects', response);
      var result = { status: 'fulfilled', value: response };
      resultsEl.innerHTML += renderResult('getAvailableObjects', result, function() { return '✓ success — see console for full response'; });
    })
    .catch(function (error) {
      console.log('[Territory Entry Point] Rejected: getAvailableObjects', error);
      var result = { status: 'rejected', reason: error };
      resultsEl.innerHTML += renderResult('getAvailableObjects', result, function() { return '✓ success — see console for full response'; });
    });

  // getAlignedTerritories — fired twice: without and with includeChildren.
  // Exploratory — log full response to console and render success/error on page.
  console.log('[Territory Entry Point] Firing: getAlignedTerritories (includeChildren: false)');
  ds.getAlignedTerritories()
    .then(function (response) {
      console.log('[Territory Entry Point] Resolved: getAlignedTerritories (includeChildren: false)', response);
      var result = { status: 'fulfilled', value: response };
      resultsEl.innerHTML += renderResult('getAlignedTerritories (no children)', result, function() { return '✓ success — see console for full response'; });
    })
    .catch(function (error) {
      console.log('[Territory Entry Point] Rejected: getAlignedTerritories (includeChildren: false)', error);
      var result = { status: 'rejected', reason: error };
      resultsEl.innerHTML += renderResult('getAlignedTerritories (no children)', result, function() { return ''; });
    });

  console.log('[Territory Entry Point] Firing: getAlignedTerritories (includeChildren: true)');
  ds.getAlignedTerritories({ includeChildren: true })
    .then(function (response) {
      console.log('[Territory Entry Point] Resolved: getAlignedTerritories (includeChildren: true)', response);
      var result = { status: 'fulfilled', value: response };
      resultsEl.innerHTML += renderResult('getAlignedTerritories (with children)', result, function() { return '✓ success — see console for full response'; });
    })
    .catch(function (error) {
      console.log('[Territory Entry Point] Rejected: getAlignedTerritories (includeChildren: true)', error);
      var result = { status: 'rejected', reason: error };
      resultsEl.innerHTML += renderResult('getAlignedTerritories (with children)', result, function() { return ''; });
    });

  // getObjectMetadata on territory__v — exploratory, log to console.
  console.log('[Territory Entry Point] Firing: getObjectMetadata territory__v');
  ds.getObjectMetadata({ object: 'territory__v' })
    .then(function (response) {
      console.log('[Territory Entry Point] Resolved: getObjectMetadata territory__v', response);
      var result = { status: 'fulfilled', value: response };
      resultsEl.innerHTML += renderResult('getObjectMetadata territory__v', result, function() { return '✓ success — see console for full response'; });
    })
    .catch(function (error) {
      console.log('[Territory Entry Point] Rejected: getObjectMetadata territory__v', error);
      var result = { status: 'rejected', reason: error };
      resultsEl.innerHTML += renderResult('getObjectMetadata territory__v', result, function() { return ''; });
    });

  // queryRecord — first 5 accounts (no filter, no sort — exploratory baseline).
  console.log('[Territory Entry Point] Firing: queryRecord account__v (limit 5)');
  ds.queryRecord({
    object: 'account__v',
    fields: ['id', 'name__v'],
    limit: 5
  })
  .then(function (response) {
    console.log('[Territory Entry Point] Resolved: queryRecord account__v', response);

    var records = response.account__v;

    if (!records || records.length === 0) {
      accountsEl.innerHTML = '<p class="no-results">No accounts found.</p>';
      return;
    }

    accountsEl.innerHTML = records.map(function (account) {
      return renderAccountRow(account);
    }).join('');

    // Attach click handlers after rows are in the DOM.
    // Account name click — viewRecord to the account's X-Page tab.
    accountsEl.querySelectorAll('.account-name-link').forEach(function (el) {
      el.addEventListener('click', function () {
        var accountId = el.getAttribute('data-account-id');
        console.log('[Territory Entry Point] Navigating to account:', accountId);
        ds.viewRecord({
          object: 'account__v',
          fields: { id: accountId },
          target: [{ id: 'V8P000000008001' }]
        })
        .then(function (response) {
          console.log('[Territory Entry Point] viewRecord account__v resolved:', response);
        })
        .catch(function (error) {
          console.log('[Territory Entry Point] viewRecord account__v rejected:', error);
        });
      });
    });

    // Phone button — stub, wired up later.
    accountsEl.querySelectorAll('.account-action--phone').forEach(function (el) {
      el.addEventListener('click', function () {
        var accountId = el.getAttribute('data-account-id');
        console.log('[Territory Entry Point] Phone button clicked for account:', accountId);
      });
    });

    // Email button — stub, wired up later.
    accountsEl.querySelectorAll('.account-action--email').forEach(function (el) {
      el.addEventListener('click', function () {
        var accountId = el.getAttribute('data-account-id');
        console.log('[Territory Entry Point] Email button clicked for account:', accountId);
      });
    });

  })
  .catch(function (error) {
    console.error('[Territory Entry Point] Error fetching accounts:', error);
    accountsEl.innerHTML = '<p class="error">Error fetching accounts. Check the console for details.</p>';
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
 * Renders a single account row with a clickable name and phone/email action buttons.
 * @param {Object} account - a record object from the queryRecord response
 * @returns {string} HTML string
 */
function renderAccountRow(account) {
  var id   = account.id   || '';
  var name = account.name__v || '—';
  return (
    '<div class="account-row">' +
      '<span class="account-name account-name-link" data-account-id="' + id + '">' + name + '</span>' +
      '<div class="account-actions">' +
        '<button class="account-action account-action--phone" data-account-id="' + id + '" title="Call">' +
          '<img src="assets/icons/phone.svg" alt="Call" width="16" height="16" />' +
        '</button>' +
        '<button class="account-action account-action--email" data-account-id="' + id + '" title="Email">' +
          '<img src="assets/icons/email.svg" alt="Email" width="16" height="16" />' +
        '</button>' +
      '</div>' +
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
