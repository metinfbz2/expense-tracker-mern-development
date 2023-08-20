import React, { useContext, useRef, useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { GlobalContext } from '../context/GlobalState';
import { numberWithCommas } from '../utils/format';

export const Balance = () => {
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

  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);

  return (
    <>
      <h4>Bakiyeniz</h4>
    <h1>${numberWithCommas(total)}</h1>
    </>
  )
}
