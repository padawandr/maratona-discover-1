const Modal = {
	
	overlay: document.querySelector('.modal-overlay'),
	
	toggle() {
		this.overlay.classList.toggle('active');
	}
	
};

const Storage = {

	get() {
		return (JSON.parse(localStorage.getItem('dev.finances:transactions')) || []);
	},

	set(transactions) {
		localStorage.setItem('dev.finances:transactions', JSON.stringify(transactions));
	}

};

const Balance = {

	incomes() {
		let result = 0;
		for (let transaction of Transaction.all) {
			if (transaction.amount > 0) {
				result += transaction.amount;
			}
		}
		return result;
	},

	expenses() {
		let result = 0;
		for (let transaction of Transaction.all) {
			if (transaction.amount < 0) {
				result += transaction.amount;
			}
		}
		return result;
	},

	total() {
		return (Balance.incomes() + Balance.expenses());
	},

	update() {
		document.querySelector('#incomes-display')
			.textContent = Utils.formatBRL(this.incomes());
		document.querySelector('#expenses-display')
			.textContent = Utils.formatBRL(this.expenses());
		document.querySelector('#total-display')
			.textContent = Utils.formatBRL(this.total());
	}

};

const Transaction = {

	all: Storage.get(),

	container: document.querySelector('#data-table tbody'),

	create({ description, amount, date }, index) {
		const type = (amount < 0) ? 'expense' : 'income';
		const tr = document.createElement('tr');
		tr.dataset.index = index;
		tr.innerHTML = `
			<td class="description">${description}</td>
			<td class="${type}">${Utils.formatCurrency(amount)}</td>
			<td class="date">${date}</td>
			<td>
				<img src="./assets/minus.svg" alt="remover transação" onclick="Transaction.remove('${index}')">
			</td>
		`;
		this.container.append(tr);
	},

	add(transaction) {
		Transaction.all.push(transaction);
		App.reload();
	},

	remove(index) {
		Transaction.all.splice(index, 1);
		App.reload();
	},

	clear() {
		this.container.innerHTML = '';
	}

};

const Utils = {

	formatAmount(amount, flow) {
		return (flow === 'deposit') ? Math.round(amount * 100) : Math.round(amount * -100);
	},

	formatDate(date) {
		const splitDate = date.split('-');
		return `${splitDate[2]}/${splitDate[1]}/${splitDate[0]}`;
	},

	formatCurrency(amount) {
		return (amount / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
	},

	formatBRL(amount) {
		return (amount / 100).toLocaleString('pt-BR', {
			style: 'currency',
			currency: 'BRL'
		});
	}

};

const Form = {

	form: document.querySelector('form'),
	description: document.querySelector('input#description'),
	amount: document.querySelector('input#amount'),
	cashFlow: document.querySelectorAll('input[type=radio]'),
	date: document.querySelector('input#date'),

	getValues() {
		let flow;
		for (let prop of this.cashFlow) {
			if (prop.checked === true) {
				flow = prop.value;
			}
		}

		return {
			description: this.description.value,
			amount: this.amount.value,
			flow,
			date: this.date.value
		};
	},

	submit(event) {
		event.preventDefault();

		try {
			this.validateFields();
			const transaction = this.validateValues();
			Transaction.add(transaction);
			this.form.reset();
			Modal.toggle();
		} catch (error) {
			alert(error.message);
		}
	},

	validateFields() {
		const { description, amount, date } = this.getValues();
		if (description.trim() === '' || amount.trim() === '' || date.trim() === '') {
			throw new Error('Por favor, preencha todos os campos');
		}
	},

	validateValues() {
		let { description, amount, flow, date } = this.getValues();
		amount = Utils.formatAmount(Math.abs(amount), flow);
		date = Utils.formatDate(date);
		return {
			description,
			amount,
			date
		};
	}

};

const App = {

	init() {
		Transaction.all.forEach((transaction, index) => {
			Transaction.create(transaction, index);
		});
		Balance.update();
		Storage.set(Transaction.all);
	},

	reload() {
		Transaction.clear();
		this.init();
	}

};

App.init();
