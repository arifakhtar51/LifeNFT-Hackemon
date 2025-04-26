import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RoleContext } from '../contexts/RoleContext';
import { motion } from "framer-motion";
import * as hiveTx from "hive-tx";
import { useHospital } from '../contexts/HospitalContext';

// Mock data for hospitals
const mockHospitals = [
  {
    id: 1,
    name: "City General Hospital",
    address: "123 Main St, Cityville",
    verificationStatus: "verified",
    donationsCount: 456,
    nftsIssued: 432,
    lastActivity: "2023-07-15"
  },
  {
    id: 2,
    name: "Memorial Medical Center",
    address: "789 Oak Ave, Townsville",
    verificationStatus: "verified",
    donationsCount: 321,
    nftsIssued: 298,
    lastActivity: "2023-07-14"
  },
  {
    id: 3,
    name: "University Health System",
    address: "456 College Blvd, Collegetown",
    verificationStatus: "pending",
    donationsCount: 0,
    nftsIssued: 0,
    lastActivity: "N/A"
  }
];

// Mock data for donation statistics
const mockDonationStats = {
  totalDonations: 12567,
  monthlyDonations: 843,
  totalHospitals: 24,
  verifiedHospitals: 22,
  totalNFTsIssued: 11982
};

// Mock data for recent blockchain transactions
const mockBlockchainTransactions = [
  {
    id: "tx-001",
    type: "Hospital Verification",
    hospital: "City General Hospital",
    timestamp: "2023-07-15T14:32:45Z",
    txHash: "0x7f8e9d3a2b1c0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4",
    status: "confirmed"
  },
  {
    id: "tx-002",
    type: "Donation Verification",
    hospital: "Memorial Medical Center",
    donorId: "donor456",
    timestamp: "2023-07-14T09:17:22Z",
    txHash: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2",
    status: "confirmed"
  },
  {
    id: "tx-003",
    type: "NFT Issuance",
    hospital: "City General Hospital",
    donorId: "donor789",
    timestamp: "2023-07-13T16:45:11Z",
    txHash: "0x9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e",
    status: "confirmed"
  }
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { 
      type: "spring", 
      stiffness: 100 
    }
  }
};

function GovDashboard() {
  const { userRole } = useContext(RoleContext);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [hospitals, setHospitals] = useState(mockHospitals);
  const [donationStats, setDonationStats] = useState(mockDonationStats);
  const [blockchainTransactions, setBlockchainTransactions] = useState(mockBlockchainTransactions);
  const [govData, setGovData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showVerifyHospitalModal, setShowVerifyHospitalModal] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [hiveUsername, setHiveUsername] = useState("");
  const [isHiveConnected, setIsHiveConnected] = useState(false);
  const navigate = useNavigate();
  const { addHospital, updateHospital, resetHospitalPassword } = useHospital();
  const [showAddHospital, setShowAddHospital] = useState(false);
  const [newHospital, setNewHospital] = useState({
    name: '',
    address: '',
    contact: '',
    license: ''
  });
  const [credentials, setCredentials] = useState(null);

  // Check if user is logged in and has the correct role
  useEffect(() => {
    const checkAuth = async () => {
      const userData = JSON.parse(localStorage.getItem("userData"));
      
      if (!userData || userData.Role !== "government") {
        navigate("/login");
        return;
      }
      
      setGovData(userData);
      setLoading(false);
      
      // Check if Hive Keychain is available and user is logged in with Hive
      if (window.hive_keychain && userData.hiveUsername) {
        setHiveUsername(userData.hiveUsername);
        setIsHiveConnected(true);
        
        // Fetch blockchain data for this user
        fetchBlockchainData(userData.hiveUsername);
      }
    };
    
    checkAuth();
  }, [navigate]);
  
  // Function to fetch blockchain data from Hive
  const fetchBlockchainData = async (username) => {
    try {
      // Fetch account data from Hive blockchain
      const accountData = await hiveTx.call("condenser_api.get_accounts", [[username]]);
      
      if (accountData && accountData.result && accountData.result.length > 0) {
        console.log("Hive account data:", accountData.result[0]);
        
        // Fetch custom JSON operations related to blood donations
        const accountHistory = await hiveTx.call("condenser_api.get_account_history", [
          username, 
          -1, 
          100
        ]);
        
        if (accountHistory && accountHistory.result) {
          // Filter for custom_json operations related to our app
          const donationOperations = accountHistory.result.filter(tx => {
            return tx[1].op[0] === 'custom_json' && 
                  (tx[1].op[1].id === 'lifenft_donation_verify' || 
                   tx[1].op[1].id === 'lifenft_hospital_verify' ||
                   tx[1].op[1].id === 'lifenft_nft_issue');
          });
          
          console.log("Donation operations:", donationOperations);
          
          // Update blockchain transactions with real data
          if (donationOperations.length > 0) {
            const formattedTransactions = donationOperations.map((op, index) => {
              const opData = JSON.parse(op[1].op[1].json);
              return {
                id: `tx-${index}`,
                type: op[1].op[1].id.includes('donation') ? 'Donation Verification' : 
                      op[1].op[1].id.includes('hospital') ? 'Hospital Verification' : 'NFT Issuance',
                hospital: opData.hospital || 'Unknown Hospital',
                donorId: opData.donorId || '',
                timestamp: new Date(op[1].timestamp).toISOString(),
                txHash: op[1].trx_id,
                status: 'confirmed'
              };
            });
            
            setBlockchainTransactions(formattedTransactions);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching blockchain data:", error);
    }
  };

  // Function to verify hospital on the blockchain
  const verifyHospitalOnBlockchain = async (hospital) => {
    if (!window.hive_keychain || !hiveUsername) {
      alert("Hive Keychain not available or user not logged in with Hive");
      return false;
    }
    
    try {
      const json = JSON.stringify({
        hospital: hospital.name,
        hospitalId: hospital.id,
        verifiedBy: hiveUsername,
        timestamp: new Date().toISOString()
      });
      
      // Request keychain to sign and broadcast the transaction
      window.hive_keychain.requestCustomJson(
        hiveUsername,
        "lifenft_hospital_verify",
        "Active",
        json,
        "Verify Hospital on LifeNFT",
        async (response) => {
          if (response.success) {
            console.log("Hospital verification broadcast successfully:", response);
            
            // Update local state
            const updatedHospitals = hospitals.map(h => 
              h.id === hospital.id ? {...h, verificationStatus: "verified"} : h
            );
            setHospitals(updatedHospitals);
            
            // Add the transaction to the list
            const newTransaction = {
              id: `tx-${Date.now()}`,
              type: "Hospital Verification",
              hospital: hospital.name,
              timestamp: new Date().toISOString(),
              txHash: response.result.id || "pending",
              status: "confirmed"
            };
            
            setBlockchainTransactions([newTransaction, ...blockchainTransactions]);
            return true;
          } else {
            console.error("Error broadcasting hospital verification:", response);
            alert(`Error verifying hospital: ${response.message || "Unknown error"}`);
            return false;
          }
        }
      );
    } catch (error) {
      console.error("Error in hospital verification:", error);
      alert(`Error: ${error.message}`);
      return false;
    }
  };

  // Function to handle hospital verification
  const handleVerifyHospital = (hospital) => {
    setSelectedHospital(hospital);
    setShowVerifyHospitalModal(true);
  };

  // Function to confirm hospital verification
  const confirmVerifyHospital = async () => {
    if (!selectedHospital) return;
    
    // Verify on blockchain first
    const blockchainSuccess = await verifyHospitalOnBlockchain(selectedHospital);
    
    if (blockchainSuccess) {
      // Update local state
      const updatedHospitals = hospitals.map(hospital => 
        hospital.id === selectedHospital.id 
          ? {...hospital, verificationStatus: "verified"} 
          : hospital
      );
      
      setHospitals(updatedHospitals);
      setDonationStats({
        ...donationStats,
        verifiedHospitals: donationStats.verifiedHospitals + 1
      });
      
      setShowVerifyHospitalModal(false);
      setSelectedHospital(null);
    }
  };

  // Function to handle settings form submission
  const handleSaveSettings = (e) => {
    e.preventDefault();
    // Save settings logic
    setShowSettingsModal(false);
  };

  // Function to connect to Hive Keychain
  const connectToHive = () => {
    if (!window.hive_keychain) {
      alert("Hive Keychain extension is not installed");
      return;
    }
    
    const username = prompt("Enter your Hive username:");
    if (!username) return;
    
    window.hive_keychain.requestSignBuffer(
      username,
      `Login to LifeNFT as Government Authority: ${new Date().toISOString()}`,
      "Posting",
      (response) => {
        if (response.success) {
          setHiveUsername(username);
          setIsHiveConnected(true);
          const userData = JSON.parse(localStorage.getItem("userData")) || {};
          userData.hiveUsername = username;
          localStorage.setItem("userData", JSON.stringify(userData));
          alert(`Successfully connected to Hive as @${username}`);
        } else {
          alert(`Failed to authenticate: ${response.message}`);
        }
      }
    );
  };

  const verifyHospital = () => {
    if (!isHiveConnected || !selectedHospital) return;
    
    const customJson = {
      app: "lifenft",
      action: "verify_hospital",
      hospital_id: selectedHospital.id,
      hospital_name: selectedHospital.name,
      verified_by: hiveUsername,
      timestamp: new Date().toISOString()
    };
    
    window.hive_keychain.requestCustomJson(
      hiveUsername,
      "lifenft_hospital_verification",
      "Active",
      JSON.stringify(customJson),
      `Verify Hospital: ${selectedHospital.name}`,
      (response) => {
        if (response.success) {
          const updatedHospitals = hospitals.map(h => 
            h.id === selectedHospital.id 
              ? {...h, verificationStatus: "verified"} 
              : h
          );
          setHospitals(updatedHospitals);
          const newTx = {
            id: `tx-${Date.now()}`,
            type: "Hospital Verification",
            hospital: selectedHospital.name,
            timestamp: new Date().toISOString(),
            txHash: response.result.id || "0x" + Math.random().toString(36).substring(2, 15),
            status: "confirmed"
          };
          setBlockchainTransactions([newTx, ...blockchainTransactions]);
          setShowVerifyHospitalModal(false);
          setSelectedHospital(null);
          alert(`Hospital ${selectedHospital.name} has been verified on the blockchain!`);
        } else {
          alert(`Blockchain transaction failed: ${response.message}`);
        }
      }
    );
  };

  const handleAddHospital = async (e) => {
    e.preventDefault();
    
    if (!isHiveConnected) {
      alert("Please connect to Hive blockchain first to onboard hospitals.");
      return;
    }

    try {
      // First add the hospital to our local state and get credentials
      const creds = addHospital(newHospital);
      
      // Save hospital credentials to database
      try {
        const response = await fetch('http://localhost:5000/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            userId: creds.username,
            password: creds.password,
            role: 'hospital',
            hospitalName: newHospital.name,
            licenseNumber: newHospital.license,
            address: newHospital.address,
            phone: newHospital.contact,
            email: '', // Add if available
            website: '' // Add if available
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to register hospital');
        }

        const responseData = await response.json();
        console.log('Hospital registration successful:', responseData);

      } catch (networkError) {
        console.error('Network error:', networkError);
        // If the backend is not reachable, we'll proceed with blockchain registration
        // but warn the user about the backend issue
        alert('Warning: Could not connect to the backend server. The hospital will be registered on the blockchain, but you may need to manually add it to the database later.');
      }

      setCredentials(creds);

      // Create the blockchain transaction
      const customJson = {
        app: "lifenft",
        action: "onboard_hospital",
        hospital: {
          name: newHospital.name,
          address: newHospital.address,
          contact: newHospital.contact,
          license: newHospital.license,
          username: creds.username,
          onboardedBy: hiveUsername,
          timestamp: new Date().toISOString()
        }
      };

      // Broadcast to Hive blockchain
      window.hive_keychain.requestCustomJson(
        hiveUsername,
        "lifenft_hospital_onboard",
        "Active",
        JSON.stringify(customJson),
        `Onboard Hospital: ${newHospital.name}`,
        async (response) => {
          if (response.success) {
            // Add transaction to blockchain history
            const newTransaction = {
              id: `tx-${Date.now()}`,
              type: "Hospital Onboarding",
              hospital: newHospital.name,
              timestamp: new Date().toISOString(),
              txHash: response.result.id,
              status: "confirmed"
            };
            setBlockchainTransactions([newTransaction, ...blockchainTransactions]);
            
            // Reset form
            setNewHospital({
              name: '',
              address: '',
              contact: '',
              license: ''
            });
            
            // Show success message with credentials
            alert(`Hospital ${newHospital.name} has been successfully onboarded!\n\nCredentials:\nUsername: ${creds.username}\nPassword: ${creds.password}\n\nPlease save these credentials securely.`);
            setShowAddHospital(false);
          } else {
            alert(`Failed to onboard hospital on blockchain: ${response.message}`);
          }
        }
      );
    } catch (error) {
      console.error("Error onboarding hospital:", error);
      alert(`Failed to onboard hospital: ${error.message}\n\nPlease check if:\n1. The backend server is running\n2. You can access http://localhost:5000\n3. You are connected to the internet`);
    }
  };

  const handleResetPassword = (id) => {
    const newPassword = resetHospitalPassword(id);
    alert(`New password for hospital: ${newPassword}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
              LifeNFT Government Portal
            </h1>
            
            <nav className="hidden md:flex space-x-1">
              <button 
                onClick={() => setActiveTab("dashboard")}
                className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeTab === "dashboard" 
                    ? "bg-green-500/10 text-green-400" 
                    : "hover:bg-slate-700"
                }`}
              >
                Dashboard
              </button>
              <button 
                onClick={() => setActiveTab("hospitals")}
                className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeTab === "hospitals" 
                    ? "bg-green-500/10 text-green-400" 
                    : "hover:bg-slate-700"
                }`}
              >
                Hospitals
              </button>
              <button 
                onClick={() => setActiveTab("blockchain")}
                className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeTab === "blockchain" 
                    ? "bg-green-500/10 text-green-400" 
                    : "hover:bg-slate-700"
                }`}
              >
                Blockchain
              </button>
              <button 
                onClick={() => setActiveTab("profile")}
                className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeTab === "profile" 
                    ? "bg-green-500/10 text-green-400" 
                    : "hover:bg-slate-700"
                }`}
              >
                Profile
              </button>
            </nav>
          </div>
          
          <div className="flex items-center space-x-3">
            {isHiveConnected ? (
              <div className="px-3 py-1.5 bg-green-500/10 text-green-400 rounded-lg text-sm flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {hiveUsername}
              </div>
            ) : (
              <motion.button
                onClick={connectToHive}
                className="px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-lg text-sm font-medium transition-all shadow-lg hover:shadow-green-500/20"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Connect Hive
              </motion.button>
            )}
            
            <div className="relative group">
              <button className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center hover:bg-slate-600 transition-colors">
                <span className="sr-only">User menu</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </button>
              
              <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-lg shadow-lg border border-slate-700 overflow-hidden origin-top-right scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all z-50">
                <div className="p-3 border-b border-slate-700">
                  <p className="font-medium">{govData?.First_Name} {govData?.Last_Name}</p>
                  <p className="text-sm text-slate-400">{govData?.Email}</p>
                </div>
                <div className="p-2">
                  <button 
                    onClick={() => setActiveTab("profile")}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-slate-700 transition-colors"
                  >
                    Profile Settings
                  </button>
                  <button 
                    onClick={() => {
                      localStorage.removeItem("userData");
                      navigate("/login");
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6">
        {/* Mobile Tab Navigation */}
        <div className="md:hidden flex overflow-x-auto space-x-1 pb-4 mb-4">
          <button 
            onClick={() => setActiveTab("dashboard")}
            className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
              activeTab === "dashboard" 
                ? "bg-green-500/10 text-green-400" 
                : "bg-slate-800 hover:bg-slate-700"
            }`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setActiveTab("hospitals")}
            className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
              activeTab === "hospitals" 
                ? "bg-green-500/10 text-green-400" 
                : "bg-slate-800 hover:bg-slate-700"
            }`}
          >
            Hospitals
          </button>
          <button 
            onClick={() => setActiveTab("blockchain")}
            className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
              activeTab === "blockchain" 
                ? "bg-green-500/10 text-green-400" 
                : "bg-slate-800 hover:bg-slate-700"
            }`}
          >
            Blockchain
          </button>
          <button 
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
              activeTab === "profile" 
                ? "bg-green-500/10 text-green-400" 
                : "bg-slate-800 hover:bg-slate-700"
            }`}
          >
            Profile
          </button>
        </div>
        
        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 border border-slate-700 shadow-xl">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-slate-400">Total Donations</p>
                    <p className="text-3xl font-semibold mt-1">{donationStats.totalDonations.toLocaleString()}</p>
                    <p className="text-sm text-green-400 mt-1">+{donationStats.monthlyDonations} this month</p>
                  </div>
                  <div className="p-3 bg-green-500/10 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 border border-slate-700 shadow-xl">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-slate-400">Registered Hospitals</p>
                    <p className="text-3xl font-semibold mt-1">{donationStats.totalHospitals}</p>
                    <p className="text-sm text-green-400 mt-1">{donationStats.verifiedHospitals} verified</p>
                  </div>
                  <div className="p-3 bg-blue-500/10 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 border border-slate-700 shadow-xl">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-slate-400">NFTs Issued</p>
                    <p className="text-3xl font-semibold mt-1">{donationStats.totalNFTsIssued.toLocaleString()}</p>
                    <p className="text-sm text-green-400 mt-1">95% redemption rate</p>
                  </div>
                  <div className="p-3 bg-purple-500/10 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 border border-slate-700 shadow-xl">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-slate-400">Blockchain Status</p>
                    <p className="text-3xl font-semibold mt-1">Active</p>
                    <p className="text-sm text-green-400 mt-1">100% uptime</p>
                  </div>
                  <div className="p-3 bg-emerald-500/10 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Quick Actions */}
            <motion.div variants={itemVariants} className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <motion.button
                  onClick={() => setActiveTab("hospitals")}
                  className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 hover:from-green-500/20 hover:to-emerald-500/20 border border-green-500/20 rounded-xl flex items-center transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="p-3 bg-green-500/10 rounded-lg mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span>Verify Hospitals</span>
                </motion.button>
                
                <motion.button
                  onClick={() => setActiveTab("blockchain")}
                  className="p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 hover:from-blue-500/20 hover:to-cyan-500/20 border border-blue-500/20 rounded-xl flex items-center transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="p-3 bg-blue-500/10 rounded-lg mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <span>View Blockchain</span>
                </motion.button>
                
                <motion.button
                  onClick={() => {
                    // Generate reports logic
                    alert("Generating reports...");
                  }}
                  className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20 border border-purple-500/20 rounded-xl flex items-center transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="p-3 bg-purple-500/10 rounded-lg mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <span>Generate Reports</span>
                </motion.button>
                
                <motion.button
                  onClick={() => setShowSettingsModal(true)}
                  className="p-4 bg-gradient-to-r from-slate-500/10 to-slate-400/10 hover:from-slate-500/20 hover:to-slate-400/20 border border-slate-500/20 rounded-xl flex items-center transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="p-3 bg-slate-500/10 rounded-lg mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <span>Settings</span>
                </motion.button>
              </div>
            </motion.div>
            
            {/* Recent Activity */}
            <motion.div variants={itemVariants}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Recent Blockchain Activity</h2>
                <button 
                  onClick={() => setActiveTab("blockchain")}
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  View All
                </button>
              </div>
              
              <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-700 shadow-lg overflow-hidden">
                <div className="divide-y divide-slate-700">
                  {blockchainTransactions.slice(0, 3).map(tx => (
                    <div key={tx.id} className="p-4 hover:bg-slate-700/30 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{tx.type}</h3>
                          <p className="text-sm text-slate-400">
                            {tx.hospital} • {new Date(tx.timestamp).toLocaleString()}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            TX: {tx.txHash.substring(0, 10)}...
                          </p>
                        </div>
                        <span className="px-2 py-1 bg-green-500/10 text-green-400 rounded-md text-sm">
                          {tx.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
        
        {/* Hospitals Tab */}
        {activeTab === "hospitals" && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold">Hospital Management</h2>
                <motion.button
                  onClick={() => setShowAddHospital(true)}
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-lg text-sm font-medium transition-all shadow-lg hover:shadow-green-500/20"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Add Hospital
                </motion.button>
              </div>
              
              <div className="w-full sm:w-auto">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search hospitals..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 pl-9 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 absolute left-2 top-2.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="bg-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-700 shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-700/50">
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">Hospital</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">Address</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">Donations</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">NFTs Issued</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {hospitals
                      .filter(hospital => 
                        hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        hospital.address.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map(hospital => (
                        <tr key={hospital.id} className="hover:bg-slate-700/30 transition-colors">
                          <td className="px-4 py-3 font-medium">{hospital.name}</td>
                          <td className="px-4 py-3 text-slate-300">{hospital.address}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-md text-sm ${
                              hospital.verificationStatus === "verified" 
                                ? "bg-green-500/10 text-green-400" 
                                : "bg-yellow-500/10 text-yellow-400"
                            }`}>
                              {hospital.verificationStatus === "verified" ? "Verified" : "Pending"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-300">{hospital.donationsCount}</td>
                          <td className="px-4 py-3 text-slate-300">{hospital.nftsIssued}</td>
                          <td className="px-4 py-3">
                            <div className="flex space-x-2">
                              {hospital.verificationStatus === "pending" ? (
                                <motion.button
                                  onClick={() => {
                                    setSelectedHospital(hospital);
                                    setShowVerifyHospitalModal(true);
                                  }}
                                  className="p-1.5 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20 transition-colors"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  title="Verify Hospital"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                </motion.button>
                              ) : (
                                <motion.button
                                  
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </motion.button>
                              )}
                              
                              <motion.button
                                onClick={() => {
                                  // View details logic
                                  alert(`View details for ${hospital.name}`);
                                }}
                                className="p-1.5 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                title="View Details"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              </motion.button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </motion.div>
        )}
        
        {/* Blockchain Tab */}
        {activeTab === "blockchain" && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Blockchain Integration</h2>
              
              <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-700 shadow-lg p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">Hive Blockchain Connection</h3>
                  
                  {isHiveConnected ? (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">Connected to Hive Blockchain</span>
                      </div>
                      <p className="mt-2 text-sm">
                        Connected as: <span className="font-medium">{hiveUsername}</span>
                      </p>
                    </div>
                  ) : (
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">Hive connection required for blockchain verification</span>
                      </div>
                      <p className="mt-2 text-sm">
                        Please connect using Hive Keychain to enable blockchain features.
                      </p>
                      <motion.button
                        onClick={connectToHive}
                        className="mt-3 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Connect with Hive Keychain
                      </motion.button>
                    </div>
                  )}
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-4">Recent Transactions</h3>
                  
                  <div className="bg-slate-700/30 rounded-lg overflow-hidden">
                    <div className="divide-y divide-slate-700">
                      {blockchainTransactions.map(tx => (
                        <div key={tx.id} className="p-4 hover:bg-slate-700/30 transition-colors">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{tx.type}</h4>
                              <p className="text-sm text-slate-400">
                                {tx.hospital} • {new Date(tx.timestamp).toLocaleString()}
                              </p>
                              <p className="text-xs text-slate-500 mt-1">
                                TX: <a 
                                  href={`https://hiveblocks.com/tx/${tx.txHash}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-400 hover:text-blue-300 transition-colors"
                                >
                                  {tx.txHash.substring(0, 16)}...
                                </a>
                              </p>
                            </div>
                            <span className="px-2 py-1 bg-green-500/10 text-green-400 rounded-md text-sm">
                              {tx.status}
                            </span>
                          </div>
                        </div>
                      ))}
                      
                      {blockchainTransactions.length === 0 && (
                        <div className="p-4 text-center text-slate-400">
                          No transactions found
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Broadcast Custom Transaction</h3>
                  
                  {isHiveConnected ? (
                    <div className="bg-slate-700/30 rounded-lg p-4">
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-400 mb-1">
                          Transaction Type
                        </label>
                        <select className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
                          <option value="hospital_verify">Hospital Verification</option>
                          <option value="donation_verify">Donation Verification</option>
                          <option value="nft_issue">NFT Issuance</option>
                        </select>
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-400 mb-1">
                          Transaction Data (JSON)
                        </label>
                        <textarea 
                          className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 h-32 resize-none font-mono text-sm"
                          placeholder='{"hospital": "Hospital Name", "status": "verified", "verifiedBy": "gov_authority"}'
                        ></textarea>
                      </div>
                      
                      <motion.button
                        onClick={() => {
                          // Broadcast custom transaction logic
                          alert("Broadcasting custom transaction to Hive blockchain...");
                        }}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg text-sm transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Broadcast Transaction
                      </motion.button>
                    </div>
                  ) : (
                    <div className="bg-slate-700/30 rounded-lg p-4 text-center text-slate-400">
                      Please connect to Hive Blockchain to broadcast transactions
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
        
        {/* Profile Tab */}
        {activeTab === "profile" && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <h2 className="text-xl font-semibold mb-6">Government Authority Profile</h2>
              
              <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-700 shadow-lg overflow-hidden">
                {govData ? (
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="md:w-1/3">
                        <div className="bg-slate-700/50 rounded-xl p-6 text-center">
                          <div className="w-24 h-24 rounded-full bg-green-500/20 mx-auto flex items-center justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                            </svg>
                          </div>
                          <h3 className="text-lg font-semibold">
                            {govData.First_Name && govData.Last_Name 
                              ? `${govData.First_Name} ${govData.Last_Name}`
                              : "Government Authority"}
                          </h3>
                          <p className="text-sm text-slate-400 mt-1">
                            {govData.Role || "Administrator"}
                          </p>
                          
                          {isHiveConnected && (
                            <div className="mt-4 p-2 bg-slate-600/30 rounded-lg text-sm">
                              <p className="text-slate-300">Hive: @{hiveUsername}</p>
                            </div>
                          )}
                          
                          <motion.button
                            onClick={() => setShowSettingsModal(true)}
                            className="mt-4 w-full py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition-colors"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            Edit Profile
                          </motion.button>
                        </div>
                      </div>
                      
                      <div className="md:w-2/3 space-y-6">
                        <div>
                          <h4 className="text-lg font-medium mb-3">Authority Information</h4>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-slate-400 mb-1">Department</label>
                              <div className="p-2 bg-slate-700/70 rounded-lg">
                                {govData.Department || "Health Department"}
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-slate-400 mb-1">Jurisdiction</label>
                              <div className="p-2 bg-slate-700/70 rounded-lg">
                                {govData.Jurisdiction || "National"}
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-slate-400 mb-1">Authority ID</label>
                              <div className="p-2 bg-slate-700/70 rounded-lg">
                                {govData.Authority_ID || "GOV-" + Math.random().toString(36).substring(2, 10).toUpperCase()}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-lg font-medium mb-3">Contact Information</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-slate-400 mb-1">Email</label>
                              <div className="p-2 bg-slate-700/70 rounded-lg">
                                {govData.Email || "No email provided"}
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-slate-400 mb-1">Phone</label>
                              <div className="p-2 bg-slate-700/70 rounded-lg">
                                {govData.Phone || "No phone provided"}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="animate-spin h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p>Loading profile...</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </main>
      
      {/* Verify Hospital Modal */}
      {showVerifyHospitalModal && selectedHospital && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            className="bg-slate-800 rounded-xl max-w-md w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="p-4 border-b border-slate-700 flex justify-between items-center">
              <h3 className="text-xl font-semibold">Verify Hospital</h3>
              <button 
                onClick={() => {
                  setShowVerifyHospitalModal(false);
                  setSelectedHospital(null);
                }}
                className="p-2 rounded-lg hover:bg-slate-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <h4 className="font-medium mb-2">Hospital Information</h4>
                <div className="bg-slate-700/50 rounded-lg p-3 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Name:</span>
                    <span>{selectedHospital.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Address:</span>
                    <span>{selectedHospital.address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Status:</span>
                    <span className="px-2 py-0.5 bg-yellow-500/10 text-yellow-400 rounded-md text-sm">
                      Pending
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="font-medium mb-2">Verification Notes</h4>
                <textarea
                  className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 h-24 resize-none"
                  placeholder="Add verification notes..."
                ></textarea>
              </div>
              
              <div className="mb-6">
                <h4 className="font-medium mb-2">Blockchain Verification</h4>
                <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600">
                  <p className="text-sm text-slate-400 mb-4">
                    Verifying this hospital will broadcast a transaction to the Hive blockchain, creating a permanent record of verification.
                  </p>
                  
                  {isHiveConnected ? (
                    <div className="flex items-center text-green-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Ready to broadcast as @{hiveUsername}</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-yellow-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span>Hive connection required for blockchain verification</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex space-x-3">
                <motion.button
                  onClick={() => {
                    setShowVerifyHospitalModal(false);
                    setSelectedHospital(null);
                  }}
                  className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                
                <motion.button
                  onClick={verifyHospital}
                  className={`flex-1 py-2.5 rounded-lg font-medium transition-all shadow-lg ${
                    isHiveConnected 
                      ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 hover:shadow-green-500/20" 
                      : "bg-slate-600 cursor-not-allowed"
                  }`}
                  whileHover={isHiveConnected ? { scale: 1.02 } : {}}
                  whileTap={isHiveConnected ? { scale: 0.98 } : {}}
                  disabled={!isHiveConnected}
                >
                  Verify Hospital
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            className="bg-slate-800 rounded-xl max-w-2xl w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="p-4 border-b border-slate-700 flex justify-between items-center">
              <h3 className="text-xl font-semibold">Government Authority Settings</h3>
              <button 
                onClick={() => setShowSettingsModal(false)}
                className="p-2 rounded-lg hover:bg-slate-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <form onSubmit={(e) => {
                e.preventDefault();
                setShowSettingsModal(false);
                alert("Settings saved successfully!");
              }}>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-3">Authority Information</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-400 mb-1">First Name</label>
                          <input
                            type="text"
                            defaultValue={govData?.First_Name || ""}
                            className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Enter first name"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-slate-400 mb-1">Last Name</label>
                          <input
                            type="text"
                            defaultValue={govData?.Last_Name || ""}
                            className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Enter last name"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Department</label>
                        <input
                          type="text"
                          defaultValue={govData?.Department || "Health Department"}
                          className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="Enter department"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Jurisdiction</label>
                        <select
                          defaultValue={govData?.Jurisdiction || "National"}
                          className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          <option value="National">National</option>
                          <option value="State">State/Province</option>
                          <option value="Regional">Regional</option>
                          <option value="Local">Local</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Contact Information</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Email</label>
                        <div className="p-2 bg-slate-700/70 rounded-lg">
                          {govData.Email || "No email provided"}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Phone</label>
                        <div className="p-2 bg-slate-700/70 rounded-lg">
                          {govData.Phone || "No phone provided"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex space-x-3">
                  <motion.button
                    type="button"
                    onClick={() => setShowSettingsModal(false)}
                    className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                  
                  <motion.button
                    type="submit"
                    className="flex-1 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-lg font-medium transition-all shadow-lg hover:shadow-blue-500/20"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Save Changes
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}

      {showAddHospital && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            className="bg-slate-800 rounded-xl max-w-md w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="p-4 border-b border-slate-700 flex justify-between items-center">
              <h3 className="text-xl font-semibold">Add New Hospital</h3>
              <button 
                onClick={() => setShowAddHospital(false)}
                className="p-2 rounded-lg hover:bg-slate-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <form onSubmit={handleAddHospital}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Hospital Name</label>
                    <input
                      type="text"
                      value={newHospital.name}
                      onChange={(e) => setNewHospital({...newHospital, name: e.target.value})}
                      className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Enter hospital name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Address</label>
                    <input
                      type="text"
                      value={newHospital.address}
                      onChange={(e) => setNewHospital({...newHospital, address: e.target.value})}
                      className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Enter hospital address"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Contact</label>
                    <input
                      type="text"
                      value={newHospital.contact}
                      onChange={(e) => setNewHospital({...newHospital, contact: e.target.value})}
                      className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Enter contact information"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">License Number</label>
                    <input
                      type="text"
                      value={newHospital.license}
                      onChange={(e) => setNewHospital({...newHospital, license: e.target.value})}
                      className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Enter license number"
                      required
                    />
                  </div>
                </div>
                <div className="mt-6 flex space-x-3">
                  <motion.button
                    type="button"
                    onClick={() => setShowAddHospital(false)}
                    className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                  
                  <motion.button
                    type="submit"
                    className="flex-1 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-lg font-medium transition-all shadow-lg hover:shadow-green-500/20"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Add Hospital
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}

      {credentials && (
        <div className="mb-8 p-4 bg-green-100 border border-green-400 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800">Hospital Credentials Generated</h3>
          <p className="text-green-700">Username: {credentials.username}</p>
          <p className="text-green-700">Password: {credentials.password}</p>
          <p className="text-sm text-green-600 mt-2">Please save these credentials securely.</p>
        </div>
      )}
    </div>
  );
}

export default GovDashboard;