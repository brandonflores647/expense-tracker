import { useState, useEffect } from 'react';
import './HistoryTransaction.css';

const HistoryTransaction = ({info, setTransList, setBalance, setIncome, setExpense}) => {

    const [del, setDel] = useState(null);

    useEffect(() => {
        if (del) {
            const valCheck = del.amount > 0 ? true : false; // true: positive, false: negative

            let newBal = info.balance;
            let newIncome = info.income;
            let newExpense = info.expense;
            if (valCheck) {
                newBal = info.balance - del.amount;
                setBalance(newBal);
                newIncome = info.income - del.amount;
                setIncome(newIncome);
            } else {
                newBal = info.balance + Math.abs(del.amount);
                setBalance(newBal);
                newExpense = info.expense + Math.abs(del.amount);
                setExpense(newExpense);
            }

            const newObj = {
                balance: newBal,
                income: newIncome,
                expense: newExpense,
                transList: info.transList
            }

            localStorage.setItem('expense-history', JSON.stringify(newObj));
            setTransList(info.transList);
        }
    }, [del])

    const handleDelete = (index) => {
        const item = info.transList.splice(index, 1);
        setDel(item[0]);
    }

    return (
        <div id='history-container'>
            <h2 className='container-title'>History</h2>
            <ul>
                {info ? info.transList.map((ele, i) => {
                    let check;
                    info.transList[i].amount < 0 ? check = 'neg' : check = 'pos'
                    return (
                        <div key={i} className='li-container'>
                            <li className={`trans-list ${check}`} onClick={() => handleDelete(info.transList.indexOf(ele))}>
                                <p>{info.transList[i].title}</p>
                                <p>{info.transList[i].amount < 0 ? '-' : '+'}
                                    ${info.transList[i].amount < 0 ? `${info.transList[i].amount}`.slice(1) : info.transList[i].amount}
                                </p>
                            </li>
                        </div>
                    )
                }) : null}
            </ul>
        </div>
    );
}

export default HistoryTransaction;
