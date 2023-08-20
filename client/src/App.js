import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import PrivateRoute from './components/PrivateRoute'
import Main from './pages/Main'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import ForgotPassword from './pages/ForgotPassword'
import Expenses from './pages/Expenses'
function App() {
  return (
    <>
    
      <Router>
        <Routes>
          <Route path='/' element={<SignIn/>} />
            <Route path='/expenses' element={<PrivateRoute />}>
            <Route path='/expenses' element={<Expenses />} />
          </Route>
          <Route path='/sign-in' element={<SignIn />} />
          <Route path='/sign-up' element={<SignUp />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          </Routes>
    </Router>
    <ToastContainer/>
    </>
  );
}

export default App;
