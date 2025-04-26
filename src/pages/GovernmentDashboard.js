import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

function GovernmentDashboard() {
  const [hospitals, setHospitals] = useState([]);
  const [pendingVerifications, setPendingVerifications] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Load hospitals from localStorage
    const savedHospitals = JSON.parse(localStorage.getItem('hospitals') || '[]');
    setHospitals(savedHospitals);

    // Load pending verifications
    const savedVerifications = JSON.parse(localStorage.getItem('pendingVerifications') || '[]');
    setPendingVerifications(savedVerifications);
  }, []);

  const verifyHospital = (hospitalId) => {
    const updatedHospitals = hospitals.map(hospital => 
      hospital.id === hospitalId ? { ...hospital, verified: true } : hospital
    );
    setHospitals(updatedHospitals);
    localStorage.setItem('hospitals', JSON.stringify(updatedHospitals));
  };

  return (
    <div className="min-h-screen bg-gradient-primary animated-bg">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gradient">Government Dashboard</h1>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`nav-pill px-4 py-2 rounded-lg ${
              activeTab === 'overview' ? 'bg-gradient-accent text-white' : 'text-slate-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('hospitals')}
            className={`nav-pill px-4 py-2 rounded-lg ${
              activeTab === 'hospitals' ? 'bg-gradient-accent text-white' : 'text-slate-300'
            }`}
          >
            Hospitals
          </button>
          <button
            onClick={() => setActiveTab('verifications')}
            className={`nav-pill px-4 py-2 rounded-lg ${
              activeTab === 'verifications' ? 'bg-gradient-accent text-white' : 'text-slate-300'
            }`}
          >
            Verifications
          </button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="modern-card"
          >
            <h3 className="text-xl font-semibold mb-2">Total Hospitals</h3>
            <p className="text-3xl font-bold text-gradient">{hospitals.length}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="modern-card"
          >
            <h3 className="text-xl font-semibold mb-2">Verified Hospitals</h3>
            <p className="text-3xl font-bold text-gradient">
              {hospitals.filter(h => h.verified).length}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="modern-card"
          >
            <h3 className="text-xl font-semibold mb-2">Pending Verifications</h3>
            <p className="text-3xl font-bold text-gradient">{pendingVerifications.length}</p>
          </motion.div>
        </div>

        {/* Hospital List */}
        {activeTab === 'hospitals' && (
          <div className="modern-card">
            <h2 className="text-2xl font-semibold mb-4">Hospital List</h2>
            <div className="overflow-x-auto">
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {hospitals.map(hospital => (
                    <tr key={hospital.id}>
                      <td>{hospital.name}</td>
                      <td>{hospital.location}</td>
                      <td>
                        <span className={`modern-badge ${
                          hospital.verified ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'
                        }`}>
                          {hospital.verified ? 'Verified' : 'Pending'}
                        </span>
                      </td>
                      <td>
                        {!hospital.verified && (
                          <button
                            onClick={() => verifyHospital(hospital.id)}
                            className="modern-button"
                          >
                            Verify
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pending Verifications */}
        {activeTab === 'verifications' && (
          <div className="modern-card">
            <h2 className="text-2xl font-semibold mb-4">Pending Verifications</h2>
            <div className="space-y-4">
              {pendingVerifications.map(verification => (
                <div key={verification.id} className="modern-card">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold">{verification.hospitalName}</h3>
                      <p className="text-slate-400">{verification.type}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="modern-button">Approve</button>
                      <button className="modern-button bg-red-500">Reject</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default GovernmentDashboard; 