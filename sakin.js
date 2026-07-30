/**
 * APARTMAN YÖNETİM SİSTEMİ - SAKİN (VIEW-ONLY) JAVASCRIPT
 * Real-time updates via 'storage' event listener
 */

const STORAGE_KEY = 'apartman_yonetimi_state_v1';

const MONTH_NAMES = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
];

const defaultState = {
  buildingTitle: 'Çiçek Apartmanı 2026',
  monthlyDues: 750,
  currentYear: 2026,
  previousYearTransfer: 0,
  extraCollections: [],
  apartments: [
    { id: 1, occupant: 'Ahmet Yılmaz', payments: { 1: true, 2: true, 3: true, 4: true, 5: true, 6: false, 7: false, 8: false, 9: false, 10: false, 11: false, 12: false } },
    { id: 2, occupant: 'Mehmet Demir', payments: { 1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: false, 8: false, 9: false, 10: false, 11: false, 12: false } },
    { id: 3, occupant: 'Ayşe Kaya', payments: { 1: true, 2: true, 3: true, 4: true, 5: false, 6: false, 7: false, 8: false, 9: false, 10: false, 11: false, 12: false } },
    { id: 4, occupant: 'Fatma Şahin', payments: { 1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true, 8: false, 9: false, 10: false, 11: false, 12: false } },
    { id: 5, occupant: 'Mustafa Çelik', payments: { 1: true, 2: true, 3: true, 4: false, 5: false, 6: false, 7: false, 8: false, 9: false, 10: false, 11: false, 12: false } },
    { id: 6, occupant: 'Zeynep Yıldız', payments: { 1: true, 2: true, 3: true, 4: true, 5: true, 6: false, 7: false, 8: false, 9: false, 10: false, 11: false, 12: false } },
    { id: 7, occupant: 'Emre Öztürk', payments: { 1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: false, 8: false, 9: false, 10: false, 11: false, 12: false } },
    { id: 8, occupant: 'Hatice Arslan', payments: { 1: true, 2: true, 3: true, 4: true, 5: false, 6: false, 7: false, 8: false, 9: false, 10: false, 11: false, 12: false } },
    { id: 9, occupant: 'Ali Doğan', payments: { 1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true, 8: false, 9: false, 10: false, 11: false, 12: false } },
    { id: 10, occupant: 'Hüseyin Aydın', payments: { 1: true, 2: true, 3: true, 4: true, 5: true, 6: false, 7: false, 8: false, 9: false, 10: false, 11: false, 12: false } },
    { id: 11, occupant: 'Elif Özkan', payments: { 1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: false, 8: false, 9: false, 10: false, 11: false, 12: false } },
    { id: 12, occupant: 'Burak Yavuz', payments: { 1: true, 2: true, 3: true, 4: false, 5: false, 6: false, 7: false, 8: false, 9: false, 10: false, 11: false, 12: false } },
    { id: 13, occupant: 'Yönetici', isExempt: true, payments: { 1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true, 8: true, 9: true, 10: true, 11: true, 12: true } },
    { id: 14, occupant: 'Murat Aslan', payments: { 1: true, 2: true, 3: true, 4: true, 5: true, 6: false, 7: false, 8: false, 9: false, 10: false, 11: false, 12: false } }
  ],
  expenses: [
    { id: 'exp-2026-01-1', title: 'TEMİZLİK Aralık 2025', amount: 3205.00, date: '2026-01-05', month: 1 },
    { id: 'exp-2026-01-2', title: 'ASANSÖR Aralık 2025', amount: 1010.00, date: '2026-01-10', month: 1 },
    { id: 'exp-2026-01-3', title: 'AYESAŞ', amount: 75.00, date: '2026-01-15', month: 1 },
    { id: 'exp-2026-01-4', title: 'AYESAŞ', amount: 245.00, date: '2026-01-20', month: 1 },
    { id: 'exp-2026-02-1', title: 'Temizlik Ocak 2026', amount: 4500.00, date: '2026-02-05', month: 2 },
    { id: 'exp-2026-02-2', title: 'Asansör Ocak 2026', amount: 1300.00, date: '2026-02-10', month: 2 },
    { id: 'exp-2026-02-3', title: 'Giriş Kat Su Boru Tami', amount: 4010.00, date: '2026-02-18', month: 2 },
    { id: 'exp-2026-03-1', title: 'AYESAŞ', amount: 65.00, date: '2026-03-05', month: 3 },
    { id: 'exp-2026-03-2', title: 'AYESAŞ', amount: 220.00, date: '2026-03-08', month: 3 },
    { id: 'exp-2026-03-3', title: 'Temizlik Şubat 2026', amount: 4500.00, date: '2026-03-12', month: 3 },
    { id: 'exp-2026-03-4', title: 'Asansör Şubat Mart \'26', amount: 2610.00, date: '2026-03-20', month: 3 },
    { id: 'exp-2026-03-5', title: 'İski Vidanjör', amount: 3010.00, date: '2026-03-25', month: 3 },
    { id: 'exp-2026-04-1', title: 'AYESAŞ', amount: 70.00, date: '2026-04-05', month: 4 },
    { id: 'exp-2026-04-2', title: 'AYESAŞ', amount: 235.00, date: '2026-04-10', month: 4 },
    { id: 'exp-2026-04-3', title: 'Temizlik Mart 2026', amount: 4500.00, date: '2026-04-15', month: 4 },
    { id: 'exp-2026-05-1', title: 'İSKİ', amount: 64.00, date: '2026-05-04', month: 5 },
    { id: 'exp-2026-05-2', title: 'AYESAŞ', amount: 70.00, date: '2026-05-08', month: 5 },
    { id: 'exp-2026-05-3', title: 'AYESAŞ', amount: 245.00, date: '2026-05-12', month: 5 },
    { id: 'exp-2026-05-4', title: 'Kalekim', amount: 300.00, date: '2026-05-16', month: 5 },
    { id: 'exp-2026-05-5', title: 'Asansör Nisan Mayıs', amount: 2600.00, date: '2026-05-20', month: 5 },
    { id: 'exp-2026-05-6', title: 'Temizlik Nisan 2026', amount: 4500.00, date: '2026-05-25', month: 5 },
    { id: 'exp-2026-06-1', title: 'AYESAŞ', amount: 70.00, date: '2026-06-05', month: 6 },
    { id: 'exp-2026-06-2', title: 'AYESAŞ', amount: 235.00, date: '2026-06-08', month: 6 },
    { id: 'exp-2026-06-3', title: 'Asansör Haziran', amount: 1310.00, date: '2026-06-12', month: 6 },
    { id: 'exp-2026-06-4', title: 'Temizlik Mayıs 2026', amount: 4500.00, date: '2026-06-18', month: 6 },
    { id: 'exp-2026-06-5', title: 'AYESAŞ', amount: 85.00, date: '2026-06-22', month: 6 },
    { id: 'exp-2026-06-6', title: 'AYESAŞ', amount: 295.00, date: '2026-06-26', month: 6 },
    { id: 'exp-2026-07-1', title: 'Bahçe Bakım', amount: 10017.00, date: '2026-07-05', month: 7 },
    { id: 'exp-2026-07-2', title: 'Apartman Boyama', amount: 10017.00, date: '2026-07-10', month: 7 },
    { id: 'exp-2026-07-3', title: 'Temizlik Haziran 2026', amount: 4500.00, date: '2026-07-15', month: 7 }
  ]
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

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    let loadedState;
    if (saved) {
      loadedState = { ...defaultState, ...JSON.parse(saved) };
      if (!loadedState.extraCollections) loadedState.extraCollections = [];
    } else {
      loadedState = JSON.parse(JSON.stringify(defaultState));
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
  updateHeaderInfo();
  renderDuesTable();
  renderGridViewCards();
  renderExpensesTable();
  renderExtraCollections();
  renderExtraCardsView();
}

function updateHeaderInfo() {
  document.getElementById('buildingTitleDisplay').innerText = state.buildingTitle;
  document.getElementById('monthlyDuesDisplay').innerText = `${formatMoney(state.monthlyDues)} ₺`;
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
          <div class="apt-card-title">Daire ${apt.id}${apt.isExempt ? ' <span style="font-size:0.7rem; color:var(--primary); font-weight:700;">(Muaf)</span>' : ''}</div>
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
