import React, { createContext, useReducer, useState, useEffect, useRef } from 'react';
import AppReducer from './AppReducer';
import axios from 'axios';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const initialState = {
  transactions: [],
  error: null,
  loading: true
}

export const GlobalContext = createContext(initialState);

export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);
  const [user, setUser] = useState(null);
  const isMounted = useRef(true);

  useEffect(() => {
    getTransactions();
  }, []);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (isMounted.current) {
        if (user) {
          setUser({
            uid: user.uid,
            displayName: user.email,
            email: user.email,
          });
        } else {
          setUser(null);
        }
      }
    });

    return () => {
      isMounted.current = false;
    };
  }, [isMounted]);

  async function getTransactions() {
    try {
      const res = await axios.get('/api/v1/transactions');

      dispatch({
        type: 'GET_TRANSACTIONS',
        payload: res.data.data
      });
    } catch (err) {
      dispatch({
        type: 'TRANSACTION_ERROR',
        payload: err.response.data.error
      });
    }
  }

  async function deleteTransaction(id) {
    try {
      await axios.delete(`/api/v1/transactions/${id}`);

      dispatch({
        type: 'DELETE_TRANSACTION',
        payload: id
      });
    } catch (err) {
      dispatch({
        type: 'TRANSACTION_ERROR',
        payload: err.response.data.error
      });
    }
  }

  async function addTransaction(transaction) {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    try {
      const res = await axios.post('/api/v1/transactions', transaction, config);

      dispatch({
        type: 'ADD_TRANSACTION',
        payload: res.data.data
      });
    } catch (err) {
      dispatch({
        type: 'TRANSACTION_ERROR',
        payload: err.response.data.error
      });
    }
  }

  return (
    <GlobalContext.Provider value={{
      transactions: state.transactions,
      error: state.error,
      loading: state.loading,
      user,
      getTransactions,
      deleteTransaction,
      addTransaction
    }}>
      {children}
    </GlobalContext.Provider>
  );
}
