/**
 * Prompt Overlay Entry Point - main.js
 *
 * Context-aware implementation for the Prompt Overlay entry point (prompt_overlay__v).
 *
 * Calls ds.getOverlayContext() first and switches on response.context.page:
 *
 *   "account" — account ID available at response.context.id. Fetches account name
 *               via getDataForCurrentObject and renders the account with action buttons.
 *
 *   "home"    — Territory context, no account ID. Queries 5 accounts and renders
 *               each as a row with action buttons.
 *
 *   all other contexts ("call", "top_level_xpage", unknown) — renders the full raw
 *               getOverlayContext response as formatted JSON for inspection.
 *
 * Action buttons (Phone, Email, Media, Schedule) mirror the account and territory
 * entry point examples exactly. Schedule is iPad-only via CSS.
 *
 * NOTE: All ds calls only work when deployed inside Vault CRM. Running this
 * file locally will produce errors from the X-Pages library, which is expected.
 */

document.addEventListener('DOMContentLoaded', function () {

  var VERSION = '2.1.1';
  var versionEl = document.createElement('div');
  versionEl.className = 'version-stamp';
  versionEl.textContent = 'v' + VERSION;
  document.body.appendChild(versionEl);

  renderPlatformBadge();

  console.log('[Prompt Overlay] DOMContentLoaded fired');

  var contentEl = document.getElementById('content');
  contentEl.innerHTML = '';

  console.log('[Prompt Overlay] Firing: getOverlayContext');
  ds.getOverlayContext()
    .then(function (response) {
      console.log('[Prompt Overlay] Resolved: getOverlayContext', response);

      var page = response && response.context && response.context.page;

      if (page === 'account') {
        handleAccountContext(response.context.id, contentEl);

      } else if (page === 'home') {
        handleHomeContext(contentEl);

      } else {
        // "call", "top_level_xpage", or unknown — render raw for inspection
        contentEl.innerHTML =
          '<h2 class="section-heading">Overlay Context — ' + (page || 'unknown') + '</h2>' +
          '<div class="content-panel">' + renderRawResponse('getOverlayContext', response) + '</div>';
      }
    })
    .catch(function (error) {
      console.log('[Prompt Overlay] Rejected: getOverlayContext', error);
      var errorMessage = error ? (error.message || String(error)) : 'Unknown error';
      contentEl.innerHTML = '<p class="error">getOverlayContext failed: ' + errorMessage + '</p>';
    });

});

// ─── Context handlers ─────────────────────────────────────────────────────────

/**
 * "account" context — fetch name then render the account row with action buttons.
 * Account ID comes directly from getOverlayContext; no extra id lookup needed.
 */
function handleAccountContext(accountId, contentEl) {
  console.log('[Prompt Overlay] Account context — id:', accountId);

  ds.getDataForCurrentObject('account__v', 'name__v')
    .then(function (response) {
      console.log('[Prompt Overlay] Resolved: getDataForCurrentObject account__v name__v', response);
      var accountName = response.account__v.name__v;

      contentEl.innerHTML =
        '<h2 class="section-heading">Account</h2>' +
        '<div class="content-panel">' + renderAccountNameRow(accountName, accountId) + '</div>';

      // Delegated listener — survives any future innerHTML rewrites on contentEl.
      contentEl.addEventListener('click', function (e) {
        handleActionClick(e, '[Prompt Overlay]');
      });
    })
    .catch(function (error) {
      console.log('[Prompt Overlay] Rejected: getDataForCurrentObject account__v name__v', error);
      // Still render the buttons — we have the ID even without the name.
      contentEl.innerHTML =
        '<h2 class="section-heading">Account</h2>' +
        '<div class="content-panel">' + renderAccountNameRow(accountId, accountId) + '</div>';

      contentEl.addEventListener('click', function (e) {
        handleActionClick(e, '[Prompt Overlay]');
      });
    });
}

/**
 * "home" (Territory) context — query accounts and render each with action buttons.
 */
function handleHomeContext(contentEl) {
  console.log('[Prompt Overlay] Home context — querying accounts');

  contentEl.innerHTML = '<h2 class="section-heading">Accounts</h2><div id="accounts-list"><p class="loading">Loading accounts...</p></div>';

  var accountsEl = document.getElementById('accounts-list');

  ds.queryRecord({
    object: 'account__v',
    fields: ['id', 'name__v'],
    where:  '',
    limit:  5
  })
  .then(function (response) {
    console.log('[Prompt Overlay] Resolved: queryRecord account__v', response);

    var records = response.account__v;

    if (!records || records.length === 0) {
      accountsEl.innerHTML = '<p class="no-results">No accounts found.</p>';
      return;
    }

    accountsEl.innerHTML = records.map(function (account) {
      return renderAccountRow(account);
    }).join('');

    // Delegated listener on the stable accounts container.
    accountsEl.addEventListener('click', function (e) {
      handleActionClick(e, '[Prompt Overlay]');
    });
  })
  .catch(function (error) {
    console.log('[Prompt Overlay] Rejected: queryRecord account__v', error);
    var errorMessage = error ? (error.message || String(error)) : 'Unknown error';
    accountsEl.innerHTML = '<p class="error">Error fetching accounts: ' + errorMessage + '</p>';
  });
}

// ─── Action button handler ────────────────────────────────────────────────────

/**
 * Handles clicks on delegated account action buttons.
 * Shared by both account and home context branches.
 */
function handleActionClick(e, prefix) {
  // Account name tap — navigate to account record
  var nameEl = e.target.closest('.account-name-link');
  if (nameEl) {
    var accountId = nameEl.getAttribute('data-account-id');
    console.log('[Prompt Overlay] Firing: viewRecord account__v', accountId);
    ds.viewRecord({
      object: 'account__v',
      fields: { id: accountId },
      target: [{ id: 'V8P000000008001' }]
    })
    .then(function (response) {
      console.log('[Prompt Overlay] viewRecord resolved:', response);
    })
    .catch(function (error) {
      console.log('[Prompt Overlay] viewRecord rejected:', error);
    });
    return;
  }

  var btn = e.target.closest('button.account-action');
  if (!btn) return;
  var accountId = btn.getAttribute('data-account-id');

  if (btn.classList.contains('account-action--phone')) {
    console.log(prefix + ' Firing: newRecord call2__v for account:', accountId);
    ds.newRecord({
      object: 'call2__v',
      fields: { account__v: accountId }
    })
    .then(function (response) {
      console.log(prefix + ' newRecord call2__v resolved:', response);
    })
    .catch(function (error) {
      console.log(prefix + ' newRecord call2__v rejected:', error);
    });

  } else if (btn.classList.contains('account-action--email')) {
    console.log(prefix + ' Firing: newRecord sent_email__v for account:', accountId);
    ds.newRecord({
      object: 'sent_email__v',
      fields: { account__v: accountId }
    })
    .then(function (response) {
      console.log(prefix + ' newRecord sent_email__v resolved:', response);
    })
    .catch(function (error) {
      console.log(prefix + ' newRecord sent_email__v rejected:', error);
    });

  } else if (btn.classList.contains('account-action--media')) {
    console.log(prefix + ' Firing: launchMediaForAccount', accountId, 'Natevba_main', 'NVA_UK_0001.zip');
    ds.launchMediaForAccount(accountId, 'Natevba_main', 'NVA_UK_0001.zip')
    .then(function (response) {
      console.log(prefix + ' launchMediaForAccount resolved:', response);
    })
    .catch(function (error) {
      console.log(prefix + ' launchMediaForAccount rejected:', error);
    });

  } else if (btn.classList.contains('account-action--schedule')) {
    console.log(prefix + ' Firing: sendToMySchedule for account:', accountId);
    ds.sendToMySchedule({ accountIds: [accountId] })
    .then(function (response) {
      console.log(prefix + ' sendToMySchedule resolved:', response);
    })
    .catch(function (error) {
      console.log(prefix + ' sendToMySchedule rejected:', error);
    });
  }
}

// ─── Render helpers ───────────────────────────────────────────────────────────

/**
 * Detects the current platform and renders a fixed badge in the top-right corner.
 * Also sets body.platform-ipad for CSS-driven feature visibility.
 * Detection logic mirrors what the X-Pages library uses internally.
 */
function renderPlatformBadge() {
  var platform;
  var modifier;

  if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.myInsightsAPI) {
    platform = 'iPad';
    modifier = 'platform-badge--ipad';
    document.body.classList.add('platform-ipad');
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
 * Renders the account name row with four action buttons (Call, Email, Media, Schedule).
 * Used in the "account" context branch.
 * @param {string} accountName
 * @param {string} accountId
 * @returns {string} HTML string
 */
function renderAccountNameRow(accountName, accountId) {
  return (
    '<div class="data-row account-name-row">' +
      '<span class="data-label">Account Name</span>' +
      '<span class="data-value account-name-with-actions">' +
        '<span class="account-name-text">' + accountName + '</span>' +
        '<div class="account-actions">' +
          '<button class="account-action account-action--phone" data-account-id="' + accountId + '" title="Call">' +
            '<img src="assets/icons/phone.svg" alt="Call" width="16" height="16" />' +
          '</button>' +
          '<button class="account-action account-action--email" data-account-id="' + accountId + '" title="Email">' +
            '<img src="assets/icons/email.svg" alt="Email" width="16" height="16" />' +
          '</button>' +
          '<button class="account-action account-action--media" data-account-id="' + accountId + '" title="Launch Media">' +
            '<img src="assets/icons/media.svg" alt="Launch Media" width="16" height="16" />' +
          '</button>' +
          '<button class="account-action account-action--schedule" data-account-id="' + accountId + '" title="Send to My Schedule">' +
            '<img src="assets/icons/schedule.svg" alt="Send to My Schedule" width="16" height="16" />' +
          '</button>' +
        '</div>' +
      '</span>' +
    '</div>'
  );
}

/**
 * Renders a single account row with four action buttons.
 * Used in the "home" context branch.
 * @param {Object} account - record object from queryRecord response
 * @returns {string} HTML string
 */
function renderAccountRow(account) {
  var id   = account.id       || '';
  var name = account.name__v  || '—';
  return (
    '<div class="account-row">' +
      '<span class="account-name account-name-link" data-account-id="' + id + '" role="button" tabindex="0">' + name + '</span>' +
      '<div class="account-actions">' +
        '<button class="account-action account-action--phone" data-account-id="' + id + '" title="Call">' +
          '<img src="assets/icons/phone.svg" alt="Call" width="16" height="16" />' +
        '</button>' +
        '<button class="account-action account-action--email" data-account-id="' + id + '" title="Email">' +
          '<img src="assets/icons/email.svg" alt="Email" width="16" height="16" />' +
        '</button>' +
        '<button class="account-action account-action--media" data-account-id="' + id + '" title="Launch Media">' +
          '<img src="assets/icons/media.svg" alt="Launch Media" width="16" height="16" />' +
        '</button>' +
        '<button class="account-action account-action--schedule" data-account-id="' + id + '" title="Send to My Schedule">' +
          '<img src="assets/icons/schedule.svg" alt="Send to My Schedule" width="16" height="16" />' +
        '</button>' +
      '</div>' +
    '</div>'
  );
}

/**
 * Renders a raw response object as a labelled row, JSON-stringified.
 * Used for unrecognised context values — shows everything so nothing is missed.
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
