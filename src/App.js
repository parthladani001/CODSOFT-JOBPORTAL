import './App.css';
import ProtectedRoute from './ProtectedRoute';
import React, { useState } from 'react';
import LoadingBar from 'react-top-loading-bar';

// COMPONENTS
import Navbar from './comp/Navbar';
import Login from './comp/Login';
import CandidateDashboard from './comp/CandidateDashboard';
import EmployerDashboard from './comp/EmployerDashboard';
import Home from './comp/Home';
import JobApplication from './comp/JobApplication';
import EmployerLogin from './comp/EmployerLogin';
import CandidateSignUp from './comp/CandidateSignUp';
import EmployerSignUp from './comp/EmployerSignUp';
import ChangeEmpPass from './comp/ChangeEmpPass';
import ChangePassword from './comp/ChangePassword';
import BrowseJob from './comp/BrowseJob';
import UpdateCndData from './comp/UpdateCndData';
import ViewJobDetails from './comp/ViewJobDetails';
import HireMail from './comp/HireMail';
import ContactUs from './comp/ContactUs';
import Img404 from './images/404.gif';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

function App() {
  // Implementation of Dark & Light mode
  const [mode, setMode] = useState('light');
  const toggleMode = () => {
    if (mode === 'light') {
      setMode('dark');
      document.body.style.backgroundColor = '#343a40';
    } else {
      setMode('light');
      document.body.style.backgroundColor = 'white';
    }
  }

  // Implementation of loading line
  const [progress] = useState(0);

  // Creating hook
  const [user, setUser] = useState(false);

  // Function login
  const login = () => {
    setUser(true)
  }

  // Function logout
  const logout = () => {
    setUser(false)
    localStorage.removeItem("employer");
    localStorage.removeItem("candidate");
    localStorage.removeItem("employerId");
    localStorage.removeItem("jobId");
  }

  return (
    <>
      <Router basename="CODSOFT-JOBIFY">
        <Navbar mode={mode} toggleMode={toggleMode} setProgress={progress} user={user} login={login} logout={logout} />
        <LoadingBar color='#fc0000' progress={100} />

        <Routes>
          <Route exact path='*'
            element={
              <div className='text-center'>
                <img className="mt-5 ms-5" src={Img404} width="300" height="300" alt="Error 404" />
                <h2 className='text-danger mt-2'>
                  404 : Page Not Found
                </h2>
              </div>}
          />

          {/* OPEN ROUTES START */}
          <Route exact path='/' element={<Home mode={mode} />} />
          <Route exact path='/Jobify' element={<Home mode={mode} />} />
          <Route exact path='/login' element={<Login mode={mode} login={login} />} />
          <Route exact path='/employerLogin' element={<EmployerLogin mode={mode} login={login} />} />
          <Route exact path='/candidateSignUp' element={<CandidateSignUp mode={mode} />} />
          <Route exact path='/employerSignUp' element={<EmployerSignUp mode={mode} />} />
          <Route exact path='/changeEmpPass' element={<ChangeEmpPass mode={mode} />} />
          <Route exact path='/changePass' element={<ChangePassword mode={mode} />} />
          <Route exact path='/browseJob' element={<BrowseJob mode={mode} />} />
          <Route exact path='/contactUs' element={<ContactUs mode={mode} />} />
          {/* OPEN ROUTES END */}

          {/* PROTECTED ROUTES START */}
          <Route element={<ProtectedRoute user={user} />} >
            <Route path='/employerDashboard' element={<EmployerDashboard mode={mode} />} />
            <Route path='/candidateDashboard' element={<CandidateDashboard mode={mode} />} />
            <Route path='/updateCndData' element={<UpdateCndData mode={mode} />} />
            <Route path='/jobApplication' element={<JobApplication mode={mode} />} />
            <Route path="/viewJobDetails" element={<ViewJobDetails mode={mode} />} />
            <Route path="/hireMail" element={<HireMail mode={mode} />} />
          </Route>
          {/* PROTECTED ROUTES END */}
          
        </Routes>
      </Router>
    </>
  );
}

export default App;