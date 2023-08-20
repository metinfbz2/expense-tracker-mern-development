import React, { useContext, useEffect, useState, useRef } from 'react';
import { Transaction } from './Transaction';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { GlobalContext } from '../context/GlobalState';

export const TransactionList = () => {
  const { transactions, getTransactions } = useContext(GlobalContext);


  const [user, setUser] = useState(null); 
  const isMounted = useRef(true)
  useEffect(() => {
    getTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
 

  useEffect(() => {
    if (isMounted) {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        console.log('User object:', user); // Add this line
        if (user) {
          setUser({
            uid: user.uid,
            displayName: user.email,
            email: user.email,
          });
        } else {
          setUser(null);
        }
      });
    }
  
    return () => {
      isMounted.current = false;
    };
  }, [isMounted]);
  

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
