import React, { useContext } from 'react';
import { GlobalContext } from '../context/GlobalState';
import { numberWithCommas } from '../utils/format';

export const Balance = () => {
  const { transactions, user } = useContext(GlobalContext);

  

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
