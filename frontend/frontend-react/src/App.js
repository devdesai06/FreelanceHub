import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import FreelancerAbout from './pages/Freelancer/AboutPageFreelancer.jsx'
import ClientAbout from './pages/Client/AboutPageClient.jsx'
import Home from "./pages/Home";
import ClientProfile from "./pages/Profiles/ClientProfile";
import FreelancerProfile from "./pages/Profiles/freelancerProfile";
import FreelancerSettings from "./pages/Freelancer/SettingsFreelancer.jsx"
import ClientSettings from "./pages/Client/SettingsClient.jsx"
import ViewBids from "./pages/Client/seeProjects.jsx";
import ApplyProject from "./pages/Freelancer/ApplyProject.jsx";
import FreelancerPage from "./pages/Freelancer/BrowseProjects.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AppContextProvider } from "./context/Appcontext";
import FreelancerProjectView from "./pages/Freelancer/FreelancerProjectView.jsx";
function App() {
  console.log(">BACKEND_URL:", process.env.REACT_APP_BACKEND_URL);

  return (

    <Router>
      <AppContextProvider>
        <ToastContainer />
        <main className="main-content">

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="browseProjects" element={<FreelancerPage />} />
            <Route path="/profile/client" element={<ClientProfile />} />
            <Route path="/about/freelancer" element={<FreelancerAbout />} />
            <Route path="/settings/freelancer" element={<FreelancerSettings />} />
            <Route path="/settings/client" element={<ClientSettings />} />
            <Route path="/about/client" element={<ClientAbout />} />
            <Route path="/seeProject/:projectId" element={<ViewBids />} />
            <Route path="/profile/freelancer" element={<FreelancerProfile />} />
            <Route path="/apply/:projectId" element={<ApplyProject />} />
            Route
            <Route
              path="/freelancer/project/:projectId"
              element={<FreelancerProjectView />}
            />
            <Route path="*" element={<h1>404 - Page Not Found</h1>} />
          </Routes>
        </main>
      </AppContextProvider>
    </Router>
  );
}

export default App;
