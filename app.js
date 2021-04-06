const Modal = {
	overlay: document.querySelector('.modal-overlay'),
	toggle() {
		this.overlay.classList.toggle('active');
	}
};

const Balance = {
	incomes() {
		let result = 0;
		for (let transaction of transactions) {
			if (transaction.amount > 0) {
				result += transaction.amount;
			}
		}
		return (result / 100);
	},
	expenses() {
		let result = 0;
		for (let transaction of transactions) {
			if (transaction.amount < 0) {
				result += transaction.amount;
			}
		}
		return (result / 100);
	},
	total() {
		let result = 0;
		for (let transaction of transactions) {
			result += transaction.amount;
		}
		return (result / 100);
	},
	update() {
		document.querySelector('#incomes-display')
			.textContent = this.incomes().toLocaleString('pt-BR', {
				style: 'currency',
				currency: 'BRL'
			});
		document.querySelector('#expenses-display')
			.textContent = this.expenses().toLocaleString('pt-BR', {
				style: 'currency',
				currency: 'BRL'
			});
		document.querySelector('#total-display')
			.textContent = this.total().toLocaleString('pt-BR', {
				style: 'currency',
				currency: 'BRL'
			});
	}
};

const Transaction = {
	transactionContainer: document.querySelector('#data-table tbody'),
	createTransaction({ description, amount, date }) {
		const transactionType = (amount < 0) ? 'expense' : 'income';
		const tr = document.createElement('tr');
		amount = (Math.abs(amount) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
		tr.innerHTML = `
			<td class="description">${description}</td>
			<td class="${transactionType}">${amount}</td>
			<td class="date">${date}</td>
			<td><img src="./assets/minus.svg" alt="remover transação"></td>
		`;
		this.transactionContainer.append(tr);
	}
};

const transactions = [
	{
		id: 1,
		description: 'Luz',
		amount: -500_12,
		date: '23/01/2021'
	},
	{
		id: 2,
		description: 'Criação website',
		amount: 5000_00,
		date: '24/01/2021'
	},
	{
		id: 3,
		description: 'Internet',
		amount: -200_34,
		date: '26/01/2021'
	}
];

const newTransaction = document.querySelector('.new');
const cancelTransaction = document.querySelector('.cancel');

newTransaction.addEventListener('click', () => {
	Modal.toggle();
});

cancelTransaction.addEventListener('click', () => {
	Modal.toggle();
});

// add transactions to table
for (let transaction of transactions) {
	Transaction.createTransaction(transaction);
}

Balance.update();
