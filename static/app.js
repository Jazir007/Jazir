let deferredInstallPrompt;
window.addEventListener('beforeinstallprompt', event => { event.preventDefault(); deferredInstallPrompt = event; window.dispatchEvent(new Event('zedjer-install-ready')); });
document.addEventListener('DOMContentLoaded', () => {
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('/service-worker.js', {scope: '/'}).then(registration => {
    registration.update();
    navigator.serviceWorker.getRegistrations().then(registrations => registrations.filter(item => item.scope.endsWith('/static/')).forEach(item => item.unregister()));
  }).catch(() => {});
  if (location.pathname === '/analysis') {
    document.body.classList.add('dashboard-view');
    document.querySelectorAll('.cards > article').forEach((card, index) => {
      card.classList.add('metric-card');
      const caption = document.createElement('small');
      caption.textContent = index === 3 ? 'Cash movement in selected period' : 'Selected period';
      card.append(caption);
    });
  }
  if (location.pathname === '/banking/import') {
    const note = document.querySelector('.panel .hint');
    if (note) note.textContent = 'Required columns: Date, Description, Deposits, Withdrawals. Reference is optional. Amounts must be in the selected ledger’s base currency.';
  }
  const companyName = document.querySelector('.company-heading strong');
  if (companyName) {
    companyName.classList.add('company-dashboard-link'); companyName.setAttribute('role', 'link'); companyName.tabIndex = 0;
    const openDashboard = () => { if (location.pathname !== '/analysis') location.href = '/analysis'; };
    companyName.addEventListener('click', openDashboard);
    companyName.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openDashboard(); } });
  }
  const applyTheme = dark => {
    document.body.classList.toggle('dark-mode', dark);
    if (window.Chart) {
      Chart.defaults.color = dark ? '#c4dce4' : '#617783';
      Chart.defaults.borderColor = dark ? 'rgba(132,181,194,.24)' : 'rgba(97,119,131,.16)';
      Object.values(Chart.instances || {}).forEach(chart => { chart.options.color = Chart.defaults.color; chart.update(); });
    }
  };
  applyTheme(localStorage.getItem('zedjer-theme') === 'dark');
  const pageHeader = document.querySelector('main > header');
  if (pageHeader && !pageHeader.querySelector('.user-tools')) {
    const tools = document.createElement('div'); tools.className = 'user-tools';
    const install = document.createElement('button'); install.type = 'button'; install.className = 'install-app-button'; install.hidden = !deferredInstallPrompt; install.textContent = 'Install app'; install.setAttribute('aria-label', 'Install Zedjer app');
    const showInstall = () => { install.hidden = !deferredInstallPrompt; };
    window.addEventListener('zedjer-install-ready', showInstall);
    install.addEventListener('click', async () => { if (!deferredInstallPrompt) return; deferredInstallPrompt.prompt(); await deferredInstallPrompt.userChoice; deferredInstallPrompt = null; showInstall(); });
    const theme = document.createElement('button'); theme.type = 'button'; theme.className = 'theme-toggle'; theme.setAttribute('aria-label', 'Toggle dark mode');
    const updateThemeIcon = () => { theme.textContent = document.body.classList.contains('dark-mode') ? '☀' : '☾'; };
    const completeThemeChange = dark => { applyTheme(dark); localStorage.setItem('zedjer-theme', dark ? 'dark' : 'light'); updateThemeIcon(); };
    const themeTransitionStyle = document.createElement('style');
    themeTransitionStyle.textContent = `
      html{--theme-origin-x:50vw;--theme-origin-y:50vh}
      body:not(.dark-mode).dashboard-view .dashboard-metrics .metric-card:first-child:before{background:#dff3f6!important;color:#007b9a!important}
      body:not(.dark-mode).dashboard-view .dashboard-metrics .metric-card:first-child small{background:#dff2ee!important;color:#18795c!important}
      body:not(.dark-mode).dashboard-view .dashboard-metrics .metric-card:first-child.selected:before{background:rgba(255,255,255,.16)!important;color:#fff!important}
      body:not(.dark-mode).dashboard-view .dashboard-metrics .metric-card:first-child.selected small{background:rgba(222,255,241,.22)!important;color:#e8fff7!important}
      ::view-transition-old(root),::view-transition-new(root){animation-duration:.58s;animation-timing-function:cubic-bezier(.22,.8,.25,1)}
      ::view-transition-old(root){animation-name:themeFadeOut}
      ::view-transition-new(root){animation-name:themeLiquidReveal;clip-path:circle(0 at var(--theme-origin-x) var(--theme-origin-y))}
      .theme-toggle{overflow:hidden;position:relative;border:1px solid rgba(255,255,255,.62)!important;background:linear-gradient(135deg,rgba(255,255,255,.64),rgba(210,249,250,.3))!important;backdrop-filter:blur(13px) saturate(1.35);-webkit-backdrop-filter:blur(13px) saturate(1.35);box-shadow:inset 0 1px 1px rgba(255,255,255,.75),inset 0 -1px 5px rgba(11,83,105,.08),0 7px 18px rgba(14,79,104,.14)!important;transition:transform .22s ease,box-shadow .22s ease,background .28s ease}
      .dark-mode .theme-toggle{background:linear-gradient(135deg,rgba(80,147,187,.4),rgba(15,88,114,.34))!important;border-color:rgba(177,238,255,.28)!important;box-shadow:inset 0 1px 1px rgba(226,255,255,.18),inset 0 -1px 6px rgba(0,16,40,.22),0 8px 20px rgba(0,0,0,.28)!important}
      .theme-toggle:hover{transform:translateY(-2px) scale(1.05);box-shadow:inset 0 1px 1px rgba(255,255,255,.78),0 11px 23px rgba(13,84,110,.2)!important}
      .user-control{position:relative}.user-chip{cursor:pointer;border:0;font:inherit;text-align:left}.user-control-menu{position:absolute;top:calc(100% + 9px);right:0;z-index:70;display:grid;min-width:188px;padding:7px;border:1px solid rgba(186,218,229,.84);border-radius:14px;background:rgba(252,255,255,.9);box-shadow:0 14px 30px rgba(12,73,94,.16);backdrop-filter:blur(14px);opacity:0;visibility:hidden;transform:translateY(-7px) scale(.97);transition:opacity .18s ease,transform .18s ease,visibility .18s}.user-control.open .user-control-menu{opacity:1;visibility:visible;transform:none}.user-control-menu form{margin:0}.user-control-menu button,.user-control-menu a{display:block;width:100%;padding:10px 11px;border:0;border-radius:9px;background:transparent;color:#24505f;font:700 12px inherit;text-align:left;text-decoration:none;cursor:pointer}.user-control-menu button:hover,.user-control-menu a:hover{background:#e8f6f8;color:#087b9b}.dark-mode .user-control-menu{border-color:#315765;background:rgba(16,43,57,.94)}.dark-mode .user-control-menu button,.dark-mode .user-control-menu a{color:#d9f2f6}.dark-mode .user-control-menu button:hover,.dark-mode .user-control-menu a:hover{background:#1b5260;color:#a7f1ed}
      @media(max-width:900px){
        aside{display:flex!important;flex-direction:column!important;align-items:stretch!important;height:100vh!important;padding:28px 18px!important}
        aside .brand{display:flex!important;align-items:center!important;white-space:nowrap!important;padding:0 10px 25px!important}
        aside .company-switch{width:auto!important;margin:0 10px 20px!important}
        aside nav{display:grid!important;grid-template-columns:1fr!important;width:100%!important;margin:0!important;gap:7px!important}
        aside nav a{display:flex!important;align-items:center!important;justify-content:flex-start!important;min-width:0!important;white-space:nowrap!important;text-align:left!important}
        aside .company-meta{margin-top:auto!important}
      }
      .theme-toggle:after{content:'';position:absolute;inset:50%;width:8px;height:8px;border:1px solid currentColor;border-radius:50%;opacity:0;transform:translate(-50%,-50%) scale(.2);pointer-events:none}
      .theme-toggle.is-switching{transform:scale(.88) rotate(18deg);box-shadow:0 0 0 7px rgba(118,220,232,.15),0 8px 22px rgba(0,63,91,.22)!important}
      .theme-toggle.is-switching:after{animation:themeButtonRipple .46s ease-out both}
      @keyframes themeLiquidReveal{to{clip-path:circle(150vmax at var(--theme-origin-x) var(--theme-origin-y))}}
      @keyframes themeFadeOut{to{opacity:.52;filter:saturate(.86) blur(.4px)}}
      @keyframes themeButtonRipple{0%{opacity:.9;transform:translate(-50%,-50%) scale(.2)}100%{opacity:0;transform:translate(-50%,-50%) scale(9)}}
      @media(prefers-reduced-motion:reduce){::view-transition-old(root),::view-transition-new(root){animation:none}.theme-toggle.is-switching{transform:none}}
    `;
    document.head.append(themeTransitionStyle);
    theme.addEventListener('click', () => {
      const dark = !document.body.classList.contains('dark-mode');
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const bounds = theme.getBoundingClientRect();
      document.documentElement.style.setProperty('--theme-origin-x', `${bounds.left + bounds.width / 2}px`);
      document.documentElement.style.setProperty('--theme-origin-y', `${bounds.top + bounds.height / 2}px`);
      theme.classList.add('is-switching');
      const finish = () => theme.classList.remove('is-switching');
      if (!document.startViewTransition || reducedMotion) { completeThemeChange(dark); window.setTimeout(finish, 260); return; }
      document.startViewTransition(() => completeThemeChange(dark)).finished.finally(finish);
    });
    tools.append(install, theme); pageHeader.append(tools); updateThemeIcon();
    // Keep page-level import actions beside the account controls, before theme
    // and user details, without moving any upload forms themselves.
    [...pageHeader.querySelectorAll('a')].filter(link => /\bimport\b/i.test(link.textContent)).forEach(link => {
      link.classList.add('header-import-action'); tools.insertBefore(link, theme);
    });
    fetch('/current-user.json').then(response => response.ok ? response.json() : null).then(user => {
      if (!user) return;
      const control = document.createElement('div'); control.className = 'user-control';
      const chip = document.createElement('button'); chip.type = 'button'; chip.className = 'user-chip'; chip.setAttribute('aria-expanded', 'false');
      const initial = String(user.name || 'U').trim().charAt(0).toUpperCase();
      chip.innerHTML = `<span>${initial}</span><div><b>${user.name}</b><small>${user.role}</small></div>`;
      const menu = document.createElement('div'); menu.className = 'user-control-menu';
      menu.innerHTML = `${user.has_active_company ? '<form method="post" action="/company/logout"><button type="submit">Log out of company</button></form>' : ''}<a href="/logout">Log out of ERP</a>`;
      chip.addEventListener('click', event => { event.stopPropagation(); const open = control.classList.toggle('open'); chip.setAttribute('aria-expanded', String(open)); });
      document.addEventListener('click', () => { control.classList.remove('open'); chip.setAttribute('aria-expanded', 'false'); });
      control.append(chip, menu); tools.append(control);
      if (user.is_admin) {
        const nav = document.querySelector('aside nav');
        if (nav && !nav.querySelector('[href="/admin/users"]')) {
          const adminLink = document.createElement('a'); adminLink.href = '/admin/users'; adminLink.textContent = 'Administrator Desk';
          if (location.pathname === '/admin/users') adminLink.classList.add('active');
          nav.append(adminLink);
        }
      }
    }).catch(() => {});
  }
  // The navigation is intentionally created here so it stays available on every
  // page without duplicating controls in individual templates.
  const sidebar = document.querySelector('aside');
  if (sidebar) {
    sidebar.querySelectorAll('nav a').forEach(link => {
      if (new URL(link.href, location.origin).pathname === location.pathname) link.classList.add('active');
      if (new URL(link.href, location.origin).pathname === '/accounts') link.textContent = 'Chart of Accounts';
    });
    const chartLink = [...sidebar.querySelectorAll('nav a')].find(link => new URL(link.href, location.origin).pathname === '/accounts');
    if (chartLink && !sidebar.querySelector('[href="/accounts-workspace"]')) {
      const accountsLink = document.createElement('a'); accountsLink.href = '/accounts-workspace'; accountsLink.textContent = 'Accounts Book';
      if (location.pathname === '/accounts-workspace') accountsLink.classList.add('active');
      chartLink.after(accountsLink);
    }
    const menuButton = document.createElement('button');
    menuButton.type = 'button'; menuButton.className = 'menu-toggle';
    menuButton.setAttribute('aria-label', 'Open navigation menu'); menuButton.setAttribute('aria-expanded', 'false');
    menuButton.innerHTML = '<i></i><i></i><i></i>';
    const overlay = document.createElement('div'); overlay.className = 'menu-overlay'; overlay.setAttribute('aria-hidden', 'true');
    document.body.insertBefore(menuButton, sidebar); document.body.append(overlay);
    const setMenu = open => {
      document.body.classList.toggle('menu-open', open);
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    };
    menuButton.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
    overlay.addEventListener('click', () => setMenu(false));
    document.addEventListener('keydown', event => { if (event.key === 'Escape') setMenu(false); });
  }
  const nextOutstanding = [...document.querySelectorAll('.loan-analysis table tbody tr')].find(row => row.lastElementChild?.textContent.trim() === 'Upcoming');
  if (nextOutstanding) {
    nextOutstanding.classList.add('next-outstanding');
    const installment = nextOutstanding.firstElementChild?.textContent.trim();
    const chart = window.Chart?.getChart(document.getElementById('loan-chart'));
    const chartIndex = chart?.data.labels.findIndex(label => String(label) === installment);
    if (chart && chartIndex > 0) {
      chart.data.datasets[0].backgroundColor = chart.data.datasets[0].data.map((_, index) => index === chartIndex ? '#00a99d' : '#287c9a');
      chart.data.datasets[1].backgroundColor = chart.data.datasets[1].data.map((_, index) => index === chartIndex ? '#8cf0e5' : '#f0a14a');
      chart.data.datasets[2].pointRadius = chart.data.datasets[2].data.map((_, index) => index === chartIndex ? 8 : 4);
      chart.update();
    }
  }
  if (location.pathname === '/accounts') {
    document.querySelectorAll('.account-group .edit-link').forEach(edit => {
      const accountId = edit.href.match(/\/accounts\/(\d+)\/edit/)?.[1]; if (!accountId || edit.parentElement.querySelector('.account-delete-form')) return;
      const form = document.createElement('form'); form.className = 'inline account-delete-form'; form.method = 'post'; form.action = `/accounts/${accountId}/delete`;
      form.innerHTML = '<button class="danger-link" type="submit">Delete</button>';
      form.addEventListener('submit', event => { if (!window.confirm('Delete this account? Accounts with transactions cannot be deleted.')) event.preventDefault(); });
      edit.after(form);
    });
  }
  if (location.pathname === '/reports/trial-balance') {
    const openingTb = document.querySelector('a[href="/reports/opening-balances"]');
    if (openingTb) openingTb.textContent = 'Opening TB';
  }
  document.querySelectorAll('.dashboard-metrics [data-drill]').forEach(card => card.addEventListener('click', () => {
    document.querySelectorAll('.dashboard-metrics [data-drill]').forEach(item => item.classList.toggle('selected', item === card));
  }));
  const lines = document.querySelector('#lines');
  const template = document.querySelector('#line-template');
  document.querySelector('#add-line')?.addEventListener('click', () => lines.insertAdjacentHTML('beforeend', template.innerHTML));
  lines?.addEventListener('click', event => { if (event.target.classList.contains('remove') && lines.children.length > 2) event.target.closest('.line').remove(); });
  const groupButton = document.querySelector('#toggle-account-groups');
  groupButton?.addEventListener('click', () => { const groups = [...document.querySelectorAll('.account-group')]; const shouldExpand = groups.some(group => !group.open); groups.forEach(group => { group.open = shouldExpand; }); groupButton.textContent = shouldExpand ? 'Collapse all' : 'Expand all'; });
  const reportCurrency = document.querySelector('.report-currency [name="currency"], .control [name="currency"]');
  const reportRate = document.querySelector('.report-currency [name="report_rate"], .control [name="report_rate"]');
  document.querySelectorAll('main form[method="get"]:not(.report-currency)').forEach(form => form.addEventListener('submit', () => {
    if (!reportCurrency || form.querySelector('[name="currency"]')) return;
    for (const [name, value] of [['currency', reportCurrency.value], ['report_rate', reportRate.value]]) { const input = document.createElement('input'); input.type = 'hidden'; input.name = name; input.value = value; form.append(input); }
  }));
  document.querySelectorAll('.export-links a').forEach(link => { if (!reportCurrency) return; const url = new URL(link.href); url.searchParams.set('currency', reportCurrency.value); url.searchParams.set('report_rate', reportRate.value); link.href = url.toString(); });
  const availableCurrencies = window.ledgerCurrencies || [];
  if (reportCurrency && reportRate) {
    const setReportRate = () => {
      const currency = availableCurrencies.find(item => item.code === reportCurrency.value);
      reportRate.value = !currency || currency.rate === 1 ? 1 : (1 / Number(currency.rate)).toFixed(6);
    };
    reportCurrency.addEventListener('change', setReportRate);
    if (!reportRate.value || reportRate.value === '1') setReportRate();
  }
  const newCompanyBaseCurrency = document.querySelector('input[name="base_currency"]');
  if (newCompanyBaseCurrency && !availableCurrencies.length) newCompanyBaseCurrency.value = 'INR';
  document.querySelectorAll('.account-opening-form input[name="default_currency"]').forEach(input => {
    if (!input.closest('form').querySelector('input[name="code"]').value) input.value = 'INR';
  });
  document.querySelectorAll('input[name="currency[]"], input[name="default_currency"], input[name="base_currency"]').forEach(input => {
    if (!availableCurrencies.length) return;
    const selectedCode = input.value.toUpperCase(); const select = document.createElement('select'); select.name = input.name;
    availableCurrencies.forEach(item => { const option = document.createElement('option'); option.value = item.code; option.textContent = `${item.code} · ${item.name}`; option.selected = item.code === selectedCode; select.append(option); });
    select.addEventListener('change', () => { const line = select.closest('.line'); const selected = availableCurrencies.find(item => item.code === select.value); if (line && selected) line.querySelector('input[name="fx_rate[]"]').value = selected.rate; });
    input.replaceWith(select);
  });
  document.querySelectorAll('.account-opening-form select[name="default_currency"]').forEach(select => {
    const setRate = () => { const item = availableCurrencies.find(currency => currency.code === select.value); const rate = select.closest('form').querySelector('input[name="exchange_rate"]'); if (item && rate) rate.value = item.rate; };
    select.addEventListener('change', setRate); setRate();
  });
  document.querySelectorAll('.account-opening-form').forEach(form => {
    if (form.querySelector('input[name="is_cash"]')) return;
    const fields = document.createElement('span');
    fields.innerHTML = '<label class="check"><input type="checkbox" name="is_cash">Cash / bank / card ledger</label><label>Cash type<select name="cash_type"><option value="Bank">Bank</option><option value="Cash">Cash</option><option value="Card">Card</option></select></label>';
    form.querySelector('button.primary')?.before(fields);
  });
  document.querySelectorAll('.account-opening-form').forEach(form => {
    const cashLedger = form.querySelector('input[name="is_cash"]');
    const cashType = form.querySelector('select[name="cash_type"]')?.closest('label');
    if (!cashLedger || !cashType) return;
    const toggleCashType = () => { cashType.hidden = !cashLedger.checked; };
    cashLedger.addEventListener('change', toggleCashType); toggleCashType();
  });
  document.querySelectorAll('.account-opening-form').forEach(form => {
    if (form.querySelector('[name="is_loan"]')) return;
    const category = form.querySelector('select[name="category"]'); if (!category) return;
    const field = document.createElement('label'); field.className = 'check loan-account-field';
    field.innerHTML = '<input type="checkbox" name="is_loan">Loan & interest calculation';
    form.querySelector('button.primary')?.before(field);
    const existing = location.pathname.match(/^\/accounts\/(\d+)\/edit$/);
    if (existing) fetch(`/accounts/${existing[1]}/loan.json`).then(r => r.ok ? r.json() : null).then(data => { if (data) field.querySelector('input').checked = !!data.is_loan; });
    const toggle = () => { field.hidden = category.value !== 'Liability'; if (field.hidden) field.querySelector('input').checked = false; };
    category.addEventListener('change', toggle); toggle();
  });
  fetch('/transaction-dimensions.json').then(response => response.ok ? response.json() : {categories: []}).then(async ({categories}) => {
    if (!categories?.length) return;
    for (const form of document.querySelectorAll('.account-opening-form')) {
      if (form.querySelector('[name="analysis_category_ids[]"]')) continue;
      const field = document.createElement('label'); field.textContent = 'Analysis categories';
      const select = document.createElement('select'); select.name = 'analysis_category_ids[]'; select.multiple = true; select.size = Math.min(categories.length, 4);
      categories.forEach(category => select.add(new Option(category.name, category.id))); field.append(select); form.querySelector('button.primary')?.before(field);
      const matched = location.pathname.match(/^\/accounts\/(\d+)\/edit$/);
      if (matched) { const saved = await fetch(`/accounts/${matched[1]}/analysis-categories.json`).then(r => r.json()); [...select.options].forEach(option => option.selected = saved.category_ids.includes(Number(option.value))); }
    }
  }).catch(() => {});
  const documentNumber = document.querySelector('input[name="document_no"]');
  const documentType = document.querySelector('select[name="document_type"]');
  if (documentNumber && documentType && !documentNumber.closest('.transaction-edit-form')) {
    const applySeries = series => { if (!series) return; documentNumber.value = series.suggested; documentNumber.readOnly = series.mode === 'automatic'; };
    const setDocumentNumber = () => { const series = window.documentSeries?.[documentType.value]; if (series) applySeries(series); else fetch(`/document-series/${encodeURIComponent(documentType.value)}`).then(response => response.ok ? response.json() : null).then(applySeries).catch(() => documentNumber.removeAttribute('readonly')); };
    documentType.addEventListener('change', setDocumentNumber); setDocumentNumber();
  } else if (documentNumber) documentNumber.removeAttribute('readonly');
  if (documentNumber && documentType && documentNumber.closest('.transaction-edit-form')) documentType.addEventListener('change', () => fetch(`/document-series/${encodeURIComponent(documentType.value)}`).then(response => response.ok ? response.json() : null).then(series => { if (series) { documentNumber.value = series.suggested; documentNumber.readOnly = series.mode === 'automatic'; } }));
document.querySelector('.brand')?.setAttribute('href', '/');

// Keep database dates sortable internally while presenting every visible date as DD-MM-YYYY.
const visibleDateWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
const visibleDateNodes = [];
while (visibleDateWalker.nextNode()) visibleDateNodes.push(visibleDateWalker.currentNode);
visibleDateNodes.forEach((node) => {
  const parent = node.parentElement;
  if (!parent || parent.closest('script,style,textarea,select,option')) return;
  node.nodeValue = node.nodeValue.replace(/\b(\d{4})-(\d{2})-(\d{2})\b/g, (_, year, month, day) => `${day}-${month}-${year}`);
  node.nodeValue = node.nodeValue.replace(/\bMemo\b/g, 'Narration');
});
  if (document.querySelector('nav') && document.querySelector('.company-meta')) { const logout = document.createElement('a'); logout.href = '/logout'; logout.textContent = 'Log out'; document.querySelector('nav').append(logout); }
  document.querySelectorAll('select[name="document_type"]').forEach(typeSelect => {
    const formGrid = typeSelect.closest('form')?.querySelector('.form-grid');
    if (!formGrid || formGrid.querySelector('[name="payment_mode"]')) return;
    const field = document.createElement('label'); field.className = 'payment-mode-field';
    field.innerHTML = 'Payment / receipt mode<select name="payment_mode"><option value="">Choose mode</option><option>Cash</option><option>Bank</option><option>Card</option><option>Other</option></select>';
    formGrid.append(field);
    const toggle = () => { field.hidden = !['Payments', 'Receipts'].includes(typeSelect.value); };
    typeSelect.addEventListener('change', toggle); toggle();
    if (!formGrid.querySelector('[name="party"]')) {
      const party = document.createElement('label');
      party.innerHTML = 'Party<input name="party" placeholder="Customer, supplier, employee or other party">';
      formGrid.append(party);
      const edited = location.pathname.match(/^\/transactions\/(\d+)\/edit$/);
      if (edited) fetch(`/transactions/${edited[1]}/dimensions.json`).then(response => response.json()).then(entry => { party.querySelector('input').value = entry.party || ''; field.querySelector('select').value = entry.payment_mode || ''; });
    }
  });
  const transactionDetail = location.pathname.match(/^\/transactions\/(\d+)$/);
  if (transactionDetail) fetch(`/transactions/${transactionDetail[1]}/dimensions.json`).then(response => response.ok ? response.json() : null).then(entry => {
    if (!entry?.payment_mode) return;
    const grid = document.querySelector('.panel .form-grid');
    if (!grid || grid.querySelector('.payment-mode-detail')) return;
    const mode = document.createElement('div'); mode.className = 'payment-mode-detail';
    mode.innerHTML = `<span class="hint">Payment / receipt mode</span><p>${entry.payment_mode}</p>`;
    grid.append(mode);
  });
  fetch('/transaction-dimensions.json').then(r => r.ok ? r.json() : null).then(data => {
    if (!data) return;
    const dashboardForm = document.querySelector('.control form');
    const breakdownPanel = document.querySelector('#analysis-tag-chart')?.closest('.panel');
    if (breakdownPanel && data.categories?.length && !breakdownPanel.querySelector('[name="analysis_category_ids"]')) {
      const category = document.createElement('label'); category.textContent = 'Analysis categories';
      const select = document.createElement('select'); select.name = 'analysis_category_ids'; select.multiple = true; select.size = Math.min(data.categories.length, 4);
      const selected = new URLSearchParams(location.search).getAll('analysis_category_ids');
      // On first opening the dashboard, show every category.  A deliberately
      // cleared selection remains empty so the user can blank the chart.
      const selectAllByDefault = !location.search.includes('analysis_category_ids');
      data.categories.forEach(item => select.add(new Option(item.name, item.id, false, selectAllByDefault || selected.includes(String(item.id))))); category.append(select);
      const apply = document.createElement('button'); apply.type = 'button'; apply.className = 'secondary'; apply.textContent = 'Apply categories';
      apply.addEventListener('click', () => {
        const chart = window.Chart?.getChart(document.querySelector('#analysis-tag-chart')); if (!chart) return;
        const allLabels = JSON.parse(document.querySelector('#analysis-tag-chart').dataset.labels || '[]');
        const allValues = JSON.parse(document.querySelector('#analysis-tag-chart').dataset.values || '[]');
        const names = [...select.selectedOptions].map(option => option.text);
        const visible = allLabels.map((label, index) => ({label, value: allValues[index]})).filter(item => names.length && names.some(name => item.label.startsWith(`${name} ·`) || item.label.startsWith(`${name} Â·`)));
        chart.data.labels = visible.map(item => item.label.replace(/^.*?[·] ?/, ''));
        chart.data.datasets[0].data = visible.map(item => item.value); chart.update();
      });
      const controls = document.createElement('div'); controls.className = 'actions'; controls.append(category, apply); breakdownPanel.querySelector('canvas')?.before(controls);
    }
    if (dashboardForm && data.regions_enabled && !dashboardForm.querySelector('[name="region_tag_id"]')) {
      const region = document.createElement('label'); region.textContent = 'Region';
      const select = document.createElement('select'); select.name = 'region_tag_id'; select.add(new Option('All regions', ''));
      const selected = new URLSearchParams(location.search).get('region_tag_id') || '';
      data.regions.forEach(item => select.add(new Option(item.name, item.id, false, selected === String(item.id)))); region.append(select); dashboardForm.append(region);
    }
    const dashboardTag = document.querySelector('form select[name="tag_id"]');
    if (dashboardTag) {
      dashboardTag.name = 'region_tag_id';
      dashboardTag.closest('label').firstChild.nodeValue = 'Region ';
      dashboardTag.replaceChildren(new Option('All regions', ''));
      data.regions.forEach(item => dashboardTag.add(new Option(item.name, item.id)));
    }
    document.querySelectorAll('select[name="document_type"]').forEach(typeSelect => {
      const grid = typeSelect.closest('form')?.querySelector('.form-grid'); if (!grid) return;
      if (data.regions_enabled && !grid.querySelector('[name="region_tag_id"]')) {
        const region = document.createElement('label'); region.innerHTML = 'Region<select name="region_tag_id"><option value="">No region</option></select>';
        const regionSelect = region.querySelector('select');
        data.regions.forEach(item => regionSelect.add(new Option(item.name, item.id))); grid.append(region);
        const edited = location.pathname.match(/^\/transactions\/(\d+)\/edit$/);
        if (edited) fetch(`/transactions/${edited[1]}/dimensions.json`).then(response => response.ok ? response.json() : null).then(entry => { if (entry?.region_tag_id) regionSelect.value = String(entry.region_tag_id); });
      }
    });
  }).catch(() => {});
  const addLedgerSearch = root => root.querySelectorAll('select[name="account_id[]"]').forEach(select => {
    if (select.parentElement?.querySelector('.ledger-search')) return;
    const search = document.createElement('input'); search.type = 'search'; search.className = 'ledger-search'; search.placeholder = 'Type ledger name'; search.autocomplete = 'off'; select.style.display = 'none';
    const ledgerName = value => (value || '').replace(/^\s*[A-Za-z0-9]+(?:-\d+)?\s*(?:·|-)\s+/, '');
    if (select.value) search.value = ledgerName(select.selectedOptions[0]?.text);
    const list = document.createElement('datalist'); list.id = `ledger-options-${Math.random().toString(36).slice(2)}`;
    [...select.options].filter(option => option.value).forEach(option => list.append(new Option(ledgerName(option.text), ledgerName(option.text))));
    search.setAttribute('list', list.id); select.before(list);
    search.addEventListener('input', () => { if (!search.value.trim()) { select.value = ''; select.dispatchEvent(new Event('change')); } });
    search.addEventListener('change', () => { const match = [...select.options].find(option => ledgerName(option.text) === search.value); if (match) { select.value = match.value; select.dispatchEvent(new Event('change')); } });
    select.before(search);
    select.addEventListener('change', async () => {
      const line = select.closest('.line') || select.closest('tr'); if (!line) return;
      line.querySelector('.line-tag-field')?.remove();
      if (!select.value) return;
      const dimensions = await fetch('/transaction-dimensions.json').then(r => r.json());
      const saved = await fetch(`/accounts/${select.value}/tags.json`).then(r => r.json());
      const tags = dimensions.tags.filter(tag => saved.tag_ids.includes(Number(tag.id)));
      if (!tags.length) return;
      const field = document.createElement('label'); field.className = 'line-tag-field'; field.textContent = 'Analysis tag';
      const tagSelect = document.createElement('select'); tagSelect.name = 'accounting_tag_id[]'; tagSelect.add(new Option('No tag', ''));
      tags.forEach(tag => tagSelect.add(new Option(tag.name, tag.id))); field.append(tagSelect); line.append(field);
      const edited = location.pathname.match(/^\/transactions\/(\d+)\/edit$/); if (edited) { const entry = await fetch(`/transactions/${edited[1]}/dimensions.json`).then(r => r.json()); tagSelect.value = entry.accounting_tag_id || ''; }
    });
    if (select.value) select.dispatchEvent(new Event('change'));
  });
  addLedgerSearch(document);
  document.querySelector('#add-line')?.addEventListener('click', () => setTimeout(() => addLedgerSearch(document), 0));
  document.querySelectorAll('#lines').forEach(lines => { const actions = lines.closest('form')?.querySelector('.actions'); if (actions && !actions.querySelector('[data-quick-account]')) { const button = document.createElement('button'); button.type = 'button'; button.className = 'secondary'; button.dataset.quickAccount = ''; button.textContent = '+ New chart account'; actions.prepend(button); } });
  document.querySelectorAll('[data-quick-account]').forEach(button => button.addEventListener('click', async () => {
    const code = window.prompt('New account code:'); if (!code) return;
    const name = window.prompt('New account name:'); if (!name) return;
    const category = window.prompt('Group: Asset, Liability, Equity, Income, or Expense', 'Expense'); if (!category) return;
    const data = new FormData(); data.append('code', code); data.append('name', name); data.append('category', category);
    try { const response = await fetch('/accounts/quick-add', {method: 'POST', body: data}); const account = await response.json(); if (!response.ok) throw new Error(account.error); document.querySelectorAll('select[name="account_id[]"]').forEach(select => select.add(new Option(account.name, account.id))); const firstEmpty = [...document.querySelectorAll('select[name="account_id[]"]')].find(select => !select.value); if (firstEmpty) firstEmpty.value = account.id; window.alert('New chart account added.'); } catch (error) { window.alert(error.message || 'Unable to add account.'); }
  }));
  document.querySelectorAll('.transaction-edit-form').forEach(form => form.addEventListener('submit', event => {
    const pin = window.prompt('Enter the 4-digit company PIN to save this transaction:');
    if (!pin || !/^\d{4}$/.test(pin)) { event.preventDefault(); window.alert('A valid 4-digit PIN is required to save changes.'); return; }
    form.querySelector('input[name="edit_pin"]').value = pin;
  }));
  document.querySelectorAll('.transaction-delete-form').forEach(form => form.addEventListener('submit', event => {
    if (!window.confirm('Delete this transaction? This cannot be undone.')) { event.preventDefault(); return; }
    const pin = window.prompt('Enter the 4-digit company PIN to delete this transaction:');
    if (!pin || !/^\d{4}$/.test(pin)) { event.preventDefault(); window.alert('A valid 4-digit PIN is required.'); return; }
    form.querySelector('input[name="edit_pin"]').value = pin;
  }));
  document.querySelectorAll('.transaction-bulk-delete-form').forEach(form => form.addEventListener('submit', event => {
    if (!form.querySelector('input[name="entry_ids"]:checked')) { event.preventDefault(); window.alert('Select at least one transaction.'); return; }
    if (!window.confirm('Delete all selected transactions? This cannot be undone.')) { event.preventDefault(); return; }
    const pin = window.prompt('Enter the 4-digit company PIN to delete selected transactions:');
    if (!pin || !/^\d{4}$/.test(pin)) { event.preventDefault(); window.alert('A valid 4-digit PIN is required.'); return; }
    form.querySelector('input[name="edit_pin"]').value = pin;
  }));
  document.querySelectorAll('.transaction-bulk-delete-form').forEach(form => {
    const button = form.querySelector('.selection-delete'); if (!button) return;
    const selectAll = form.querySelector('.selection-select-all');
    const refresh = () => {
      const selected = form.querySelector('input[name="entry_ids"]:checked'); button.hidden = !selected;
      if (selectAll) { selectAll.hidden = !selected; const boxes = [...form.querySelectorAll('input[name="entry_ids"]')]; selectAll.querySelector('input').checked = boxes.length > 0 && boxes.every(box => box.checked); }
    };
    form.addEventListener('change', refresh); refresh();
    selectAll?.querySelector('input').addEventListener('change', event => { form.querySelectorAll('input[name="entry_ids"]').forEach(box => { box.checked = event.target.checked; }); refresh(); });
  });
  document.querySelectorAll('[data-bank-tab]').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('[data-bank-tab]').forEach(item => item.classList.toggle('active', item === button));
    document.querySelectorAll('[data-bank-panel]').forEach(panel => panel.classList.toggle('active', panel.dataset.bankPanel === button.dataset.bankTab));
  }));
  const cashflowCanvas = document.querySelector('#cashflow-chart');
  const analysisCanvas = document.querySelector('#analysis-tag-chart');
  if (cashflowCanvas && analysisCanvas) {
    const cashflowChart = window.Chart?.getChart(cashflowCanvas);
    if (cashflowChart) { const values = cashflowChart.data.datasets[0].data; cashflowChart.data.datasets[0].backgroundColor = ['#1aa36f', '#f0a23a', Number(values[2]) < 0 ? '#c73745' : '#007b9a']; cashflowChart.update(); }
    const analysisPanel = analysisCanvas.closest('.panel'); const analysisGrid = cashflowCanvas.closest('.analysis-grid');
    if (analysisPanel && analysisGrid) { analysisPanel.classList.add('analysis-breakdown-panel'); analysisGrid.append(analysisPanel); setTimeout(() => { const chart = window.Chart?.getChart(analysisCanvas); chart?.resize(); chart?.update(); }, 0); }
  }
  if (location.hash === '#statement') document.querySelector('[data-bank-tab="statement"]')?.click();
  document.querySelectorAll('.manual-investment-form').forEach(form => {
    const quantity = form.querySelector('[name="quantity"]'); const rate = form.querySelector('[name="rate"]'); const total = form.querySelector('[name="total_amount"]');
    const updateTotal = () => { const value = Number(quantity.value) * Number(rate.value); if (Number.isFinite(value) && value > 0) total.value = value.toFixed(2); };
    quantity?.addEventListener('input', updateTotal); rate?.addEventListener('input', updateTotal);
  });
  if (!location.pathname.startsWith('/accounts')) {
    document.querySelectorAll('option, td, h2, .ledger-link').forEach((element) => {
      if (element.children.length) return;
      element.textContent = element.textContent.replace(/^\s*[A-Za-z0-9]+(?:-\d+)?\s*(?:·|-)\s+/, '');
    });
  }
});
