import React, { useContext } from 'react';
import { Transaction } from './Transaction';
import { GlobalContext } from '../context/GlobalState';

export const TransactionList = () => {
  const { transactions, user } = useContext(GlobalContext);


  

  const filteredTransactionsMail = transactions.filter(transaction => {
    return user && user.email && transaction.email === user.email;
  });
  
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  
  const filteredTransactionsThisMonth = filteredTransactionsMail.filter(transaction => {
    const transactionDate = new Date(transaction.createdAt);
    const transactionMonth = transactionDate.getMonth() + 1;
    
    return transactionMonth === currentMonth;
  });


  return (
    <>
     <h2 style={{ display: 'inline' }}>İşlemler Geçmişi </h2>
      <h5 style={{ display: 'inline', marginLeft: '10px' }}>
        {user && user.email ? `(${user.email})` : ''} </h5>
      <ul className="list">
        {filteredTransactionsThisMonth.map(transaction => (<Transaction key={transaction._id} transaction={transaction} />))}
      </ul>
    </>
  )
}
