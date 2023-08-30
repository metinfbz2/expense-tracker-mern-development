import React, { useContext, useState, useEffect } from 'react';
import { Transaction } from './Transaction';
import { GlobalContext } from '../context/GlobalState';

export const TransactionList = () => {
  const { transactions, user } = useContext(GlobalContext);
  const [filteredTransactions, setFilteredTransactions] = useState([]);

  useEffect(() => {
    // Filter transactions based on user's email
    const filteredByUser = transactions.filter(transaction => user && user.email && transaction.email === user.email);
    
    // Get the current month
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    
    // Filter transactions by current month
    const filteredByMonth = filteredByUser.filter(transaction => {
      const transactionDate = new Date(transaction.createdAt);
      const transactionMonth = transactionDate.getMonth() + 1;
      return transactionMonth === currentMonth;
    });

    // Sort transactions by createdAt
    const sortedTransactions = filteredByMonth.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    // Update the state with filtered and sorted transactions
    setFilteredTransactions(sortedTransactions);
  }, [transactions, user]);

  return (
    <>
      <h2 style={{ display: 'inline' }}>İşlemler Geçmişi </h2>
      <h5 style={{ display: 'inline', marginLeft: '10px' }}>
        {user && user.email ? `(${user.email})` : ''} </h5>
      <ul className="list">
        {filteredTransactions.map(transaction => (
          <Transaction key={transaction._id} transaction={transaction} />
        ))}
      </ul>
    </>
  );
};
