/**
 * APARTMAN YÖNETİM SİSTEMİ - MAIN JAVASCRIPT
 * 14 Daire x 12 Ay Aidat & Gider / Kasa Takip Mantığı
 */

// Global State Key for LocalStorage
const STORAGE_KEY = 'apartman_yonetimi_state_v1';

// Month Names Constants
const MONTH_NAMES = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
];

// Default Initial State (Used if localStorage is empty)
const defaultState = {
  buildingTitle: 'Çiçek Apartmanı Yönetimi',
  monthlyDues: 600,
  currentYear: 2026,
  previousYearTransfer: 24882.35,
  announcement: "",
  extraCollections: [
    { id: 'ext-1785337506513', title: 'Bahçe & Boya', amountPerApt: 1430, payments: { 1: false, 2: true, 3: true, 4: true, 5: true, 6: true, 7: false, 8: false, 9: false, 10: true, 11: false, 12: false, 13: true, 14: false } }
  ],

  // 14 Daire
  apartments: [
    { id: 1, occupant: 'Hülya KAPLAN', payments: { 1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: false, 8: false, 9: false, 10: false, 11: false, 12: false }, isExempt: false },
    { id: 2, occupant: 'İrem ASLAN', payments: { 1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true, 8: false, 9: false, 10: false, 11: false, 12: false }, isExempt: false },
    { id: 3, occupant: 'Hicran KARA', payments: { 1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: false, 8: false, 9: false, 10: false, 11: false, 12: false }, isExempt: false },
    { id: 4, occupant: 'Mustafa VURAL', payments: { 1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true, 8: false, 9: false, 10: false, 11: false, 12: false }, isExempt: false },
    { id: 5, occupant: 'Sinem AKKUŞ', payments: { 1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: false, 8: false, 9: false, 10: false, 11: false, 12: false }, isExempt: false },
    { id: 6, occupant: 'Osman ŞAHİN', payments: { 1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true, 8: true, 9: false, 10: false, 11: false, 12: false }, isExempt: false },
    { id: 7, occupant: 'Cemal HAMZAOĞULLARI', payments: { 1: true, 2: true, 3: true, 4: true, 5: false, 6: false, 7: false, 8: false, 9: false, 10: false, 11: false, 12: false }, isExempt: false },
    { id: 8, occupant: 'Hüseyin UZUNASLAN', payments: { 1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true, 8: false, 9: false, 10: false, 11: false, 12: false }, isExempt: false },
    { id: 9, occupant: 'Cemal HAMZAOĞULLARI', payments: { 1: true, 2: true, 3: true, 4: true, 5: false, 6: false, 7: false, 8: false, 9: false, 10: false, 11: false, 12: false }, isExempt: false },
    { id: 10, occupant: 'Canan BENZER', payments: { 1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true, 8: false, 9: false, 10: false, 11: false, 12: false }, isExempt: false },
    { id: 11, occupant: 'Hüseyin ATICI', payments: { 1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: false, 8: false, 9: false, 10: false, 11: false, 12: false }, isExempt: false },
    { id: 12, occupant: 'Murat ARSU', payments: { 1: true, 2: true, 3: true, 4: true, 5: false, 6: false, 7: false, 8: false, 9: false, 10: false, 11: false, 12: false }, isExempt: false },
    { id: 13, occupant: 'Atilla HOŞ', payments: { 1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true, 8: true, 9: true, 10: true, 11: true, 12: true }, isExempt: true },
    { id: 14, occupant: 'Vahdettin Avcı', payments: { 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false, 9: false, 10: false, 11: false, 12: false }, isExempt: false }
  ],

  // Giderler
  expenses: [
    { id: 'exp-2026-01-1', title: 'Temizlik / Aralık\'25', amount: 3205, date: '2026-01-05', month: 1 },
    { id: 'exp-2026-01-2', title: 'Asansör Bakım / Aralık\'25', amount: 1010, date: '2026-01-10', month: 1 },
    { id: 'exp-2026-01-3', title: 'Ayesaş / Otomatik', amount: 75, date: '2026-01-15', month: 1 },
    { id: 'exp-2026-01-4', title: 'Ayesaş / Asansör', amount: 245, date: '2026-01-20', month: 1 },
    { id: 'exp-2026-02-1', title: 'Temizlik / Ocak\'26', amount: 4500, date: '2026-02-05', month: 2 },
    { id: 'exp-2026-02-2', title: 'Asansör Bakım / Ocak\'26', amount: 1300, date: '2026-02-10', month: 2 },
    { id: 'exp-2026-02-3', title: 'Giriş Kat Su Borusu Tamiri', amount: 4010, date: '2026-02-18', month: 2 },
    { id: 'exp-2026-03-1', title: 'Ayesaş / Apartman', amount: 65, date: '2026-03-05', month: 3 },
    { id: 'exp-2026-03-2', title: 'Ayesaş / Asansör', amount: 220, date: '2026-03-08', month: 3 },
    { id: 'exp-2026-03-3', title: 'Temizlik / Şubat\'26', amount: 4500, date: '2026-03-12', month: 3 },
    { id: 'exp-2026-03-4', title: 'Asansör Bakım / Şubat & Mart\'26', amount: 2610, date: '2026-03-20', month: 3 },
    { id: 'exp-2026-03-5', title: 'İSKİ / Vidanjör', amount: 3010, date: '2026-03-25', month: 3 },
    { id: 'exp-2026-04-1', title: 'Ayesaş / Apartman', amount: 70, date: '2026-04-05', month: 4 },
    { id: 'exp-2026-04-2', title: 'Ayesaş / Asansör', amount: 235, date: '2026-04-10', month: 4 },
    { id: 'exp-2026-04-3', title: 'Temizlik / Mart\'26', amount: 4500, date: '2026-04-15', month: 4 },
    { id: 'exp-2026-05-1', title: 'İSKİ', amount: 64, date: '2026-05-04', month: 5 },
    { id: 'exp-2026-05-2', title: 'Ayesaş / Apartman', amount: 70, date: '2026-05-08', month: 5 },
    { id: 'exp-2026-05-3', title: 'Ayesaş / Asansör', amount: 245, date: '2026-05-12', month: 5 },
    { id: 'exp-2026-05-4', title: 'Kalekim (Mermer Yapıştırma)', amount: 300, date: '2026-05-16', month: 5 },
    { id: 'exp-2026-05-5', title: 'Asansör Bakım / Nisan & Mayıs\'26', amount: 2600, date: '2026-05-20', month: 5 },
    { id: 'exp-2026-05-6', title: 'Temizlik / Nisan\'26', amount: 4500, date: '2026-05-25', month: 5 },
    { id: 'exp-2026-06-1', title: 'Ayesaş / Apartman', amount: 70, date: '2026-06-05', month: 6 },
    { id: 'exp-2026-06-2', title: 'Ayesaş / Asansör', amount: 235, date: '2026-06-08', month: 6 },
    { id: 'exp-2026-06-3', title: 'Asansör Bakım / Haziran\'26', amount: 1310, date: '2026-06-12', month: 6 },
    { id: 'exp-2026-06-4', title: 'Temizlik / Mayıs\'26', amount: 4500, date: '2026-06-18', month: 6 },
    { id: 'exp-2026-06-5', title: 'Ayesaş / Apartman', amount: 85, date: '2026-06-22', month: 6 },
    { id: 'exp-2026-06-6', title: 'Ayesaş / Asansör', amount: 295, date: '2026-06-26', month: 6 },
    { id: 'exp-2026-07-1', title: 'Bahçe Bakım', amount: 10017, date: '2026-07-05', month: 7 },
    { id: 'exp-2026-07-2', title: 'Apartman Boyama', amount: 10017, date: '2026-07-10', month: 7 },
    { id: 'exp-2026-07-3', title: 'Temizlik / Haziran\'26', amount: 4500, date: '2026-07-15', month: 7 }
  ]
};

// Current Active State
let state = loadState();
let editingExpenseId = null;
// Pending (unsaved) changes for extra collections payments
let pendingExtraPayments = null; // null = no unsaved changes
// Pending (unsaved) changes for monthly dues payments
let pendingAidatPayments = null; // null = no unsaved changes

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  initApp();
  setupEventListeners();
});

/**
 * Load State from LocalStorage or Default
 */
function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    let loadedState;
    if (saved) {
      loadedState = { ...defaultState, ...JSON.parse(saved) };
      if (!loadedState.extraCollections) loadedState.extraCollections = [];
      if (!loadedState.pdfReports) loadedState.pdfReports = [];
      if (loadedState.announcement === undefined) loadedState.announcement = "";
    } else {
      loadedState = JSON.parse(JSON.stringify(defaultState));
    }

    // Hydrate Daire 13 (Yönetici - Aidattan Muaf)
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

/**
 * Save Current State to LocalStorage
 */
function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('LocalStorage save error:', e);
  }
}

/**
 * Primary Initialization
 */
function initApp() {
  updateHeaderInfo();
  renderKasaSummary();
  renderDuesTable();
  renderGridViewCards();
  renderExpensesTable();
  renderExtraCollections();
  renderExtraCardsView();
  renderPdfReports();
  
  const announcementArea = document.getElementById('announcementText');
  if (announcementArea) {
    announcementArea.value = state.announcement || "";
  }

  // Load Theme
  const savedTheme = localStorage.getItem('theme') || 'light';
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
  } else {
    document.body.classList.remove('dark-theme');
  }
  updateThemeIcon();
}

/**
 * Update Header and Static Labels
 */
function updateHeaderInfo() {
  document.getElementById('buildingTitleDisplay').innerText = state.buildingTitle;
  const badge = document.getElementById('currentYearBadge');
  if (badge) {
    badge.innerText = `${state.currentYear} Yılı Özeti`;
  }
  document.getElementById('monthlyDuesDisplay').innerText = `${formatMoney(state.monthlyDues)} ₺`;
}

/**
 * Render Financial Kasa Cards (Excludes Exempt Apartments from Income & Debt)
 */
function renderKasaSummary() {
  let totalPaidIncomeCount = 0;
  let payingAptCount = 0;

  state.apartments.forEach(apt => {
    if (!apt.isExempt) {
      payingAptCount++;
      for (let m = 1; m <= 12; m++) {
        if (apt.payments && apt.payments[m]) {
          totalPaidIncomeCount++;
        }
      }
    }
  });

  const totalPossibleDues = payingAptCount * 12; // 13 paying * 12 = 156
  const totalDuesIncome = totalPaidIncomeCount * state.monthlyDues;

  let totalExtraIncome = 0;
  (state.extraCollections || []).forEach(col => {
    Object.keys(col.payments || {}).forEach(aptId => {
      if (col.payments[aptId]) {
        totalExtraIncome += (parseFloat(col.amountPerApt) || 0);
      }
    });
  });

  const totalIncome = totalDuesIncome + totalExtraIncome;
  const totalExpenses = state.expenses.reduce((sum, exp) => sum + (parseFloat(exp.amount) || 0), 0);
  const prevTransfer = parseFloat(state.previousYearTransfer) || 0;
  const netBalance = prevTransfer + totalIncome - totalExpenses;

  // Update DOM
  document.getElementById('kasaPreviousTransfer').innerText = `${formatMoney(prevTransfer)} ₺`;
  document.getElementById('kasaTotalIncome').innerText = `${formatMoney(totalIncome)} ₺`;
  document.getElementById('kasaPaidCountText').innerText = `Aidat: ${formatMoney(totalDuesIncome)} ₺ | Ek Bütçe: ${formatMoney(totalExtraIncome)} ₺`;

  document.getElementById('kasaTotalExpense').innerText = `${formatMoney(totalExpenses)} ₺`;
  document.getElementById('kasaExpenseCountText').innerText = `${state.expenses.length} adet gider kaydı`;

  document.getElementById('kasaNetBalance').innerText = `${formatMoney(netBalance)} ₺`;

  // Net Balance Color styling
  const netCard = document.getElementById('kasaNetBalance');
  if (netBalance < 0) {
    netCard.style.color = 'var(--danger)';
  } else {
    netCard.style.color = 'var(--text-primary)';
  }
}

/**
 * Render Main Aidat Table (14 Daire x 12 Ay)
 */
function renderDuesTable() {
  const tbody = document.getElementById('duesTableBody');
  const searchInput = document.getElementById('daireSearch');
  const searchQuery = (searchInput?.value || '').toLowerCase().trim();

  tbody.innerHTML = '';

  // Get current month (1-12)
  const currentMonth = new Date().getMonth() + 1;

  // Monthly totals accumulator
  const monthTotals = Array(13).fill(0); // 1-12
  let payingAptCount = 0;

  state.apartments.forEach(apt => {
    if (!apt.isExempt) payingAptCount++;

    // Search Filter
    const matchesSearch = !searchQuery || 
      `daire ${apt.id}`.includes(searchQuery) || 
      apt.occupant.toLowerCase().includes(searchQuery);

    if (!matchesSearch) return;

    let aptPaidCount = 0;
    let unpaidUpToCurrent = 0;
    const tr = document.createElement('tr');

    // Sticky First Column (Daire No / Occupant Name)
    const tdApt = document.createElement('td');
    tdApt.className = 'sticky-col';
    tdApt.innerHTML = `
      <div>
        <strong>Daire ${apt.id} ${apt.isExempt ? '<span style="font-size:0.7rem; color:var(--primary); font-weight:700;">(Muaf)</span>' : ''}</strong>
        <span class="occupant-sub">${escapeHtml(apt.occupant || 'Sakin Belirtilmedi')}</span>
      </div>
    `;
    tr.appendChild(tdApt);

    const effectivePayments = getEffectiveAidatPayments(apt);

    // 12 Months Cells
    for (let m = 1; m <= 12; m++) {
      const isPaid = apt.isExempt ? true : effectivePayments[m];

      if (isPaid) {
        aptPaidCount++;
        if (!apt.isExempt) {
          monthTotals[m]++;
        }
      } else if (m <= currentMonth && !apt.isExempt) {
        unpaidUpToCurrent++;
      }

      const tdMonth = document.createElement('td');
      
      const btn = document.createElement('button');
      btn.type = 'button';
      // Muaf daireler için ayrı class: yeşil değil, gri check
      if (apt.isExempt) {
        btn.className = 'cell-paid-btn exempt';
      } else {
        btn.className = `cell-paid-btn ${isPaid ? 'paid' : ''}`;
      }
      btn.title = apt.isExempt ? `Daire ${apt.id} (Yönetici): Aidattan Muaf` : `Daire ${apt.id} (${MONTH_NAMES[m - 1]}): ${isPaid ? 'Ödendi' : 'Ödenmedi (Tıkla ve değiştir)'}`;
      btn.setAttribute('aria-label', `Daire ${apt.id} ${MONTH_NAMES[m - 1]} aidat ödeme durumu`);
      btn.innerHTML = isPaid ? '<i class="fa-solid fa-check"></i>' : '';

      // Click event to toggle payment status
      btn.addEventListener('click', () => {
        togglePaymentStatus(apt.id, m);
      });

      tdMonth.appendChild(btn);
      tr.appendChild(tdMonth);
    }

    // Row Summary (Güncel Borç: Current month included unpaid debt)
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

/**
 * Render Card/Grid View for Mobile Screens
 */
function renderGridViewCards() {
  const container = document.getElementById('apartmentsCardsGrid');
  const searchInput = document.getElementById('daireSearch');
  const searchQuery = (searchInput?.value || '').toLowerCase().trim();
  const currentMonth = new Date().getMonth() + 1;
  container.innerHTML = '';

  state.apartments.forEach(apt => {
    const matchesSearch = !searchQuery || 
      `daire ${apt.id}`.includes(searchQuery) || 
      apt.occupant.toLowerCase().includes(searchQuery);

    if (!matchesSearch) return;

    let aptPaidCount = 0;
    let unpaidUpToCurrent = 0;
    const card = document.createElement('div');
    card.className = 'apt-card';

    const effectivePayments = getEffectiveAidatPayments(apt);

    let monthsGridHtml = '';
    for (let m = 1; m <= 12; m++) {
      const isPaid = apt.isExempt ? true : effectivePayments[m];
      if (isPaid) {
        aptPaidCount++;
      } else if (m <= currentMonth && !apt.isExempt) {
        unpaidUpToCurrent++;
      }

      const badgeClass = apt.isExempt ? 'exempt' : (isPaid ? 'paid' : '');
      monthsGridHtml += `
        <div class="apt-month-badge ${badgeClass}" onclick="togglePaymentStatus(${apt.id}, ${m})">
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

/**
 * Helper: get effective dues payments for an apartment (pending overrides saved)
 */
function getEffectiveAidatPayments(apt) {
  if (pendingAidatPayments && pendingAidatPayments[apt.id]) {
    return pendingAidatPayments[apt.id];
  }
  return apt.payments || {};
}

/**
 * Show/hide dues save bar based on pending changes
 */
function updateAidatSaveBar() {
  const bar = document.getElementById('aidatSaveBar');
  if (!bar) return;
  if (pendingAidatPayments && Object.keys(pendingAidatPayments).length > 0) {
    bar.classList.remove('hidden');
    bar.style.display = 'flex';
  } else {
    bar.classList.add('hidden');
  }
}

/**
 * Commit pending dues payment changes to state and save
 */
function commitAidatPaymentChanges() {
  if (!pendingAidatPayments) return;

  state.apartments.forEach(apt => {
    if (pendingAidatPayments[apt.id]) {
      apt.payments = { ...pendingAidatPayments[apt.id] };
    }
  });

  pendingAidatPayments = null;
  saveState();
  renderKasaSummary();
  renderDuesTable();
  renderGridViewCards();
  updateAidatSaveBar();
  showToast('Aidat ödeme değişiklikleri kaydedildi.', 'success');
}

/**
 * Discard pending dues payment changes
 */
function discardAidatPaymentChanges() {
  pendingAidatPayments = null;
  renderDuesTable();
  renderGridViewCards();
  renderKasaSummary();
  updateAidatSaveBar();
  showToast('Değişiklikler geri alındı.', 'info');
}

/**
 * Toggle Payment Status of a specific Apartment and Month (Staged to pending state)
 */
function togglePaymentStatus(aptId, month) {
  const apt = state.apartments.find(a => a.id === aptId);
  if (!apt) return;

  if (apt.isExempt) {
    showToast(`Daire ${aptId} Yönetici dairesidir, aidattan muaftır (Kasaya gelir yazılmaz).`, 'info');
    return;
  }

  if (!pendingAidatPayments) pendingAidatPayments = {};
  if (!pendingAidatPayments[aptId]) {
    pendingAidatPayments[aptId] = { ...(apt.payments || {}) };
  }

  pendingAidatPayments[aptId][month] = !pendingAidatPayments[aptId][month];

  renderKasaSummary();
  renderDuesTable();
  renderGridViewCards();
  updateAidatSaveBar();
}

/**
 * Render Expenses Table
 */
function renderExpensesTable() {
  const tbody = document.getElementById('expensesTableBody');
  const notice = document.getElementById('noExpensesNotice');
  const filterEl = document.getElementById('expenseMonthFilter');

  // Varsayılan olarak güncel ayı göster
  if (!filterEl._initialized) {
    filterEl.value = String(new Date().getMonth() + 1);
    filterEl._initialized = true;
  }
  const monthFilter = filterEl.value;

  tbody.innerHTML = '';

  const filteredExpenses = state.expenses.filter(exp => {
    return monthFilter === 'all' || String(exp.month) === String(monthFilter);
  });

  // Sort by date descending
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
      <td>
        <button class="btn-edit-expense" onclick="editExpense('${exp.id}')" title="Gideri Düzenle" style="color: var(--primary); background: none; border: none; cursor: pointer; padding: 0.3rem; margin-right: 0.4rem;">
          <i class="fa-solid fa-pen-to-square"></i>
        </button>
        <button class="btn-delete-expense" onclick="deleteExpense('${exp.id}')" title="Gideri Sil">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

/**
 * Edit Expense
 */
window.editExpense = function(id) {
  const exp = state.expenses.find(e => e.id === id);
  if (!exp) return;

  editingExpenseId = id;
  document.getElementById('expenseModalTitle').innerText = 'Gider Kaydını Düzenle';
  document.getElementById('expenseTitle').value = exp.title || '';
  document.getElementById('expenseAmount').value = exp.amount || '';
  document.getElementById('expenseDate').value = exp.date || '';
  document.getElementById('expenseMonth').value = String(exp.month || 1);

  openModal('expenseModal');
};

/**
 * Add / Edit Expense Function
 */
function handleAddExpense(e) {
  e.preventDefault();

  const title = document.getElementById('expenseTitle').value.trim();
  const amount = parseFloat(document.getElementById('expenseAmount').value);
  const date = document.getElementById('expenseDate').value;
  const month = parseInt(document.getElementById('expenseMonth').value, 10);

  if (!title || isNaN(amount) || amount <= 0 || !date) {
    showToast('Lütfen tüm zorunlu alanları geçerli şekilde doldurun.', 'info');
    return;
  }

  if (editingExpenseId) {
    // Update existing expense
    const exp = state.expenses.find(e => e.id === editingExpenseId);
    if (exp) {
      exp.title = title;
      exp.amount = amount;
      exp.date = date;
      exp.month = month;
      showToast('Gider kaydı başarıyla güncellendi.', 'success');
    }
  } else {
    // Add new expense
    const newExpense = {
      id: 'exp-' + Date.now(),
      title,
      amount,
      date,
      month
    };
    state.expenses.push(newExpense);
    showToast('Yeni gider kaydı başarıyla eklendi.', 'success');
  }

  saveState();
  renderKasaSummary();
  renderExpensesTable();

  closeModal('expenseModal');
  document.getElementById('expenseForm').reset();
  editingExpenseId = null;
}

/**
 * Delete Expense
 */
window.deleteExpense = function(id) {
  if (confirm('Bu gider kaydını silmek istediğinize emin misiniz?')) {
    state.expenses = state.expenses.filter(e => e.id !== id);
    saveState();
    renderKasaSummary();
    renderExpensesTable();
    showToast('Gider kaydı silindi.', 'info');
  }
};

/**
 * Setup All UI Event Listeners
 */
function setupEventListeners() {
  // Search input (if present)
  const searchInput = document.getElementById('daireSearch');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      renderDuesTable();
      renderGridViewCards();
    });
  }

  // Table vs Grid View Toggles
  const btnTable = document.getElementById('btnTableView');
  const btnGrid = document.getElementById('btnGridView');
  const containerTable = document.getElementById('tableViewContainer');
  const containerGrid = document.getElementById('gridViewContainer');

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

  // Expense Filters
  document.getElementById('expenseMonthFilter').addEventListener('change', renderExpensesTable);

  // Expense Modals
  const btnAddExpenseHeader = document.getElementById('btnAddExpenseHeader');
  if (btnAddExpenseHeader) {
    btnAddExpenseHeader.addEventListener('click', openAddExpenseModal);
  }
  document.getElementById('btnAddExpenseSection').addEventListener('click', openAddExpenseModal);
  document.getElementById('closeExpenseModal').addEventListener('click', () => closeModal('expenseModal'));
  document.getElementById('cancelExpenseModal').addEventListener('click', () => closeModal('expenseModal'));
  document.getElementById('expenseForm').addEventListener('submit', handleAddExpense);

  // Settings Modal
  document.getElementById('btnSettings').addEventListener('click', openSettingsModal);
  document.getElementById('btnEditDues').addEventListener('click', openSettingsModal);
  document.getElementById('closeSettingsModal').addEventListener('click', () => closeModal('settingsModal'));
  document.getElementById('cancelSettingsModal').addEventListener('click', () => closeModal('settingsModal'));
  document.getElementById('saveSettingsBtn').addEventListener('click', handleSaveSettings);

  // Print Button
  const btnPrint = document.getElementById('btnPrint');
  if (btnPrint) {
    btnPrint.addEventListener('click', () => {
      window.print();
    });
  }

  // Sistemi Sıfırla
  const btnResetSystem = document.getElementById('btnResetSystem');
  if (btnResetSystem) {
    btnResetSystem.addEventListener('click', handleResetSystem);
  }

  // Extra Collections Modals
  document.getElementById('btnOpenExtraModal').addEventListener('click', () => {
    document.getElementById('extraCollectionForm').reset();
    openModal('extraCollectionModal');
  });
  document.getElementById('closeExtraModal').addEventListener('click', () => closeModal('extraCollectionModal'));
  document.getElementById('cancelExtraModal').addEventListener('click', () => closeModal('extraCollectionModal'));
  document.getElementById('extraCollectionForm').addEventListener('submit', handleCreateExtraCollection);

  // Extra collections Save / Discard buttons
  document.getElementById('btnSaveExtraChanges').addEventListener('click', commitExtraPaymentChanges);
  document.getElementById('btnDiscardExtraChanges').addEventListener('click', discardExtraPaymentChanges);

  // Monthly dues Save / Discard buttons
  document.getElementById('btnSaveAidatChanges').addEventListener('click', commitAidatPaymentChanges);
  document.getElementById('btnDiscardAidatChanges').addEventListener('click', discardAidatPaymentChanges);

  // Auto-activate Card view on mobile screens (<= 768px) on load
  applyExtraViewByScreenWidth();

  // Handle dynamic screen resizing
  window.addEventListener('resize', applyExtraViewByScreenWidth);

  // Also drive aidat table views
  if (window.innerWidth <= 768 && btnGrid) {
    btnGrid.click();
  }

  window.addEventListener('resize', () => {
    if (window.innerWidth <= 768 && !btnGrid.classList.contains('active')) {
      btnGrid.click();
    } else if (window.innerWidth > 768 && !btnTable.classList.contains('active')) {
      btnTable.click();
    }
  });

  // PDF Reports Modals
  const btnOpenPdfModal = document.getElementById('btnOpenPdfModal');
  if (btnOpenPdfModal) {
    btnOpenPdfModal.addEventListener('click', () => {
      document.getElementById('pdfForm').reset();
      openModal('pdfModal');
    });
  }
  const closePdfModal = document.getElementById('closePdfModal');
  if (closePdfModal) closePdfModal.addEventListener('click', () => closeModal('pdfModal'));
  const cancelPdfModal = document.getElementById('cancelPdfModal');
  if (cancelPdfModal) cancelPdfModal.addEventListener('click', () => closeModal('pdfModal'));
  const pdfForm = document.getElementById('pdfForm');
  if (pdfForm) pdfForm.addEventListener('submit', handleUploadPdf);

  // Save Announcement
  const btnSaveAnnouncement = document.getElementById('btnSaveAnnouncement');
  if (btnSaveAnnouncement) {
    btnSaveAnnouncement.addEventListener('click', () => {
      const text = document.getElementById('announcementText').value.trim();
      state.announcement = text;
      saveState();
      showToast('Duyuru başarıyla güncellendi.', 'success');
    });
  }

  // Theme Toggle
  const btnThemeToggle = document.getElementById('btnThemeToggle');
  if (btnThemeToggle) {
    btnThemeToggle.addEventListener('click', toggleTheme);
  }
}

/**
 * Open Expense Modal with Today's Date default
 */
function openAddExpenseModal() {
  editingExpenseId = null;
  document.getElementById('expenseModalTitle').innerText = 'Yeni Gider Kaydı Ekle';
  document.getElementById('expenseForm').reset();
  
  const dateInput = document.getElementById('expenseDate');
  if (!dateInput.value) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
  }
  
  // Set current month in select
  const currentMonthNum = new Date().getMonth() + 1;
  document.getElementById('expenseMonth').value = String(currentMonthNum);

  openModal('expenseModal');
}

/**
 * Open Settings & Occupants Modal
 */
function openSettingsModal() {
  document.getElementById('inputBuildingTitle').value = state.buildingTitle;
  document.getElementById('inputMonthlyDues').value = state.monthlyDues;
  document.getElementById('inputPreviousTransfer').value = state.previousYearTransfer || 0;

  const grid = document.getElementById('occupantsGrid');
  grid.innerHTML = '';

  state.apartments.forEach(apt => {
    const div = document.createElement('div');
    div.className = 'form-group';
    div.innerHTML = `
      <label for="occupant_${apt.id}">Daire ${apt.id} Sakini</label>
      <input type="text" id="occupant_${apt.id}" class="form-control occupant-input" data-id="${apt.id}" value="${escapeHtml(apt.occupant || '')}">
      <label style="font-size:0.75rem; color:var(--text-secondary); margin-top:0.25rem; display:inline-flex; align-items:center; gap:0.3rem;">
        <input type="checkbox" class="exempt-checkbox" data-id="${apt.id}" ${apt.isExempt ? 'checked' : ''}>
        Aidattan Muaf (Yönetici)
      </label>
    `;
    grid.appendChild(div);
  });

  openModal('settingsModal');
}

/**
 * Save Settings & Occupant Names
 */
function handleSaveSettings() {
  const newTitle = document.getElementById('inputBuildingTitle').value.trim();
  const newDues = parseFloat(document.getElementById('inputMonthlyDues').value);
  const newTransfer = parseFloat(document.getElementById('inputPreviousTransfer').value);

  if (newTitle) state.buildingTitle = newTitle;
  if (!isNaN(newDues) && newDues > 0) state.monthlyDues = newDues;
  if (!isNaN(newTransfer) && newTransfer >= 0) state.previousYearTransfer = newTransfer;

  // Update Occupants and Exemption status
  const inputs = document.querySelectorAll('.occupant-input');
  inputs.forEach(input => {
    const aptId = parseInt(input.getAttribute('data-id'), 10);
    const apt = state.apartments.find(a => a.id === aptId);
    if (apt) {
      apt.occupant = input.value.trim();
      const checkbox = document.querySelector(`.exempt-checkbox[data-id="${aptId}"]`);
      if (checkbox) {
        apt.isExempt = checkbox.checked;
        if (apt.isExempt) {
          if (!apt.payments) apt.payments = {};
          for (let m = 1; m <= 12; m++) {
            apt.payments[m] = true;
          }
        }
      }
    }
  });

  saveState();
  initApp();
  closeModal('settingsModal');
  showToast('Ayarlar ve sakin bilgileri güncellendi.', 'success');
}

/**
 * Modal Open/Close Helpers
 */
function openModal(id) {
  document.getElementById(id).classList.remove('hidden');
}

function closeModal(id) {
  document.getElementById(id).classList.add('hidden');
}

/**
 * Notification Toast Helper
 */
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<i class="fa-solid ${type === 'success' ? 'fa-circle-check' : 'fa-circle-info'}"></i> <span>${escapeHtml(message)}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

/**
 * Helper: get effective payments for a collection (pending overrides saved)
 */
function getEffectivePayments(col) {
  if (pendingExtraPayments && pendingExtraPayments[col.id]) {
    return pendingExtraPayments[col.id];
  }
  return col.payments || {};
}

/**
 * Show/hide save bar based on whether there are pending changes
 */
function updateExtraSaveBar() {
  const bar = document.getElementById('extraSaveBar');
  if (!bar) return;
  if (pendingExtraPayments && Object.keys(pendingExtraPayments).length > 0) {
    bar.classList.remove('hidden');
    bar.style.display = 'flex';
  } else {
    bar.classList.add('hidden');
  }
}

/**
 * Commit pending extra payment changes to state and save
 */
function commitExtraPaymentChanges() {
  if (!pendingExtraPayments) return;

  (state.extraCollections || []).forEach(col => {
    if (pendingExtraPayments[col.id]) {
      col.payments = { ...pendingExtraPayments[col.id] };
    }
  });

  pendingExtraPayments = null;
  saveState();
  renderKasaSummary();
  renderExtraCollections();
  renderExtraCardsView();
  updateExtraSaveBar();
  showToast('Ek ödeme değişiklikleri kaydedildi.', 'success');
}

/**
 * Discard pending extra payment changes
 */
function discardExtraPaymentChanges() {
  pendingExtraPayments = null;
  renderExtraCollections();
  renderExtraCardsView();
  updateExtraSaveBar();
  showToast('Değişiklikler geri alındı.', 'info');
}

/**
 * Apply table or card view for extra collections based on screen width
 */
function applyExtraViewByScreenWidth() {
  const tableContainer = document.getElementById('extraTableViewContainer');
  const cardsContainer = document.getElementById('extraCardsViewContainer');
  if (!tableContainer || !cardsContainer) return;
  if (window.innerWidth <= 768) {
    tableContainer.classList.add('hidden');
    cardsContainer.classList.remove('hidden');
  } else {
    tableContainer.classList.remove('hidden');
    cardsContainer.classList.add('hidden');
  }
}

/**
 * Render Extra Collections Table (Desktop)
 */
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
    const effectivePayments = getEffectivePayments(col);
    
    // Title
    const tdTitle = document.createElement('td');
    tdTitle.className = 'sticky-col';
    const hasPending = pendingExtraPayments && pendingExtraPayments[col.id];
    tdTitle.innerHTML = `<strong>${escapeHtml(col.title)}</strong>${hasPending ? '<span class="extra-pending-badge" title="Kaydedilmemiş değişiklik"></span>' : ''}`;
    tr.appendChild(tdTitle);

    // Amount per Apt
    const tdAmount = document.createElement('td');
    tdAmount.innerText = `${formatMoney(col.amountPerApt)} ₺`;
    tr.appendChild(tdAmount);

    // 14 Apartments Columns
    let paidCount = 0;
    state.apartments.forEach(apt => {
      const isPaid = effectivePayments[apt.id];
      if (isPaid) paidCount++;

      const tdMonth = document.createElement('td');
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `cell-paid-btn ${isPaid ? 'paid' : ''}`;
      btn.title = `Daire ${apt.id}: ${isPaid ? 'Ödedi' : 'Ödemedi (Tıkla ve değiştir)'}`;
      btn.setAttribute('aria-label', `Daire ${apt.id} ek ödeme durumu`);
      btn.innerHTML = isPaid ? '<i class="fa-solid fa-check"></i>' : '';

      btn.addEventListener('click', () => {
        stagePendingToggle(col.id, apt.id);
      });

      tdMonth.appendChild(btn);
      tr.appendChild(tdMonth);
    });

    // Total Collected (using pending if available)
    const collectedTotal = paidCount * col.amountPerApt;
    const tdCollected = document.createElement('td');
    tdCollected.className = 'col-summary';
    tdCollected.innerHTML = `
      <strong>${formatMoney(collectedTotal)} ₺</strong>
      <div style="font-size:0.7rem; color:var(--text-secondary);">${paidCount}/14 daire</div>
    `;
    tr.appendChild(tdCollected);

    // Actions
    const tdAction = document.createElement('td');
    tdAction.style.textAlign = 'center';
    tdAction.innerHTML = `
      <button class="btn-delete-expense" onclick="deleteExtraCollection('${col.id}')" title="Talebi Sil">
        <i class="fa-solid fa-trash-can"></i>
      </button>
    `;
    tr.appendChild(tdAction);

    tbody.appendChild(tr);
  });
}

/**
 * Render Extra Collections as Cards (Mobile)
 */
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

  // Render one card per apartment
  state.apartments.forEach(apt => {
    const card = document.createElement('div');
    card.className = 'extra-apt-card';

    const paidCountForApt = collections.filter(col => {
      const ep = getEffectivePayments(col);
      return ep[apt.id];
    }).length;

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
      const ep = getEffectivePayments(col);
      const isPaid = ep[apt.id];
      const row = document.createElement('div');
      row.className = `extra-collection-row${isPaid ? ' paid' : ''}`;
      row.innerHTML = `
        <span class="extra-collection-row-title">${escapeHtml(col.title)}</span>
        <span class="extra-collection-row-amount">${formatMoney(col.amountPerApt)} ₺</span>
        <button type="button" class="cell-paid-btn ${isPaid ? 'paid' : ''}" style="width:28px; height:28px; font-size:0.8rem;" title="${isPaid ? 'Ödedi (Tıkla değiştir)' : 'Ödemedi (Tıkla değiştir)'}"
          aria-label="Daire ${apt.id} ${escapeHtml(col.title)} ödeme durumu">
          ${isPaid ? '<i class="fa-solid fa-check"></i>' : ''}
        </button>
      `;

      const btn = row.querySelector('.cell-paid-btn');
      btn.addEventListener('click', () => {
        stagePendingToggle(col.id, apt.id);
      });

      list.appendChild(row);
    });

    container.appendChild(card);
  });
}

/**
 * Stage a toggle change in pendingExtraPayments (no save yet)
 */
function stagePendingToggle(colId, aptId) {
  const col = (state.extraCollections || []).find(c => c.id === colId);
  if (!col) return;

  if (!pendingExtraPayments) pendingExtraPayments = {};
  if (!pendingExtraPayments[colId]) {
    // Clone current saved payments as baseline
    pendingExtraPayments[colId] = { ...(col.payments || {}) };
  }

  pendingExtraPayments[colId][aptId] = !pendingExtraPayments[colId][aptId];

  // Update both views
  renderExtraCollections();
  renderExtraCardsView();
  updateExtraSaveBar();
}

/**
 * Handle Create Extra Collection
 */
function handleCreateExtraCollection(e) {
  e.preventDefault();

  const title = document.getElementById('extraCollectionTitle').value.trim();
  const amountPerApt = parseFloat(document.getElementById('extraCollectionAmount').value);

  if (!title || isNaN(amountPerApt) || amountPerApt <= 0) {
    showToast('Lütfen geçerli bir başlık ve tutar girin.', 'info');
    return;
  }

  const payments = {};
  state.apartments.forEach(apt => {
    payments[apt.id] = false;
  });

  const newCol = {
    id: 'ext-' + Date.now(),
    title,
    amountPerApt,
    payments
  };

  if (!state.extraCollections) state.extraCollections = [];

  state.extraCollections.push(newCol);
  saveState();

  renderKasaSummary();
  renderExtraCollections();
  renderExtraCardsView();

  closeModal('extraCollectionModal');
  document.getElementById('extraCollectionForm').reset();
  showToast('Yeni ek ödeme talebi başarıyla oluşturuldu.', 'success');
}

/**
 * Delete Extra Collection
 */
window.deleteExtraCollection = function(id) {
  if (confirm('Bu ek ödeme talebini ve buna bağlı toplanan tüm gelir kayıtlarını silmek istediğinize emin misiniz?')) {
    // Remove from pending too
    if (pendingExtraPayments) delete pendingExtraPayments[id];
    state.extraCollections = (state.extraCollections || []).filter(c => c.id !== id);
    saveState();
    renderKasaSummary();
    renderExtraCollections();
    renderExtraCardsView();
    updateExtraSaveBar();
    showToast('Ek ödeme talebi silindi.', 'info');
  }
};

/**
 * Formatting Utilities
 */
function formatMoney(num) {
  return new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(num || 0);
}

function escapeHtml(str) {
  return String(str || '').replace(/[&<>"']/g, match => {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[match];
  });
}

/**
 * Render PDF Reports
 */
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
      <td style="text-align: center; display: flex; gap: 0.5rem; justify-content: center; align-items: center;">
        <a href="${pdf.fileData}" download="${escapeHtml(pdf.title)}.pdf" class="btn btn-outline" style="padding: 0.3rem 0.6rem; font-size: 0.8rem; text-decoration: none;">
          <i class="fa-solid fa-download"></i> İndir
        </a>
        <button class="btn-delete-expense" onclick="deletePdfReport('${pdf.id}')" title="Raporu Sil" style="margin: 0;">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

/**
 * Handle PDF File Upload
 */
function handleUploadPdf(e) {
  e.preventDefault();
  const title = document.getElementById('pdfTitle').value.trim();
  const fileInput = document.getElementById('pdfFile');
  const file = fileInput.files[0];

  if (!title || !file) {
    showToast('Lütfen tüm alanları doldurun.', 'error');
    return;
  }

  // File size check: 2MB limit
  const maxBytes = 2 * 1024 * 1024; // 2MB
  if (file.size > maxBytes) {
    showToast('Dosya boyutu çok büyük (Maks. 2MB olmalıdır). Lütfen PDF\'i sıkıştırın.', 'error');
    return;
  }

  const reader = new FileReader();
  reader.onload = function(event) {
    const base64Data = event.target.result;
    const formattedSize = (file.size / 1024).toFixed(1) + ' KB';
    const uploadDate = new Date().toLocaleDateString('tr-TR');

    const newPdf = {
      id: 'pdf-' + Date.now(),
      title,
      date: uploadDate,
      size: formattedSize,
      fileData: base64Data
    };

    if (!state.pdfReports) state.pdfReports = [];
    state.pdfReports.push(newPdf);

    saveState();
    renderPdfReports();
    closeModal('pdfModal');
    document.getElementById('pdfForm').reset();
    showToast('PDF raporu başarıyla yüklendi.', 'success');
  };

  reader.onerror = function() {
    showToast('Dosya okunurken bir hata oluştu.', 'error');
  };

  reader.readAsDataURL(file);
}

/**
 * Delete PDF Report
 */
window.deletePdfReport = function(id) {
  if (confirm('Bu raporu silmek istediğinize emin misiniz?')) {
    state.pdfReports = (state.pdfReports || []).filter(p => p.id !== id);
    saveState();
    renderPdfReports();
    showToast('Rapor başarıyla silindi.', 'info');
  }
};

/**
 * Toggle Dark/Light Theme
 */
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

/**
 * Reset System for New Year
 */
function handleResetSystem() {
  const passwordInput = prompt("Sistemi yeni yıl için sıfırlamak üzere lütfen yönetici parolasını girin:");
  
  if (passwordInput === null) return; // Canceled

  const ADMIN_PASS = 'uiz@=x*8C42oa^V1)D8c*Gn';
  if (passwordInput !== ADMIN_PASS) {
    showToast("Hatalı parola! Sıfırlama işlemi iptal edildi.", "error");
    return;
  }

  if (confirm("DİKKAT: Bu işlem tüm aidat ödemelerini, ek aidat tablolarını ve aylık giderleri KALICI OLARAK SİLECEKTİR. Sakin isimleri ve PDF rapor arşiviniz korunacaktır. Devam etmek istiyor musunuz?")) {
    // 1. Clear dues payments (Except Manager Room 13 who stays exempt and checked)
    state.apartments.forEach(apt => {
      apt.payments = {};
      if (apt.id === 13) {
        apt.isExempt = true;
        for (let m = 1; m <= 12; m++) {
          apt.payments[m] = true;
        }
      }
    });

    // 2. Clear extra collections
    state.extraCollections = [];

    // 3. Clear monthly expenses
    state.expenses = [];

    // Reset pending modifications
    pendingExtraPayments = null;
    pendingAidatPayments = null;

    saveState();
    initApp();
    updateAidatSaveBar();
    updateExtraSaveBar();
    closeModal('settingsModal');
    
    showToast("Sistem başarıyla sıfırlandı. Yeni yılınız kutlu olsun!", "success");
  }
}
