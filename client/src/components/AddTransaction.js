import React, {useState, useContext} from 'react'
import { GlobalContext } from '../context/GlobalState';

export const AddTransaction = () => {
  const [text, setText] = useState('');
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState(0);
  const {addTransaction, user } = useContext(GlobalContext);

  const onSubmit = e => {
    e.preventDefault();

    const newTransaction = {
      text,
      amount: +amount,
      email
    }
    setEmail(user.email)
    addTransaction(newTransaction);
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
          <label htmlFor="amount"
            >Miktarı <br />
            (negatif - harcama, positif - gelir)</label
          >
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Miktarı..." />
        </div>
        <button className="btn">İşlemi İlave Et</button>
      </form>
    </>
  )
}
