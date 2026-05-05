/**
 * Task 1: Initialize Git repository and project file structure (Brenden)
 */

const expenseForm = document.getElementById('expense-form');
const expenseList = document.getElementById('expense-list');
const totalAmountDisplay = document.getElementById('total-amount');
const clearAllBtn = document.getElementById('clear-all');

/**
 * Task 5: Write JavaScript logic for LocalStorage Save/Load (James)
 */
let expenses = JSON.parse(localStorage.getItem('expenses')) || []; /* load saved expenses from localStorage or start empty if none exist */

/* Brenden: Track which expense is being edited (null = adding new) */
let editingId = null;

/* ── Phase 2: New DOM references ─────────────────────────────── */
const searchInput       = document.getElementById('search-input');
const filterCategory    = document.getElementById('filter-category');
const openReportBtn     = document.getElementById('open-report-btn');
const reportModal       = document.getElementById('report-modal');
const closeReportBtn    = document.getElementById('close-report-btn');
const reportBody        = document.getElementById('report-body');
const reportTotalCell   = document.getElementById('report-total');
const downloadCsvBtn    = document.getElementById('download-csv-btn');
const printPdfBtn       = document.getElementById('print-pdf-btn');
const weekTotalEl       = document.getElementById('week-total');
const monthTotalEl      = document.getElementById('month-total');
const yearTotalEl       = document.getElementById('year-total');

/**
 * James: Calculate spending totals for weekly, monthly, and yearly summary cards.
 */
function calcSummaryTotals() {
    const now = new Date();                                         /* set now to today's date */
    const todayStr = now.toISOString().slice(0, 10);            /* format as YYYY-MM-DD for comparison with expense dates */

    /* Start of this week (Sunday) */
    const weekStart = new Date(now);                                       /* clone current date so original stays unchanged */
    weekStart.setDate(now.getDate() - now.getDay());                   /* move back to the most recent Sunday */
    weekStart.setHours(0, 0, 0, 0);                         /* set time to midnight at week start */

    let weekTotal = 0, monthTotal = 0, yearTotal = 0; /* initialize summary totals */

    expenses.forEach(ex => {
        const d = new Date(ex.date + 'T00:00:00'); /* parse stored expense date as a Date object */
        const amt = parseFloat(ex.amount);          /* convert stored amount string to a number */
        if (d >= weekStart) weekTotal += amt;       /* add amount to weekly total for dates in current week */
        if (d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) monthTotal += amt; /* add amount to monthly total for current month */
        if (d.getFullYear() === now.getFullYear()) yearTotal += amt; /* add amount to yearly total for current year */
    });

    if (weekTotalEl)  weekTotalEl.textContent  = '$' + weekTotal.toFixed(2);  /* show weekly total if element exists */
    if (monthTotalEl) monthTotalEl.textContent = '$' + monthTotal.toFixed(2); /* show monthly total if element exists */
    if (yearTotalEl)  yearTotalEl.textContent  = '$' + yearTotal.toFixed(2);  /* show yearly total if element exists */
}

function updateUI() {
    expenseList.innerHTML = '';
    let total = 0;

    /* Brenden: Search bar — filter by keyword string matching */
    const keyword = searchInput ? searchInput.value.trim().toLowerCase() : '';
    /* Brenden: Category filter — show only selected category */
    const selectedCat = filterCategory ? filterCategory.value : 'All';

    const filtered = expenses.filter(ex => {
        const matchesKeyword = ex.name.toLowerCase().includes(keyword) ||
                               ex.category.toLowerCase().includes(keyword) ||
                               ex.date.includes(keyword);
        const matchesCat = selectedCat === 'All' || ex.category === selectedCat;
        return matchesKeyword && matchesCat;
    });

    filtered.forEach((expense) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span><strong>${expense.name}</strong> <em style="color:#888;font-size:0.85em">[${expense.category}]</em> &mdash; ${expense.date}</span>
            <span style="display:flex;align-items:center;gap:8px;">
                <strong>$${expense.amount}</strong>
                <!-- Brenden: editExpense() button — populates form with existing data -->
                <button class="edit-btn" data-id="${expense.id}" style="background:#007bff;color:#fff;border:none;padding:3px 8px;border-radius:4px;cursor:pointer;">Edit</button>
                <!-- Brenden: deleteExpense() button — removes item and updates localStorage -->
                <button class="delete-btn" data-id="${expense.id}" style="background:#ff4444;color:#fff;border:none;padding:3px 8px;border-radius:4px;cursor:pointer;">Delete</button>
            </span>`;
        expenseList.appendChild(li);

        /**
         * Task 6: Develop logic to calculate and display Total Expenses (Don)
         */
        total += parseFloat(expense.amount);
    });

    totalAmountDisplay.innerText = total.toFixed(2);

    /* James: Update spending summary cards */
    calcSummaryTotals();

    /* Brenden: Edge case — app doesn't crash if no data exists */
    if (filtered.length === 0) {
        const empty = document.createElement('li');
        empty.textContent = 'No expenses found.';
        empty.style.color = '#888';
        expenseList.appendChild(empty);
    }
}

expenseForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameVal = document.getElementById('expense-name').value.trim();
    const amountVal = document.getElementById('expense-amount').value.trim();
    const dateVal = document.getElementById('expense-date').value;

    /* Brenden: Edge case check — don't save if required fields empty */
    if (!nameVal || !amountVal || !dateVal) return;

    if (editingId !== null) {
        /* Brenden: editExpense() — update existing record */
        const idx = expenses.findIndex(ex => ex.id === editingId);
        if (idx !== -1) {
            expenses[idx] = {
                id: editingId,
                name: nameVal,
                amount: parseFloat(amountVal).toFixed(2),
                category: document.getElementById('expense-category').value,
                date: dateVal
            };
        }
        editingId = null;
        document.querySelector('#expense-form button[type="submit"]').textContent = 'Add Expense';
    } else {
        const newExpense = {
            /* Brenden: Unique ID generator using Date.now() */
            id: Date.now(),
            name: nameVal,
            amount: parseFloat(amountVal).toFixed(2),
            category: document.getElementById('expense-category').value,
            date: dateVal
        };
        expenses.push(newExpense);
    }

    localStorage.setItem('expenses', JSON.stringify(expenses));
    expenseForm.reset();
    updateUI();
});

/**
 * Task 9: Implement category-based filtering (James - Phase 2 complete below)
 */

updateUI();

/* ═══════════════════════════════════════════════════════════════
   PHASE 2 — New Feature Logic
   ═══════════════════════════════════════════════════════════════ */

/**
 * Brenden: deleteExpense() — remove item from list and update localStorage.
 * Brenden: editExpense()   — populate form with existing data for updates.
 */
expenseList.addEventListener('click', (e) => {
    const id = parseInt(e.target.dataset.id);

    if (e.target.classList.contains('delete-btn')) {
        /* Brenden: deleteExpense() */
        expenses = expenses.filter(ex => ex.id !== id);
        localStorage.setItem('expenses', JSON.stringify(expenses));
        updateUI();
    }

    if (e.target.classList.contains('edit-btn')) {
        /* Brenden: editExpense() — populate form with existing data */
        const ex = expenses.find(ex => ex.id === id);
        if (!ex) return;
        document.getElementById('expense-name').value     = ex.name;
        document.getElementById('expense-amount').value   = ex.amount;
        document.getElementById('expense-category').value = ex.category;
        document.getElementById('expense-date').value     = ex.date;
        editingId = ex.id;
        document.querySelector('#expense-form button[type="submit"]').textContent = 'Update Expense';
        document.getElementById('expense-name').focus();
    }
});

/**
 * Brenden: Data Reset button — clears all logs from localStorage securely.
 */
clearAllBtn.addEventListener('click', () => {
    if (!confirm('Are you sure you want to clear all expense data? This cannot be undone.')) return;
    expenses = [];
    localStorage.removeItem('expenses');
    editingId = null;
    expenseForm.reset();
    document.querySelector('#expense-form button[type="submit"]').textContent = 'Add Expense';
    updateUI();
});

/**
 * Brenden: Search bar — live filter as user types.
 */
if (searchInput) {
    searchInput.addEventListener('input', updateUI);
}

/**
 * Brenden: Category filter — re-render list on selection change (Phase 2).
 */
if (filterCategory) {
    filterCategory.addEventListener('change', updateUI);
}

/**
 * James: Open Report Preview modal.
 * Don: Detailed Report view layout is the #report-table in index.html.
 */
if (openReportBtn) {
    openReportBtn.addEventListener('click', () => {
        populateReportTable(expenses);
        reportModal.style.display = 'flex';
    });
}

if (closeReportBtn) {
    closeReportBtn.addEventListener('click', () => {
        reportModal.style.display = 'none';
    });
}

/* Close modal when clicking the backdrop */
if (reportModal) {
    reportModal.addEventListener('click', (e) => {
        if (e.target === reportModal) reportModal.style.display = 'none';
    });
}

/**
 * James: populateReportTable() — renders expense data into the report preview
 *        table so users can review before downloading.
 */
function populateReportTable(data) {
    reportBody.innerHTML = '';
    let total = 0;
    data.forEach(ex => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${ex.date}</td>
            <td>${ex.name}</td>
            <td>${ex.category}</td>
            <td>$${parseFloat(ex.amount).toFixed(2)}</td>`;
        reportBody.appendChild(tr);
        total += parseFloat(ex.amount);
    });
    reportTotalCell.textContent = '$' + total.toFixed(2);
}

/**
 * Don: Convert expense array to CSV string and trigger file download.
 *      Uses the Blob API for file generation (James: jsPDF/Blob integration task).
 */
if (downloadCsvBtn) {
    downloadCsvBtn.addEventListener('click', () => {
        /* Don: Build CSV string */
        const headers = ['Date', 'Name', 'Category', 'Amount'];
        const rows = expenses.map(ex => [
            ex.date,
            `"${ex.name.replace(/"/g, '""')}"`,
            ex.category,
            ex.amount
        ]);
        const csvContent = [headers, ...rows].map(r => r.join(',')).join('\n');

        /* Don: Blob-based file generation — Download CSV trigger */
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement('a');
        a.href     = url;
        a.download = `expense-report-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    });
}

/**
 * Don: Print to PDF feature using window.print().
 */
if (printPdfBtn) {
    printPdfBtn.addEventListener('click', () => {
        window.print();
    });
}

/**
 * Don: Real-time input masking on the amount field —
 *      strips non-numeric characters and auto-formats to 2 decimal places on blur.
 */
const amountInput = document.getElementById('expense-amount');
if (amountInput) {
    amountInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^0-9.]/g, '');
        const parts = e.target.value.split('.');
        if (parts.length > 2) e.target.value = parts[0] + '.' + parts.slice(1).join('');
    });

    amountInput.addEventListener('blur', (e) => {
        const val = parseFloat(e.target.value);
        if (!isNaN(val)) e.target.value = val.toFixed(2);
    });
}
