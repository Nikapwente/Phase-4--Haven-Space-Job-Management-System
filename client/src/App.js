import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login'
import Home from './components/Home'
import { useState } from 'react';
import SignUp from './components/SignUp';

function App() {


  const [userData, setUserData] = useState(null);

  const handleLogin = (data) => {
    setUserData(data);
  };


  return (
    <Router >
      <div>
        <div className="contaniner d-flex flex-column">
          {/* <NavBar /> */}
          <Routes >
            <Route path="/" element={<Login onLogin={handleLogin}/>} />
            <Route path="/login" element={<Login onLogin={handleLogin}/>} />
            <Route path="/home" element={<Home selectedUser={userData}/>} />
            <Route path="/signup" element={<SignUp selectedUser={userData}/>} />
          </Routes>
          {/* <Footer /> */}
        </div>
      </div>
    </Router>
  );


}

export default App;
