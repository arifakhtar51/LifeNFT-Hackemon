import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RoleProvider } from './contexts/RoleContext';
import { DonationProvider } from './contexts/DonationContext';
import { HospitalProvider } from './contexts/HospitalContext';
import Navbar from './components/Navbar';
import { Home } from './pages/Home';
import UserDashboard from './pages/UserDashboard';
import HospitalDashboard from './pages/HospitalDashboard';
import GovernmentDashboard from './pages/GovernmentDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import { Explore } from './pages/Explore';
import { VerifyDonation } from './pages/VerifyDonation';
import { RedeemNFT } from './pages/RedeemNFT';
import { ManageHospitals } from './pages/ManageHospitals';
import NFTPage from './pages/NFTPage';
import ReportsPage from './pages/ReportsPage';
import './styles/custom.css';

function App() {
  return (
    <RoleProvider>
      <DonationProvider>
        <HospitalProvider>
          <Router>
            <div className="min-h-screen bg-gradient-primary animated-bg">
              <Navbar />
              <main className="container mx-auto px-4 py-8">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/explore" element={<Explore />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/gov-dashboard" element={<GovernmentDashboard />} />
                  <Route path="/hospital-dashboard" element={<HospitalDashboard />} />
                  <Route path="/user-dashboard" element={<UserDashboard />} />
                  <Route path="/verify-donation" element={<VerifyDonation />} />
                  <Route path="/redeem-nft" element={<RedeemNFT />} />
                  <Route path="/manage-hospitals" element={<ManageHospitals />} />
                  <Route path="/nfts" element={<NFTPage />} />
                  <Route path="/reports" element={<ReportsPage />} />
                </Routes>
              </main>
            </div>
          </Router>
        </HospitalProvider>
      </DonationProvider>
    </RoleProvider>
  );
}

export default App;