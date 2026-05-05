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
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

function updateUI() {
    expenseList.innerHTML = '';
    let total = 0;

    expenses.forEach((expense) => {
        const li = document.createElement('li');
        li.innerHTML = `<span><strong>${expense.name}</strong></span> <span>$${expense.amount}</span>`;
        expenseList.appendChild(li);
        
        /**
         * Task 6: Develop logic to calculate and display Total Expenses (Don)
         */
        total += parseFloat(expense.amount);
    });

    totalAmountDisplay.innerText = total.toFixed(2);
}

expenseForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newExpense = {
        name: document.getElementById('expense-name').value,
        amount: document.getElementById('expense-amount').value,
        category: document.getElementById('expense-category').value,
        date: document.getElementById('expense-date').value
    };
    expenses.push(newExpense);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    expenseForm.reset();
    updateUI();
});

/**
 * Task 9: Implement category-based filtering (James - Currently in Backlog)
 * Note: Logic to be expanded in Phase 2.
 */

updateUI();
