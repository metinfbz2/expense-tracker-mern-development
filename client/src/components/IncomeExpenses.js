import React, { useContext, useEffect, useState, useRef } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { GlobalContext } from '../context/GlobalState';
import { numberWithCommas } from '../utils/format';

export const IncomeExpenses = () => {
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

  const amounts = filteredTransactionsMail.map(transaction => transaction.amount);

  const income = amounts
    .filter(item => item > 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2);

  const expense = (
    amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) *
    -1
  ).toFixed(2);

  return (
    <div className="inc-exp-container">
        <div>
          <h4>Gelir</h4>
  <p className="money plus">${numberWithCommas(income)}</p>
        </div>
        <div>
          <h4>Gider</h4>
  <p className="money minus">${numberWithCommas(expense)}</p>
        </div>
      </div>
  )
}
