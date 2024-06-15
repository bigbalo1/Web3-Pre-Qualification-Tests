document.addEventListener('DOMContentLoaded', () => {
    const transactionForm = document.getElementById('transaction-form');
    const transactionList = document.getElementById('transaction-list');
    const ctx = document.getElementById('incomeExpenseChart').getContext('2d');

    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

    transactionForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const type = document.getElementById('type').value;
        const category = document.getElementById('category').value;
        const amount = document.getElementById('amount').value;

        const transaction = {
            id: generateID(),
            type,
            category,
            amount: +amount,
            date: new Date().toLocaleDateString()
        };

        transactions.push(transaction);
        localStorage.setItem('transactions', JSON.stringify(transactions));

        addTransactionToDOM(transaction);
        updateChart();
        transactionForm.reset();
    });

    function generateID() {
        return Math.floor(Math.random() * 1000000);
    }

    function addTransactionToDOM(transaction) {
        const item = document.createElement('li');
        item.classList.add(transaction.type === 'income' ? 'income' : 'expense');

        item.innerHTML = `
            ${transaction.date} - ${transaction.category}: ₦${transaction.amount} <span>(${transaction.type})</span>
            <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
        `;

        transactionList.appendChild(item);
    }

    function removeTransaction(id) {
        transactions = transactions.filter(transaction => transaction.id !== id);
        localStorage.setItem('transactions', JSON.stringify(transactions));
        init();
        updateChart();
    }

    window.removeTransaction = removeTransaction;

    function init() {
        transactionList.innerHTML = '';
        transactions.forEach(addTransactionToDOM);
        updateChart();
    }

    function updateChart() {
        const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
        const expense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);

        const chartData = {
            labels: ['Income', 'Expense'],
            datasets: [{
                label: 'Income vs Expense',
                data: [income, expense],
                backgroundColor: ['#28a745', '#dc3545'],
            }]
        };

        if (window.incomeExpenseChart) {
            window.incomeExpenseChart.data = chartData;
            window.incomeExpenseChart.update();
        } else {
            window.incomeExpenseChart = new Chart(ctx, {
                type: 'doughnut',
                data: chartData
            });
        }
    }

    init();
});
