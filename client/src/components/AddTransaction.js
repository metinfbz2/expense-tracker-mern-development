import React, {useState, useContext, useEffect} from 'react'
import { GlobalContext } from '../context/GlobalState';

export const AddTransaction = () => {
  const [text, setText] = useState('');
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState(0);
  const {addTransaction, user } = useContext(GlobalContext);

  // Set the email state once user data is available
  useEffect(() => {
    if (user && user.email) {
      setEmail(user.email);
    }
  }, [user]);

  const onSubmit  = async e => {
     
   e.preventDefault(); // Prevent the default form submission behavior
    
    const newTransaction = {
      text,
      amount: +amount,
      email
    }
    
    await addTransaction(newTransaction); 
    // Clear the input fields after adding the transaction
    setText('');
    setAmount(0);   
  }

  return (
    <>
      <h3>Yeni İşlem</h3>
      <form onSubmit={onSubmit}>
        <div className="form-control">
          <label htmlFor="text">İşlem Adı</label>
          <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="İşlemin adı..." />
        </div>
        <div className="form-control">
          <label htmlFor="amount">Miktarı <br />
            (negatif - harcama, positif - gelir)</label
          >
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Miktarı..." />
        </div>
        <button className="btn">İşlemi İlave Et</button>
      </form>
    </>
  )
}
