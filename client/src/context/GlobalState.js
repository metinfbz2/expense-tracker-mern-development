import React, { createContext, useReducer, useEffect, useState, useRef } from 'react';
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
  const [user, setUser] = useState(null); // Updated initial state
  const isMounted = useRef(true);

  useEffect(() => {
    if (isMounted.current) {
      getTransactions();
    }
    return () => {
      isMounted.current = false;
    };
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
  }, []); // Removed isMounted dependency from here

  async function getTransactions() {
    try {
      const res = await axios.get('https://firestore.googleapis.com/v1/projects/myexpenses-692cf/databases/(default)/documents/expenses');
      const documents = res.data.documents;
      
      const convertedData = documents.map(doc => ({
        text: doc.fields.text.stringValue,
        amount: doc.fields.amount.doubleValue,
        email: doc.fields.email.stringValue,
        createdAt: doc.createTime,
        _id: doc.name.split('/').pop()
      }));
      
      dispatch({
        type: 'GET_TRANSACTIONS',
        payload: convertedData
      });
    } catch (err) {
      dispatch({
        type: 'TRANSACTION_ERROR',
        payload: "error"
      });
    }
  }

  async function deleteTransaction(documentId) {
    try {
      await axios.delete(`https://firestore.googleapis.com/v1/projects/myexpenses-692cf/databases/(default)/documents/expenses/${documentId}`);

      dispatch({
        type: 'DELETE_TRANSACTION',
        payload: documentId
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
    };
    
    const transactionConverted = {
      fields: {
        text: { stringValue: transaction.text },
        amount: { doubleValue: transaction.amount },
        email: { stringValue: user.email }
      }
    };
    
    try {
      const res = await axios.post(
        'https://firestore.googleapis.com/v1/projects/myexpenses-692cf/databases/(default)/documents/expenses',
        transactionConverted,
        config
      );
      
      const doc = res.data.fields;
      
      const convertedData = {
        text: doc.text.stringValue,
        amount: doc.amount.doubleValue,
        email: user.email,
        createdAt: res.data.createTime,
        _id: res.data.name.split('/').pop()
      };
      
      dispatch({
        type: 'ADD_TRANSACTION',
        payload: convertedData
      });
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        // Handle the error based on the structure of the error response
        const errorMessages = err.response.data.error.errors.map(error => error.message);
        
        dispatch({
          type: 'TRANSACTION_ERROR',
          payload: errorMessages
        });
      } else {
        dispatch({
          type: 'TRANSACTION_ERROR',
          payload: 'An error occurred while fetching transactions.'
        });
      }
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
