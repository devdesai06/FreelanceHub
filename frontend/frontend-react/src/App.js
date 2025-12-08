import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Home from "./pages/Home";
import ClientProfile from './pages/Profiles/ClientProfile'
import FreelancerProfile from './pages/Profiles/freelancerProfile'

import ApplyProject from './pages/Freelancer/ApplyProject.jsx'
import FreelancerPage from './pages/Freelancer/BrowseProjects.jsx'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AppContextProvider } from "./context/Appcontext";

function App() {
  return (
    <Router>
      <AppContextProvider>
        <ToastContainer />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path='browseProjects' element={<FreelancerPage />} />
            <Route path="/profile/client" element={<ClientProfile />} />
            <Route path="/profile/freelancer" element={<FreelancerProfile />} />
            <Route path="/apply/:projectId" element={<ApplyProject />} />

            <Route path="*" element={<h1>404 - Page Not Found</h1>} />
          </Routes>
        </main>
      </AppContextProvider>
    </Router>
  );
}

export default App;
