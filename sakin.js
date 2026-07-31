/**
 * APARTMAN YÖNETİM SİSTEMİ - SAKİN (VIEW-ONLY) JAVASCRIPT
 * Real-time updates via 'storage' event listener
 */

const STORAGE_KEY = 'cicek_apartmani_state_v2';

const MONTH_NAMES = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
];

const defaultState = {
  buildingTitle: 'Çiçek Apartmanı Yönetimi',
  monthlyDues: 0,
  currentYear: 2026,
  previousYearTransfer: 0,
  announcement: "",
  lastUpdated: "31.07.2026 14:15",
  extraCollections: [],
  apartments: [
    { id: 1, occupant: '', payments: {}, isExempt: false },
    { id: 2, occupant: '', payments: {}, isExempt: false },
    { id: 3, occupant: '', payments: {}, isExempt: false },
    { id: 4, occupant: '', payments: {}, isExempt: false },
    { id: 5, occupant: '', payments: {}, isExempt: false },
    { id: 6, occupant: '', payments: {}, isExempt: false },
    { id: 7, occupant: '', payments: {}, isExempt: false },
    { id: 8, occupant: '', payments: {}, isExempt: false },
    { id: 9, occupant: '', payments: {}, isExempt: false },
    { id: 10, occupant: '', payments: {}, isExempt: false },
    { id: 11, occupant: '', payments: {}, isExempt: false },
    { id: 12, occupant: '', payments: {}, isExempt: false },
    { id: 13, occupant: 'Yönetici', payments: { 1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true, 8: true, 9: true, 10: true, 11: true, 12: true }, isExempt: true },
    { id: 14, occupant: '', payments: {}, isExempt: false }
  ],
  expenses: [],
  pdfReports: []
};

let state = loadState();

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  initApp();
  setupEventListeners();
});

// Real-time synchronization when Admin updates data in another tab
window.addEventListener('storage', (e) => {
  if (e.key === STORAGE_KEY) {
    state = loadState();
    initApp();
  }
});

function parseDateTime(str) {
  if (!str) return new Date(0);
  const parts = str.split(' ');
  if (parts.length !== 2) return new Date(0);
  const dateParts = parts[0].split('.');
  const timeParts = parts[1].split(':');
  if (dateParts.length !== 3 || timeParts.length !== 2) return new Date(0);
  return new Date(
    parseInt(dateParts[2], 10),
    parseInt(dateParts[1], 10) - 1,
    parseInt(dateParts[0], 10),
    parseInt(timeParts[0], 10),
    parseInt(timeParts[1], 10)
  );
}

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const oldSaved = localStorage.getItem('apartman_yonetimi_state_v1');
    let loadedState;
    
    // Recovery check: did they have actual edits in the old database that are missing in the new one?
    let recoveredState = null;
    if (oldSaved) {
      const parsedOld = JSON.parse(oldSaved);
      const hasActualEdits = (parsedOld.pdfReports && parsedOld.pdfReports.length > 0) || 
                             (parsedOld.expenses && parsedOld.expenses.length > defaultState.expenses.length);
      
      if (hasActualEdits) {
        let needsRecovery = false;
        if (saved) {
          const parsedSaved = JSON.parse(saved);
          const newHasNoEdits = (!parsedSaved.pdfReports || parsedSaved.pdfReports.length === 0) &&
                                (!parsedSaved.expenses || parsedSaved.expenses.length <= defaultState.expenses.length);
          if (newHasNoEdits) {
            needsRecovery = true;
          }
        } else {
          needsRecovery = true;
        }
        
        if (needsRecovery) {
          recoveredState = { ...defaultState, ...parsedOld };
          const oldDate = parseDateTime(recoveredState.lastUpdated);
          const defDate = parseDateTime(defaultState.lastUpdated);
          if (defDate > oldDate) {
            recoveredState.lastUpdated = defaultState.lastUpdated;
          }
          localStorage.setItem(STORAGE_KEY, JSON.stringify(recoveredState));
        }
      }
    }

    if (recoveredState) {
      loadedState = recoveredState;
    } else if (saved) {
      const parsedSaved = JSON.parse(saved);
      const savedDate = parseDateTime(parsedSaved.lastUpdated);
      const defaultDate = parseDateTime(defaultState.lastUpdated);
      
      if (defaultDate > savedDate) {
        // Code has a newer update (e.g. static data synced via github)
        loadedState = JSON.parse(JSON.stringify(defaultState));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(loadedState));
      } else {
        loadedState = { ...defaultState, ...parsedSaved };
      }
      if (!loadedState.extraCollections) loadedState.extraCollections = [];
      if (!loadedState.pdfReports) loadedState.pdfReports = [];
      if (loadedState.announcement === undefined) loadedState.announcement = "";
    } else if (oldSaved) {
      const parsedOld = JSON.parse(oldSaved);
      const hasActualData = parsedOld.apartments && parsedOld.apartments[0] && parsedOld.apartments[0].occupant === 'Hülya KAPLAN';
      if (hasActualData) {
        loadedState = { ...defaultState, ...parsedOld };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(loadedState));
      } else {
        loadedState = JSON.parse(JSON.stringify(defaultState));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(loadedState));
      }
    } else {
      loadedState = JSON.parse(JSON.stringify(defaultState));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(loadedState));
    }
    
    // Manage Director Exemption logic
    const apt13 = loadedState.apartments?.find(a => a.id === 13);
    if (apt13) {
      apt13.isExempt = true;
      if (!apt13.occupant || apt13.occupant === 'Selin Polat') {
        apt13.occupant = 'Yönetici';
      }
      if (!apt13.payments) apt13.payments = {};
      for (let m = 1; m <= 12; m++) {
        apt13.payments[m] = true;
      }
    }
    return loadedState;
  } catch (e) {
    console.error('LocalStorage load error:', e);
  }
  return JSON.parse(JSON.stringify(defaultState));
}

function initApp() {
  const filter = document.getElementById('expenseMonthFilter');
  if (filter && !filter.dataset.initialized) {
    const currentMonthNum = new Date().getMonth() + 1;
    filter.value = String(currentMonthNum);
    filter.dataset.initialized = 'true';
  }

  updateHeaderInfo();
  renderDuesTable();
  renderGridViewCards();
  renderExpensesTable();
  renderExtraCollections();
  renderExtraCardsView();
  renderPdfReports();
  renderAnnouncement();
  updateLastUpdatedDisplay();

  // Load Theme
  const savedTheme = localStorage.getItem('theme') || 'light';
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
  } else {
    document.body.classList.remove('dark-theme');
  }
  updateThemeIcon();
}

function updateHeaderInfo() {
  document.getElementById('buildingTitleDisplay').innerText = state.buildingTitle;
  const duesDisplay = document.getElementById('monthlyDuesDisplay');
  if (duesDisplay) {
    duesDisplay.innerText = `${formatMoney(state.monthlyDues)} ₺`;
  }
}


function renderDuesTable() {
  const tbody = document.getElementById('duesTableBody');
  if (!tbody) return;
  tbody.innerHTML = '';

  const currentMonth = new Date().getMonth() + 1;

  state.apartments.forEach(apt => {
    let unpaidUpToCurrent = 0;
    const tr = document.createElement('tr');

    const tdApt = document.createElement('td');
    tdApt.className = 'sticky-col';
    tdApt.innerHTML = `
      <div>
        <strong>Daire ${apt.id} ${apt.isExempt ? '<span style="font-size:0.7rem; color:var(--primary); font-weight:700;">(Muaf)</span>' : ''}</strong>
        <span class="occupant-sub">${escapeHtml(apt.occupant || 'Sakin Belirtilmedi')}</span>
      </div>
    `;
    tr.appendChild(tdApt);

    for (let m = 1; m <= 12; m++) {
      const isPaid = apt.isExempt ? true : (apt.payments && apt.payments[m]);
      if (!isPaid && m <= currentMonth && !apt.isExempt) {
        unpaidUpToCurrent++;
      }

      const tdMonth = document.createElement('td');
      const badge = document.createElement('span');
      if (apt.isExempt) {
        badge.className = 'cell-paid-btn exempt';
      } else {
        badge.className = `cell-paid-btn ${isPaid ? 'paid' : ''}`;
      }
      badge.innerHTML = isPaid ? '<i class="fa-solid fa-check"></i>' : '';
      tdMonth.appendChild(badge);
      tr.appendChild(tdMonth);
    }

    const tdRowSummary = document.createElement('td');
    tdRowSummary.className = 'col-summary';
    if (apt.isExempt) {
      tdRowSummary.innerHTML = `<span style="color: var(--text-muted); font-weight: 600;">0 ₺ (Muaf)</span>`;
    } else {
      const aptDebt = unpaidUpToCurrent * state.monthlyDues;
      if (aptDebt > 0) {
        tdRowSummary.innerHTML = `<strong style="color: var(--danger);">${formatMoney(aptDebt)} ₺</strong>`;
      } else {
        tdRowSummary.innerHTML = `<span style="color: var(--success); font-weight: 600;">0 ₺</span>`;
      }
    }
    tr.appendChild(tdRowSummary);
    tbody.appendChild(tr);
  });
}

function renderGridViewCards() {
  const container = document.getElementById('apartmentsCardsGrid');
  if (!container) return;
  const currentMonth = new Date().getMonth() + 1;
  container.innerHTML = '';

  state.apartments.forEach(apt => {
    let unpaidUpToCurrent = 0;
    const card = document.createElement('div');
    card.className = 'apt-card';

    let monthsGridHtml = '';
    for (let m = 1; m <= 12; m++) {
      const isPaid = apt.isExempt ? true : (apt.payments && apt.payments[m]);
      if (!isPaid && m <= currentMonth && !apt.isExempt) {
        unpaidUpToCurrent++;
      }

      const badgeClass = apt.isExempt ? 'exempt' : (isPaid ? 'paid' : '');
      monthsGridHtml += `
        <div class="apt-month-badge ${badgeClass}">
          <span class="m-name">${MONTH_NAMES[m - 1].substring(0, 3)}</span>
          <span class="m-icon">${isPaid ? '<i class="fa-solid fa-check"></i>' : '•'}</span>
        </div>
      `;
    }

    const aptDebt = apt.isExempt ? 0 : unpaidUpToCurrent * state.monthlyDues;

    card.innerHTML = `
      <div class="apt-card-header">
        <div>
          <div class="apt-card-title">Daire ${apt.id} ${apt.isExempt ? '(Yönetici)' : ''}</div>
          <div class="apt-card-occupant">${escapeHtml(apt.occupant || 'Sakin Belirtilmedi')}</div>
        </div>
        <span class="badge badge-light" style="${apt.isExempt ? 'color:var(--primary); font-weight:700;' : (unpaidUpToCurrent > 0 ? 'color:var(--danger); font-weight:700;' : '')}">${apt.isExempt ? 'Aidattan Muaf' : (unpaidUpToCurrent === 0 ? 'Borçsuz' : unpaidUpToCurrent + ' Ay Borcu Var')}</span>
      </div>
      <div class="apt-months-grid">
        ${monthsGridHtml}
      </div>
      <div class="apt-card-footer">
        <span>Güncel Borç:</span>
        <span style="color:${apt.isExempt ? 'var(--text-muted)' : (aptDebt > 0 ? 'var(--danger)' : 'var(--success)')}; font-weight:700; font-size:0.95rem;">${apt.isExempt ? '0 ₺ (Muaf)' : formatMoney(aptDebt) + ' ₺'}</span>
      </div>
    `;
    container.appendChild(card);
  });
}

function renderExtraCollections() {
  const tbody = document.getElementById('extraCollectionsBody');
  const notice = document.getElementById('noExtraCollectionsNotice');
  if (!tbody || !notice) return;
  tbody.innerHTML = '';

  const collections = state.extraCollections || [];
  if (collections.length === 0) {
    notice.classList.remove('hidden');
    return;
  } else {
    notice.classList.add('hidden');
  }

  collections.forEach(col => {
    const tr = document.createElement('tr');
    
    const tdTitle = document.createElement('td');
    tdTitle.className = 'sticky-col';
    tdTitle.innerHTML = `<strong>${escapeHtml(col.title)}</strong>`;
    tr.appendChild(tdTitle);

    const tdAmount = document.createElement('td');
    tdAmount.innerText = `${formatMoney(col.amountPerApt)} ₺`;
    tr.appendChild(tdAmount);

    let paidCount = 0;
    state.apartments.forEach(apt => {
      const isPaid = col.payments && col.payments[apt.id];
      if (isPaid) paidCount++;

      const tdMonth = document.createElement('td');
      const badge = document.createElement('span');
      badge.className = `cell-paid-btn ${isPaid ? 'paid' : ''}`;
      badge.innerHTML = isPaid ? '<i class="fa-solid fa-check"></i>' : '';
      tdMonth.appendChild(badge);
      tr.appendChild(tdMonth);
    });

    const collectedTotal = paidCount * col.amountPerApt;
    const tdCollected = document.createElement('td');
    tdCollected.className = 'col-summary';
    tdCollected.innerHTML = `
      <strong>${formatMoney(collectedTotal)} ₺</strong>
      <div style="font-size:0.7rem; color:var(--text-secondary);">${paidCount}/14 daire</div>
    `;
    tr.appendChild(tdCollected);

    tbody.appendChild(tr);
  });
}

function renderExtraCardsView() {
  const container = document.getElementById('extraApartmentsCardsGrid');
  const notice = document.getElementById('noExtraCollectionsNoticeMobile');
  if (!container || !notice) return;
  container.innerHTML = '';

  const collections = state.extraCollections || [];
  if (collections.length === 0) {
    notice.classList.remove('hidden');
    return;
  } else {
    notice.classList.add('hidden');
  }

  state.apartments.forEach(apt => {
    const card = document.createElement('div');
    card.className = 'extra-apt-card';

    const paidCountForApt = collections.filter(col => col.payments && col.payments[apt.id]).length;

    card.innerHTML = `
      <div class="extra-apt-card-header">
        <div>
          <div class="apt-card-title">Daire ${apt.id}</div>
          <div class="apt-card-occupant">${escapeHtml(apt.occupant || 'Sakin Belirtilmedi')}</div>
        </div>
        <span class="badge badge-light" style="${paidCountForApt === collections.length ? 'color:var(--success); font-weight:700;' : paidCountForApt > 0 ? 'color:var(--warning); font-weight:700;' : 'color:var(--text-muted);'}">${paidCountForApt}/${collections.length} Ödeme</span>
      </div>
      <div class="extra-collections-list" id="extra-list-apt-${apt.id}"></div>
    `;

    const list = card.querySelector(`#extra-list-apt-${apt.id}`);
    collections.forEach(col => {
      const isPaid = col.payments && col.payments[apt.id];
      const row = document.createElement('div');
      row.className = `extra-collection-row${isPaid ? ' paid' : ''}`;
      row.innerHTML = `
        <span class="extra-collection-row-title">${escapeHtml(col.title)}</span>
        <span class="extra-collection-row-amount">${formatMoney(col.amountPerApt)} ₺</span>
        <span class="cell-paid-btn ${isPaid ? 'paid' : ''}" style="width:28px; height:28px; font-size:0.8rem;">
          ${isPaid ? '<i class="fa-solid fa-check"></i>' : ''}
        </span>
      `;
      list.appendChild(row);
    });
    container.appendChild(card);
  });
}

function renderExpensesTable() {
  const tbody = document.getElementById('expensesTableBody');
  const notice = document.getElementById('noExpensesNotice');
  const monthFilter = document.getElementById('expenseMonthFilter').value;
  if (!tbody || !notice) return;
  tbody.innerHTML = '';

  const filteredExpenses = state.expenses.filter(exp => {
    return monthFilter === 'all' || String(exp.month) === String(monthFilter);
  });

  filteredExpenses.sort((a, b) => new Date(b.date) - new Date(a.date));

  if (filteredExpenses.length === 0) {
    notice.classList.remove('hidden');
  } else {
    notice.classList.add('hidden');
  }

  filteredExpenses.forEach(exp => {
    const tr = document.createElement('tr');
    const formattedDate = exp.date ? new Date(exp.date).toLocaleDateString('tr-TR') : '-';
    tr.innerHTML = `
      <td>${formattedDate}</td>
      <td><strong>${escapeHtml(exp.title)}</strong></td>
      <td class="amount-negative">-${formatMoney(exp.amount)} ₺</td>
    `;
    tbody.appendChild(tr);
  });
}

function setupEventListeners() {
  // Toggle View Buttons (Table vs Cards)
  const btnTable = document.getElementById('btnTableView');
  const btnGrid = document.getElementById('btnGridView');
  const containerTable = document.getElementById('tableViewContainer');
  const containerGrid = document.getElementById('gridViewContainer');

  if (btnTable && btnGrid) {
    btnTable.addEventListener('click', () => {
      btnTable.classList.add('active');
      btnGrid.classList.remove('active');
      containerTable.classList.remove('hidden');
      containerGrid.classList.add('hidden');
    });

    btnGrid.addEventListener('click', () => {
      btnGrid.classList.add('active');
      btnTable.classList.remove('active');
      containerGrid.classList.remove('hidden');
      containerTable.classList.add('hidden');
    });
  }

  // Expense filter
  const filter = document.getElementById('expenseMonthFilter');
  if (filter) {
    filter.addEventListener('change', renderExpensesTable);
  }


  // Responsive Layout detection for views on load & resize
  applyViewsByScreenWidth();
  window.addEventListener('resize', applyViewsByScreenWidth);

  // Theme Toggle
  const btnThemeToggle = document.getElementById('btnThemeToggle');
  if (btnThemeToggle) {
    btnThemeToggle.addEventListener('click', toggleTheme);
  }
}

function applyViewsByScreenWidth() {
  const btnTable = document.getElementById('btnTableView');
  const btnGrid = document.getElementById('btnGridView');
  const containerTable = document.getElementById('tableViewContainer');
  const containerGrid = document.getElementById('gridViewContainer');

  const extraTable = document.getElementById('extraTableViewContainer');
  const extraCards = document.getElementById('extraCardsViewContainer');

  if (window.innerWidth <= 768) {
    if (btnGrid && !btnGrid.classList.contains('active')) btnGrid.click();
    if (extraTable && extraCards) {
      extraTable.classList.add('hidden');
      extraCards.classList.remove('hidden');
    }
  } else {
    if (btnTable && !btnTable.classList.contains('active')) btnTable.click();
    if (extraTable && extraCards) {
      extraTable.classList.remove('hidden');
      extraCards.classList.add('hidden');
    }
  }
}

function formatMoney(num) {
  return new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(num || 0);
}

function escapeHtml(str) {
  return String(str || '').replace(/[&<>"']/g, match => {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[match];
  });
}

function renderPdfReports() {
  const tbody = document.getElementById('pdfTableBody');
  const notice = document.getElementById('noPdfsNotice');

  if (!tbody || !notice) return;

  tbody.innerHTML = '';

  const pdfs = state.pdfReports || [];

  if (pdfs.length === 0) {
    notice.classList.remove('hidden');
    return;
  } else {
    notice.classList.add('hidden');
  }

  pdfs.forEach(pdf => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong style="color: var(--primary);"><i class="fa-solid fa-file-pdf"></i> ${escapeHtml(pdf.title)}</strong></td>
      <td>${pdf.date}</td>
      <td>${pdf.size}</td>
      <td style="text-align: center;">
        <a href="${pdf.fileData}" download="${escapeHtml(pdf.title)}.pdf" class="btn btn-outline" style="padding: 0.3rem 0.6rem; font-size: 0.8rem; text-decoration: none; display: inline-flex; align-items: center; gap: 0.3rem;">
          <i class="fa-solid fa-download"></i> İndir
        </a>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function renderAnnouncement() {
  const box = document.getElementById('announcementBox');
  const display = document.getElementById('announcementDisplay');
  if (!box || !display) return;

  if (state.announcement && state.announcement.trim() !== "") {
    display.innerText = state.announcement;
    box.classList.remove('hidden');
    box.style.display = 'block';
  } else {
    box.classList.add('hidden');
    box.style.display = 'none';
  }
}

function toggleTheme() {
  if (document.body.classList.contains('dark-theme')) {
    document.body.classList.remove('dark-theme');
    localStorage.setItem('theme', 'light');
  } else {
    document.body.classList.add('dark-theme');
    localStorage.setItem('theme', 'dark');
  }
  updateThemeIcon();
}

function updateThemeIcon() {
  const icon = document.querySelector('#btnThemeToggle i');
  if (!icon) return;
  if (document.body.classList.contains('dark-theme')) {
    icon.className = 'fa-solid fa-sun';
  } else {
    icon.className = 'fa-solid fa-moon';
  }
}

function updateLastUpdatedDisplay() {
  const display = document.getElementById('lastUpdatedDisplay');
  if (display) {
    display.innerText = state.lastUpdated ? `Son Güncelleme: ${state.lastUpdated}` : 'Son Güncelleme: -';
  }
  const displayExtra = document.getElementById('lastUpdatedDisplayExtra');
  if (displayExtra) {
    displayExtra.innerText = state.lastUpdated ? `Son Güncelleme: ${state.lastUpdated}` : 'Son Güncelleme: -';
  }
}
