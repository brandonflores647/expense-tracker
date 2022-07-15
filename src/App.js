import { useState, useEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Balance from './components/Balance';
import CompoundInterestForm from './components/CompoundInterestForm';
import HistoryTransaction from './components/HistoryTransaction';
import Navbar from './components/Navbar';

import './ExpenseForm.css'

function App() {

  let [balance, setBalance] = useState(0);
  let [income, setIncome] = useState(0);
  let [expense, setExpense] = useState(0);
  const [amount, setAmount] = useState(0);
  const [title, setTitle] = useState('');

  const [transList, setTransList] = useState([]);

  useEffect(() => {
    let storage = JSON.parse(localStorage.getItem('expense-history'));
    if (storage) {
      setBalance(storage.balance);
      setIncome(storage.income);
      setExpense(storage.expense);
      setTransList(storage.transList);
    }
  }, [])

  const handleNewTransaction = async (e) => {
    e.preventDefault();
    if (title && amount) {
      transList.unshift({
        title,
        amount: parseFloat(amount, 10),
      });
      setBalance(balance += parseFloat(amount, 10));
      if (amount > 0) {
        setIncome(income += parseFloat(amount, 10));
      } else {
        setExpense(expense += parseFloat(amount, 10));
      }
      setTitle('');
      setAmount(0);

      const obj = {
        balance: Math.round((balance + Number.EPSILON)*100)/100,
        income: Math.round((income + Number.EPSILON)*100)/100,
        expense: Math.round((expense + Number.EPSILON)*100)/100,
        transList
      }

      localStorage.setItem('expense-history', JSON.stringify(obj));
    }
  }

  return (
    <>
    <Navbar />
    <div id='content-wrapper'>
    <Switch>
      <Route exact path='/'>
        <h1>Home</h1>
      </Route>
      <Route exact path='/expense-tracker'>
        <div className='page-container'>

        <h1 className='container-title'>Expense Tracker</h1>

        <Balance bal={balance} income={income} expense={expense}/>

        <div id='expense-form-container'>
          <h2 className='container-title'>Add new transaction</h2>
          <form id='expense-form' onSubmit={handleNewTransaction}>
            <div id='expense-form-inputs'>
              <label>Title</label>
              <input
                type='text'
                placeholder='Enter title ...'
                className='input-field'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                />
              <label>Amount</label>
              <div>
                <input
                  type='number'
                  placeholder='0'
                  className='input-field'
                  value={amount}
                  step='0.1'
                  onChange={(e) => setAmount(e.target.value)}
                />
                <section id='amount-desc-container'>
                  <p>positive - income</p>
                  <p>negative - expense</p>
                </section>
              </div>
            </div>
            <button id={`submit-expense-form-button${!title || !amount ? '-err' : ''}`} type='submit'>Submit</button>
          </form>
        </div>

        <HistoryTransaction info={JSON.parse(localStorage.getItem('expense-history'))} setTransList={setTransList} setBalance={setBalance} setIncome={setIncome} setExpense={setExpense}/>
        </div>
      </Route>
      <Route exact path='/compound-interest'>
          <h1 className='container-title page-container'>Compound Interest Calculator</h1>
          <CompoundInterestForm />
      </Route>
      <Route>
        <Redirect to='/' />
      </Route>
    </Switch>
    </div>
    </>
  );
}

export default App;
