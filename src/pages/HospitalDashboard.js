import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useHospital } from '../contexts/HospitalContext';

function HospitalDashboard() {
  const navigate = useNavigate();
  const { addNFT } = useHospital();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [hiveUsername, setHiveUsername] = useState('');
  const [isHiveConnected, setIsHiveConnected] = useState(false);
  const [hospitalData, setHospitalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [donations, setDonations] = useState([]);
  const [pendingDonations, setPendingDonations] = useState([]);
  const [showAddDonationModal, setShowAddDonationModal] = useState(false);
  const [showVerifyDonationModal, setShowVerifyDonationModal] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [blockchainTransactions, setBlockchainTransactions] = useState([]);
  const [verificationNotes, setVerificationNotes] = useState('');
  const [newDonation, setNewDonation] = useState({
    name: '',
    id: '',
    bloodType: 'A+',
    date: new Date().toISOString().split('T')[0],
    notes: '',
    hiveUsername: '', // Add Hive username field
    amount: '450' // Add default blood amount in ml
  });
  const [showMintNFT, setShowMintNFT] = useState(false);
  const [nftData, setNftData] = useState({
    donorId: '',
    name: '',
    bloodType: 'A+',
    amount: '',
    ipfsHash: '',
    image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==' // Dummy image
  });
  const [donorData, setDonorData] = useState({
    name: "",
    age: "",
    bloodType: "",
    amount: "",
    hiveUsername: "", // Add Hive username field
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { mintNFT } = useHospital();
  
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

  // Calculate statistics based on current data
  const donationStats = {
    totalDonations: donations.length,
    verifiedDonations: donations.filter(d => d.status === 'verified').length,
    pendingVerifications: donations.filter(d => d.status === 'pending').length,
    totalNFTsIssued: blockchainTransactions.filter(tx => tx.type === 'NFT Issuance').length
  };

  // Load data and initial setup
  useEffect(() => {
    // Check if user is already connected to Hive
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    if (userData && userData.hiveUsername) {
      setHiveUsername(userData.hiveUsername);
      setIsHiveConnected(true);
    }

    // Load hospital data from localStorage or use mock data
    const savedHospitalData = JSON.parse(localStorage.getItem("hospitalData") || "null");
    if (savedHospitalData) {
      setHospitalData(savedHospitalData);
    } else {
      // Mock hospital data
      const mockHospital = {
        Hospital_Name: "City General Hospital",
        Address: "123 Medical Center Blvd",
        City: "Metropolis",
        State: "NY",
        Zip: "10001",
        Phone: "(555) 123-4567",
        Email: "admin@citygeneral.org",
        License_Number: "MED-12345",
        Verified: true
      };
      setHospitalData(mockHospital);
      localStorage.setItem("hospitalData", JSON.stringify(mockHospital));
    }

    // Load donations from localStorage or use mock data
    const savedDonations = JSON.parse(localStorage.getItem("donations") || "null");
    if (savedDonations) {
      setDonations(savedDonations);
      setPendingDonations(savedDonations.filter(d => d.status === 'pending'));
    } else {
      // Mock donations data
      const mockDonations = [
        {
          id: "DON1001",
          name: "John Smith",
          bloodType: "A+",
          date: "2023-07-15",
          status: "verified",
          notes: "Routine donation"
        },
        {
          id: "DON1002",
          name: "Jane Doe",
          bloodType: "O-",
          date: "2023-07-16",
          status: "verified",
          notes: "First-time donor"
        },
        {
          id: "DON1003",
          name: "Robert Johnson",
          bloodType: "B+",
          date: "2023-07-17",
          status: "pending",
          notes: "Rare blood type"
        },
        {
          id: "DON1004",
          name: "Emily Wilson",
          bloodType: "AB-",
          date: "2023-07-18",
          status: "pending",
          notes: "Referred by Dr. Smith"
        }
      ];
      
      setDonations(mockDonations);
      setPendingDonations(mockDonations.filter(d => d.status === 'pending'));
      localStorage.setItem("donations", JSON.stringify(mockDonations));
    }

    // Load transactions from localStorage or use mock data
    const savedTransactions = JSON.parse(localStorage.getItem("blockchainTransactions") || "null");
    if (savedTransactions) {
      setBlockchainTransactions(savedTransactions);
    } else {
      // Mock recent activity
      const recentActivity = [
        { 
          id: 'tx1',
          type: 'Donation Verification', 
          donor: 'John Smith',
          bloodType: 'A+',
          date: '3/11/2025, 3:49 PM', 
          tx: '0x7b5e9d23a4f8c9b1e0d6a2c7f3b5a9e8d1c4b7a3',
          status: 'confirmed'
        },
        { 
          id: 'tx2',
          type: 'New Donation', 
          donor: 'Jane Doe',
          bloodType: 'O-',
          date: '3/10/2025, 2:30 PM', 
          tx: '0x8c4d2e6f1a9b7c3e0d5f2a1b8c7d3e6f4a9b2c5d',
          status: 'confirmed'
        },
        { 
          id: 'tx3',
          type: 'NFT Issuance', 
          donor: 'John Smith',
          bloodType: 'A+',
          date: '3/11/2025, 4:15 PM', 
          tx: '0x2a1b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
          status: 'confirmed'
        }
      ];
      
      setBlockchainTransactions(recentActivity);
      localStorage.setItem("blockchainTransactions", JSON.stringify(recentActivity));
    }

    setLoading(false);
  }, []);

  // Connect to Hive using Keychain
  function connectToHive() {
    if (window.hive_keychain) {
      // First check if Keychain extension exists
      const username = prompt("Enter your Hive username:");
      if (!username) return;
      
      // Verify the username exists on Hive
      window.hive_keychain.requestSignBuffer(
        username,
        `I am connecting to LifeNFT Blood Donation platform at ${new Date().toISOString()}`,
        "Posting",
        (response) => {
          if (response.success) {
            setHiveUsername(username);
            setIsHiveConnected(true);
            localStorage.setItem("userData", JSON.stringify({ hiveUsername: username }));
            alert(`Successfully connected to Hive as @${username}!`);
          } else {
            alert(`Failed to connect to Hive: ${response.message}`);
          }
        }
      );
    } else {
      alert("Hive Keychain extension is not installed. Please install it to connect to Hive blockchain.");
      window.open("https://hive-keychain.com/", "_blank");
    }
  }

  // Disconnect from Hive
  const disconnectHive = () => {
    if (window.confirm("Are you sure you want to disconnect from Hive?")) {
      setHiveUsername('');
      setIsHiveConnected(false);
      localStorage.removeItem("userData");
      alert("Disconnected from Hive");
    }
  };

  // Generate unique ID for donations
  const generateDonationId = () => {
    const lastId = donations.length > 0 
      ? parseInt(donations[donations.length - 1].id.replace('DON', '')) 
      : 1000;
    return `DON${lastId + 1}`;
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  // Filtered donations based on search
  const filteredDonations = donations.filter(donation => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      donation.id.toLowerCase().includes(term) ||
      donation.name.toLowerCase().includes(term) ||
      donation.bloodType.toLowerCase().includes(term)
    );
  });
  
  // Add new donation function
  const addDonation = () => {
    if (!newDonation.name) {
      alert("Donor name is required!");
      return;
    }
    
    // Generate ID if not provided
    const donationId = newDonation.id || generateDonationId();
    
    // Create new donation object
    const donation = {
      id: donationId,
      name: newDonation.name,
      bloodType: newDonation.bloodType,
      date: newDonation.date,
      status: 'pending',
      notes: newDonation.notes,
      hiveUsername: newDonation.hiveUsername, // Add Hive username to donation
      amount: newDonation.amount // Add blood amount to donation
    };
    
    // Add to donations list
    const updatedDonations = [...donations, donation];
    setDonations(updatedDonations);
    setPendingDonations([...pendingDonations, donation]);
    
    // Save to localStorage
    localStorage.setItem("donations", JSON.stringify(updatedDonations));
    
    // Add transaction to blockchain activity if connected to Hive
    if (isHiveConnected) {
      // Create transaction object
      const newTransaction = {
        id: `tx${Math.floor(Math.random() * 10000)}`,
        type: 'New Donation',
        donor: donation.name,
        bloodType: donation.bloodType,
        date: new Date().toLocaleString(),
        tx: `0x${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`,
        status: 'confirmed'
      };
      
      // Update blockchain transactions
      const updatedTransactions = [newTransaction, ...blockchainTransactions];
      setBlockchainTransactions(updatedTransactions);
      localStorage.setItem("blockchainTransactions", JSON.stringify(updatedTransactions));
    }
    
    // Close modal and reset form
    setShowAddDonationModal(false);
    setNewDonation({
      name: '',
      id: '',
      bloodType: 'A+',
      date: new Date().toISOString().split('T')[0],
      notes: '',
      hiveUsername: '', // Reset Hive username
      amount: '450' // Reset blood amount
    });
    
    alert(`Donation ${donationId} added successfully!`);
  };
  
  // Verify a donation using Hive blockchain
  function verifyDonation(donationId) {
    if (!isHiveConnected) {
      alert("Please connect to Hive first to verify donations!");
      return;
    }
    
    // Check if Hive Keychain extension is available
    if (!window.hive_keychain) {
      alert("Hive Keychain extension is required for blockchain operations!");
      return;
    }
    
    // Find donation
    const donationToVerify = donations.find(d => d.id === donationId);
    if (!donationToVerify) {
      alert("Donation not found!");
      return;
    }
    
    // Update donation status
    const updatedDonations = donations.map(d => 
      d.id === donationId ? {...d, status: 'verified', verificationNotes} : d
    );
    
    setDonations(updatedDonations);
    setPendingDonations(updatedDonations.filter(d => d.status === 'pending'));
    localStorage.setItem("donations", JSON.stringify(updatedDonations));
    
    // Create blockchain transaction for Hive
    const customJson = {
      app: "blooddonornft",
      action: "verify_donation",
      data: {
        hospital: hospitalData?.Hospital_Name || "Hospital",
        donor_id: donationToVerify.id,
        donor_name: donationToVerify.name,
        blood_type: donationToVerify.bloodType,
        donation_date: donationToVerify.date,
        verification_date: new Date().toISOString().split('T')[0],
        verification_notes: verificationNotes,
        verified_by: hiveUsername,
        timestamp: new Date().toISOString()
      }
    };
    
    // Request custom JSON operation via Hive Keychain
    window.hive_keychain.requestCustomJson(
      hiveUsername,
      "blooddonornft_verify",
      "Active",
      JSON.stringify(customJson),
      "Verify Blood Donation",
      (response) => {
        if (response.success) {
          // Add transaction to blockchain activity
          const newTransaction = {
            id: `tx${Math.floor(Math.random() * 10000)}`,
            type: 'Donation Verification',
            donor: donationToVerify.name,
            bloodType: donationToVerify.bloodType,
            date: new Date().toLocaleString(),
            tx: response.result.id || `0x${Math.random().toString(16).slice(2)}`,
            status: 'confirmed'
          };
          
          setBlockchainTransactions([newTransaction, ...blockchainTransactions]);
          localStorage.setItem("blockchainTransactions", JSON.stringify([newTransaction, ...blockchainTransactions]));
          
          alert(`Donation ${donationId} has been verified successfully on the Hive blockchain!`);
        } else {
          alert(`Failed to verify donation on blockchain: ${response.message || "Unknown error"}`);
          
          // Revert status if blockchain operation failed
          const revertedDonations = donations.map(d => 
            d.id === donationId ? {...d, status: 'pending'} : d
          );
          setDonations(revertedDonations);
          setPendingDonations(revertedDonations.filter(d => d.status === 'pending'));
          localStorage.setItem("donations", JSON.stringify(revertedDonations));
        }
      }
    );
    
    // Close modal
    setShowVerifyDonationModal(false);
  }
  
  // Issue NFT for a verified donation using Hive blockchain
  function issueNFT(donationId) {
    if (!isHiveConnected) {
      alert("Please connect to Hive first to issue NFTs!");
      return;
    }
    
    // Check if Hive Keychain extension is available
    if (!window.hive_keychain) {
      alert("Hive Keychain extension is required for blockchain operations!");
      return;
    }
    
    // Find donation
    const donation = donations.find(d => d.id === donationId);
    if (!donation) {
      alert("Donation not found!");
      return;
    }
    
    if (donation.status !== 'verified') {
      alert("Donation must be verified before issuing an NFT!");
      return;
    }
    
    // Create NFT metadata for Hive blockchain
    const nftMetadata = {
      name: `Blood Donation - ${donation.bloodType}`,
      description: `${donation.name}'s blood donation at ${hospitalData?.Hospital_Name || "Hospital"} on ${donation.date}`,
      blood_type: donation.bloodType,
      donation_date: donation.date,
      issuer: hospitalData?.Hospital_Name || "Hospital",
      verified_by: hiveUsername,
      image: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80",
      attributes: [
        { trait_type: "Blood Type", value: donation.bloodType },
        { trait_type: "Hospital", value: hospitalData?.Hospital_Name || "Hospital" },
        { trait_type: "Donor", value: donation.name },
        { trait_type: "Date", value: donation.date },
        { trait_type: "Amount", value: `${donation.amount} ml` }
      ]
    };
    
    // Create blockchain transaction
    const customJson = {
      app: "blooddonornft",
      action: "issue_nft",
      data: {
        hospital: hospitalData?.Hospital_Name || "Hospital",
        donor_id: donation.id,
        donor_name: donation.name,
        blood_type: donation.bloodType,
        donation_date: donation.date,
        nft_metadata: nftMetadata,
        recipient: donation.hiveUsername || "shadowspark",  // Use the donor's Hive username
        timestamp: new Date().toISOString()
      }
    };
    
    // Request custom JSON operation via Hive Keychain
    window.hive_keychain.requestCustomJson(
      hiveUsername,
      "blooddonornft_issue",
      "Active",
      JSON.stringify(customJson),
      "Issue NFT for Blood Donation",
      (response) => {
        if (response.success) {
          // Create NFT object for localStorage
          const newNFT = {
            id: `NFT-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
            name: nftMetadata.name,
            description: nftMetadata.description,
            bloodType: donation.bloodType,
            amount: `${donation.amount} ml`,
            hospitalName: hospitalData?.Hospital_Name || "Hospital",
            hospitalId: hospitalData?.id,
            createdAt: donation.date,
            txHash: response.result.id,
            status: "confirmed",
            hiveUsername: donation.hiveUsername || "shadowspark", // Store the recipient's Hive username
            donorName: donation.name,
            donorId: donation.id,
            image: nftMetadata.image,
            attributes: nftMetadata.attributes
          };

          // Get existing NFTs from localStorage
          const existingNfts = JSON.parse(localStorage.getItem('nfts') || '[]');
          console.log('Existing NFTs:', existingNfts);

          // Add new NFT to the list
          const updatedNfts = [...existingNfts, newNFT];
          console.log('Updated NFTs list:', updatedNfts);

          // Save to localStorage
          localStorage.setItem('nfts', JSON.stringify(updatedNfts));
          
          // Add transaction to blockchain activity
          const newTransaction = {
            id: `tx${Math.floor(Math.random() * 10000)}`,
            type: 'NFT Issuance',
            donor: donation.name,
            bloodType: donation.bloodType,
            date: new Date().toLocaleString(),
            tx: response.result.id || `0x${Math.random().toString(16).slice(2)}`,
            status: 'confirmed'
          };
          
          setBlockchainTransactions([newTransaction, ...blockchainTransactions]);
          localStorage.setItem("blockchainTransactions", JSON.stringify([newTransaction, ...blockchainTransactions]));
          
          // Update donation to mark NFT as issued
          const updatedDonations = donations.map(d => 
            d.id === donationId ? {...d, nftIssued: true, nftTx: response.result.id} : d
          );
          setDonations(updatedDonations);
          localStorage.setItem("donations", JSON.stringify(updatedDonations));
          
          alert(`NFT issued successfully for donation ${donationId} on the Hive blockchain!`);
        } else {
          alert(`Failed to issue NFT on blockchain: ${response.message || "Unknown error"}`);
        }
      }
    );
  }
  
  // Function to update hospital profile
  const updateHospitalProfile = (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(e.target);
    const updatedHospital = {
      Hospital_Name: formData.get('hospitalName'),
      Address: formData.get('address'),
      City: formData.get('city'),
      State: formData.get('state'),
      Zip: formData.get('zip') || '10001',
      Phone: formData.get('phone'),
      Email: formData.get('email'),
      License_Number: formData.get('licenseNumber'),
      Verified: true
    };
    
    // Update state and localStorage
    setHospitalData(updatedHospital);
    localStorage.setItem("hospitalData", JSON.stringify(updatedHospital));
    
    alert("Hospital profile updated successfully!");
  };

  const handleMintNFT = (e) => {
    e.preventDefault();
    
    // Get the current user's ID from localStorage
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const userId = userData.User_Id;

    // Create the NFT data with the proper donor ID
    const nftData = {
      ...nftData,
      donorId: userId, // Use the actual user ID
      timestamp: new Date().toISOString(),
      hospitalId: userData.id, // Add hospital ID for reference
      hospitalName: userData.name || 'Unknown Hospital'
    };

    addNFT(nftData);
    setShowMintNFT(false);
    setNftData({
      donorId: '',
      name: '',
      bloodType: 'A+',
      amount: '',
      ipfsHash: '',
      image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (!donorData.hiveUsername) {
        throw new Error("Hive username is required to mint NFT");
      }

      // Clean up Hive username (add @ if missing)
      const hiveUsername = donorData.hiveUsername.startsWith('@') 
        ? donorData.hiveUsername 
        : `@${donorData.hiveUsername}`;

      const hospitalData = JSON.parse(localStorage.getItem('userData'));
      
      await mintNFT(
        {
          ...donorData,
          hiveUsername,
        },
        hospitalData
      );

      setSuccess("NFT minted successfully!");
      setDonorData({
        name: "",
        age: "",
        bloodType: "",
        amount: "",
        hiveUsername: "",
      });
    } catch (err) {
      console.error("Error minting NFT:", err);
      setError(err.message || "Failed to mint NFT");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <header className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700 py-4">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-500">
              LifeNFT Hospital Portal
            </h1>
            
            <div className="flex items-center space-x-4">
              {isHiveConnected ? (
                <div className="flex items-center">
                  <span className="mr-2 text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full">
                    Connected: @{hiveUsername}
                  </span>
                  <button 
                    onClick={disconnectHive}
                    className="text-sm text-red-400 hover:text-red-300"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <button 
                  onClick={connectToHive}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg text-sm font-medium transition-all shadow-lg hover:shadow-purple-500/20"
                >
                  Connect to Hive
                </button>
              )}
              
              <button 
                onClick={() => setShowSettingsModal(true)}
                className="p-2 rounded-lg hover:bg-slate-700 transition-colors"
                title="Settings"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <nav className="bg-slate-800/40 backdrop-blur-sm border-b border-slate-700/50">
        <div className="container mx-auto px-4">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`px-4 py-3 font-medium transition-colors ${
                activeTab === "dashboard" 
                  ? "text-green-400 border-b-2 border-green-400" 
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Dashboard
            </button>
            
            <button
              onClick={() => setActiveTab("donations")}
              className={`px-4 py-3 font-medium transition-colors ${
                activeTab === "donations" 
                  ? "text-green-400 border-b-2 border-green-400" 
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Donations
            </button>
            
            <button
              onClick={() => setActiveTab("blockchain")}
              className={`px-4 py-3 font-medium transition-colors ${
                activeTab === "blockchain" 
                  ? "text-green-400 border-b-2 border-green-400" 
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Blockchain
            </button>
            
            <button
              onClick={() => setActiveTab("profile")}
              className={`px-4 py-3 font-medium transition-colors ${
                activeTab === "profile" 
                  ? "text-green-400 border-b-2 border-green-400" 
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Profile
            </button>
          </div>
        </div>
      </nav>
      
      <main className="container mx-auto px-4 py-8">
        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400"></div>
          </div>
        )}
        
        {/* Dashboard Tab Content */}
        {!loading && activeTab === "dashboard" && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 rounded-xl p-6 border border-slate-700/50 shadow-lg">
                <div className="flex justify-between items-start mb-4">
                  <div className="rounded-full bg-blue-500/10 p-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.5 2a3.5 3.5 0 101.665 6.58L8.585 10l-1.42 1.42a3.5 3.5 0 101.414 1.414l8.128-8.127a1 1 0 00-1.414-1.414L10 8.586l-1.42-1.42A3.5 3.5 0 005.5 2zM4 5.5a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm0 9a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" clipRule="evenodd" />
                      <path d="M12.828 11.414a1 1 0 00-1.414 1.414l3.879 3.88a1 1 0 001.414-1.415l-3.879-3.879z" />
                    </svg>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-500/10 text-blue-400">
                    Total
                  </span>
                </div>
                <h3 className="text-2xl font-bold">{donationStats.totalDonations}</h3>
                <p className="text-slate-400 text-sm">Blood Donations</p>
              </div>
              
              <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 rounded-xl p-6 border border-slate-700/50 shadow-lg">
                <div className="flex justify-between items-start mb-4">
                  <div className="rounded-full bg-green-500/10 p-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-500/10 text-green-400">
                    Verified
                  </span>
                </div>
                <h3 className="text-2xl font-bold">{donationStats.verifiedDonations}</h3>
                <p className="text-slate-400 text-sm">Verified Donations</p>
              </div>
              
              <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 rounded-xl p-6 border border-slate-700/50 shadow-lg">
                <div className="flex justify-between items-start mb-4">
                  <div className="rounded-full bg-yellow-500/10 p-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-400">
                    Pending
                  </span>
                </div>
                <h3 className="text-2xl font-bold">{donationStats.pendingVerifications}</h3>
                <p className="text-slate-400 text-sm">Pending Verifications</p>
              </div>
              
              <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 rounded-xl p-6 border border-slate-700/50 shadow-lg">
                <div className="flex justify-between items-start mb-4">
                  <div className="rounded-full bg-purple-500/10 p-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-purple-500/10 text-purple-400">
                    NFTs
                  </span>
                </div>
                <h3 className="text-2xl font-bold">{donationStats.totalNFTsIssued}</h3>
                <p className="text-slate-400 text-sm">NFTs Issued</p>
              </div>
            </motion.div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <motion.div variants={itemVariants} className="lg:col-span-2">
                <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-700 shadow-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Recent Donations</h3>
                    <button 
                      onClick={() => setActiveTab("donations")}
                      className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      View All
                    </button>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-700">
                          <th className="text-left py-3 px-4 font-medium text-slate-400">Donor</th>
                          <th className="text-left py-3 px-4 font-medium text-slate-400">Blood Type</th>
                          <th className="text-left py-3 px-4 font-medium text-slate-400">Date</th>
                          <th className="text-left py-3 px-4 font-medium text-slate-400">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {donations.slice(0, 5).map((donation) => (
                          <tr key={donation.id} className="border-b border-slate-700/50 last:border-0">
                            <td className="py-3 px-4">{donation.name}</td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-1 bg-red-500/10 text-red-400 rounded-md text-xs">
                                {donation.bloodType}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-slate-400">{donation.date}</td>
                            <td className="py-3 px-4">
                              <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                                donation.status === 'verified' 
                                  ? 'bg-green-500/10 text-green-400' 
                                  : 'bg-yellow-500/10 text-yellow-400'
                              }`}>
                                {donation.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                        
                        {donations.length === 0 && (
                          <tr>
                            <td colSpan="4" className="py-4 px-4 text-center text-slate-400">
                              No donations found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-700 shadow-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Recent Activity</h3>
                    <button 
                      onClick={() => setActiveTab("blockchain")}
                      className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      View All
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {blockchainTransactions.slice(0, 4).map((activity) => (
                      <div key={activity.id} className="border-b border-slate-700/50 pb-4 last:border-0">
                        <div className="flex items-start">
                          <div className={`rounded-full p-2 mr-3 ${
                            activity.type === 'Donation Verification'
                              ? 'bg-blue-500/10 text-blue-400'
                              : activity.type === 'NFT Issuance'
                                ? 'bg-purple-500/10 text-purple-400'
                                : 'bg-green-500/10 text-green-400'
                          }`}>
                            {activity.type === 'Donation Verification' ? (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            ) : activity.type === 'NFT Issuance' ? (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" />
                                <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" />
                                <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z" />
                              </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          <div className="flex-1">
                            <div>
                              <p className="font-medium">{activity.type}</p>
                              <p className="text-sm text-slate-400">Donor: {activity.donor} • {activity.bloodType}</p>
                              <div className="flex items-center mt-1 text-xs">
                                <p className="text-slate-500">{activity.date}</p>
                                <a 
                                  href={`https://hiveblocks.com/tx/${activity.tx}`}
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="ml-2 text-green-500 hover:text-green-400 transition-colors"
                                >
                                  View Transaction
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {blockchainTransactions.length === 0 && (
                      <div className="py-4 text-center text-slate-400">
                        No recent activity found
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setShowAddDonationModal(true)}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-4 rounded-xl font-medium transition-all flex flex-col items-center justify-center shadow-lg hover:shadow-blue-500/20"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Donation
                  </button>
                  
                  <button
                    onClick={() => {
                      if (pendingDonations.length > 0) {
                        setActiveTab("donations");
                      } else {
                        alert("No pending donations to verify!");
                      }
                    }}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-4 rounded-xl font-medium transition-all flex flex-col items-center justify-center shadow-lg hover:shadow-green-500/20"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Verify Donations
                  </button>
                  
                  {!isHiveConnected && (
                    <button
                      onClick={connectToHive}
                      className="col-span-2 mt-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white py-3 rounded-xl font-medium transition-all flex items-center justify-center space-x-2 shadow-lg hover:shadow-orange-500/20"
                    >
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M13.32,12l6.59-6.59c0.39-0.39,0.39-1.02,0-1.41c-0.39-0.39-1.02-0.39-1.41,0L12,10.59L5.41,4c-0.39-0.39-1.02-0.39-1.41,0 C3.61,4.39,3.61,5.02,4,5.41L10.59,12L4,18.59c-0.39,0.39-0.39,1.02,0,1.41C4.2,20.2,4.49,20.3,4.77,20.3 c0.29,0,0.57-0.11,0.77-0.3L12,13.41l6.59,6.59c0.2,0.2,0.47,0.3,0.77,0.3s0.57-0.1,0.77-0.3c0.39-0.39,0.39-1.02,0-1.41 L13.32,12z"/>
                      </svg>
                      <span>Connect to Hive</span>
                    </button>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
        
        {/* Donations Tab Content */}
        {activeTab === "donations" && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Manage Donations</h2>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowAddDonationModal(true)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-lg font-medium text-white transition-all shadow-lg hover:shadow-blue-500/20 flex items-center space-x-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    <span>Add Donation</span>
                  </button>
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-4">
                <div>
                  <span className="text-sm text-slate-400">Total: </span>
                  <span className="text-sm font-medium">{donations.length} donations</span>
                  <span className="mx-2 text-slate-600">•</span>
                  <span className="text-sm text-slate-400">Pending: </span>
                  <span className="text-sm font-medium">{pendingDonations.length} donations</span>
                </div>
                
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search donations..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              
              <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-700 shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-left py-3 px-4 font-medium text-slate-400">ID</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-400">Donor Name</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-400">Blood Type</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-400">Date</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-400">Status</th>
                        <th className="text-right py-3 px-4 font-medium text-slate-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDonations.map((donation) => (
                        <tr key={donation.id} className="border-b border-slate-700/50 last:border-0">
                          <td className="py-3 px-4 font-mono text-sm">{donation.id}</td>
                          <td className="py-3 px-4">{donation.name}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 bg-red-500/10 text-red-400 rounded-md text-xs">
                              {donation.bloodType}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-400">{donation.date}</td>
                          <td className="py-3 px-4">
                            <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                              donation.status === 'verified' 
                                ? 'bg-green-500/10 text-green-400' 
                                : 'bg-yellow-500/10 text-yellow-400'
                            }`}>
                              {donation.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex justify-end space-x-2">
                              {donation.status === 'pending' ? (
                                <button 
                                  onClick={() => {
                                    setSelectedDonation(donation);
                                    setVerificationNotes('');
                                    setShowVerifyDonationModal(true);
                                  }}
                                  className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors"
                                  title="Verify Donation"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </button>
                              ) : (
                                <button 
                                  onClick={() => issueNFT(donation.id)}
                                  className="p-2 bg-purple-500/10 text-purple-400 rounded-lg hover:bg-purple-500/20 transition-colors"
                                  title="Issue NFT"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" />
                                    <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" />
                                    <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z" />
                                  </svg>
                                </button>
                              )}
                              
                              <button 
                                onClick={() => {
                                  setSelectedDonation(donation);
                                  alert(`Donation details for ${donation.id}:\nDonor: ${donation.name}\nBlood Type: ${donation.bloodType}\nDate: ${donation.date}\nStatus: ${donation.status}\nNotes: ${donation.notes || 'None'}`);
                                }}
                                className="p-2 bg-slate-600/30 text-slate-300 rounded-lg hover:bg-slate-600/50 transition-colors"
                                title="View Details"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      
                      {filteredDonations.length === 0 && (
                        <tr>
                          <td colSpan="6" className="py-4 px-4 text-center text-slate-400">
                            {searchTerm ? "No donations match your search" : "No donations found"}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
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
              <h2 className="text-xl font-semibold mb-4">Blockchain Activity</h2>
              
              <div className="flex justify-between items-center mb-4">
                <div className="flex space-x-2">
                  <button 
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition-colors"
                    onClick={() => {/* Filter all transactions */}}
                  >
                    All
                  </button>
                  <button 
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition-colors"
                    onClick={() => {/* Filter verifications */}}
                  >
                    Verifications
                  </button>
                  <button 
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition-colors"
                    onClick={() => {/* Filter NFT issuances */}}
                  >
                    NFT Issuances
                  </button>
                </div>
                
                <button 
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1"
                  onClick={() => {
                    if (!isHiveConnected) {
                      alert("Please connect to Hive first!");
                      return;
                    }
                    window.open(`https://hiveblocks.com/@${hiveUsername}`, '_blank');
                  }}
                >
                  <span>View on Explorer</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                    <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                  </svg>
                </button>
              </div>
              
              <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-700 shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-left py-3 px-4 font-medium text-slate-400">Type</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-400">Donor</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-400">Blood Type</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-400">Date</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-400">Transaction ID</th>
                        <th className="text-right py-3 px-4 font-medium text-slate-400">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {blockchainTransactions.map((tx) => (
                        <tr key={tx.id} className="border-b border-slate-700/50 last:border-0">
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-md text-xs ${
                              tx.type === 'Donation Verification' 
                                ? 'bg-blue-500/10 text-blue-400'
                                : tx.type === 'New Donation'
                                  ? 'bg-green-500/10 text-green-400'
                                  : 'bg-purple-500/10 text-purple-400'
                            }`}>
                              {tx.type}
                            </span>
                          </td>
                          <td className="py-3 px-4">{tx.donor}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 bg-red-500/10 text-red-400 rounded-md text-xs">
                              {tx.bloodType}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-400">{tx.date}</td>
                          <td className="py-3 px-4 font-mono text-xs text-slate-400">
                            <a 
                              href={`https://hiveblocks.com/tx/${tx.tx}`}
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="hover:text-green-400 transition-colors"
                            >
                              {tx.tx.substring(0, 16)}...
                            </a>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span className="px-2 py-1 bg-green-500/10 text-green-400 rounded-full text-xs">
                              {tx.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                      
                      {blockchainTransactions.length === 0 && (
                        <tr>
                          <td colSpan="6" className="py-4 px-4 text-center text-slate-400">
                            No blockchain activity found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
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
            <motion.div variants={itemVariants} className="mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Hospital Profile</h2>
                
                <button
                  onClick={() => setShowSettingsModal(true)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg font-medium transition-colors flex items-center space-x-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                  <span>Edit Settings</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-700 shadow-lg p-6">
                    <div className="flex flex-col items-center">
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      
                      <h3 className="text-xl font-semibold mb-1">{hospitalData?.Hospital_Name || "Hospital Name"}</h3>
                      <p className="text-slate-400 text-sm mb-3">{hospitalData?.City || "City"}, {hospitalData?.State || "State"}</p>
                      
                      {hospitalData?.Verified && (
                        <div className="flex items-center bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-sm font-medium mt-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Verified Hospital
                        </div>
                      )}
                      
                      <div className="w-full border-t border-slate-700 my-6"></div>
                      
                      <div className="w-full">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-slate-400">License Number:</span>
                          <span className="font-medium">{hospitalData?.License_Number || "N/A"}</span>
                        </div>
                        
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-slate-400">Total Donations:</span>
                          <span className="font-medium">{donations.length}</span>
                        </div>
                        
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-slate-400">NFTs Issued:</span>
                          <span className="font-medium">{donationStats.totalNFTsIssued}</span>
                        </div>
                        
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-slate-400">Hive Account:</span>
                          <span className="font-medium">
                            {isHiveConnected ? (
                              <a 
                                href={`https://peakd.com/@${hiveUsername}`}
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 transition-colors"
                              >
                                @{hiveUsername}
                              </a>
                            ) : (
                              <button 
                                onClick={connectToHive}
                                className="text-blue-400 hover:text-blue-300 transition-colors"
                              >
                                Connect
                              </button>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="lg:col-span-2">
                  <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-700 shadow-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Hospital Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-slate-400 text-sm mb-1">Address</p>
                        <p className="font-medium">{hospitalData?.Address || "N/A"}</p>
                      </div>
                      
                      <div>
                        <p className="text-slate-400 text-sm mb-1">City, State</p>
                        <p className="font-medium">{hospitalData?.City || "N/A"}, {hospitalData?.State || "N/A"} {hospitalData?.Zip || ""}</p>
                      </div>
                      
                      <div>
                        <p className="text-slate-400 text-sm mb-1">Phone</p>
                        <p className="font-medium">{hospitalData?.Phone || "N/A"}</p>
                      </div>
                      
                      <div>
                        <p className="text-slate-400 text-sm mb-1">Email</p>
                        <p className="font-medium">{hospitalData?.Email || "N/A"}</p>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-4">Donation Statistics</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-slate-700/50 rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-slate-400 text-sm">Blood Type A+</span>
                            <span className="px-2 py-1 bg-red-500/10 text-red-400 rounded-md text-xs">
                              A+
                            </span>
                          </div>
                          <p className="text-2xl font-bold">{donations.filter(d => d.bloodType === 'A+').length}</p>
                          <p className="text-slate-400 text-sm">donations</p>
                        </div>
                        
                        <div className="bg-slate-700/50 rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-slate-400 text-sm">Blood Type O-</span>
                            <span className="px-2 py-1 bg-red-500/10 text-red-400 rounded-md text-xs">
                              O-
                            </span>
                          </div>
                          <p className="text-2xl font-bold">{donations.filter(d => d.bloodType === 'O-').length}</p>
                          <p className="text-slate-400 text-sm">donations</p>
                        </div>
                        
                        <div className="bg-slate-700/50 rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-slate-400 text-sm">All Types</span>
                            <span className="px-2 py-1 bg-slate-600/50 text-slate-300 rounded-md text-xs">
                              All
                            </span>
                          </div>
                          <p className="text-2xl font-bold">{donations.length}</p>
                          <p className="text-slate-400 text-sm">total donations</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </main>
      
      {/* Add Donation Modal */}
      {showAddDonationModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            className="bg-slate-800 rounded-xl max-w-md w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="p-4 border-b border-slate-700 flex justify-between items-center">
              <h3 className="text-xl font-semibold">Add New Donation</h3>
              <button 
                onClick={() => setShowAddDonationModal(false)}
                className="p-2 rounded-lg hover:bg-slate-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-400 mb-1">Donor Name</label>
                <input
                  type="text"
                  value={newDonation.name}
                  onChange={(e) => setNewDonation({...newDonation, name: e.target.value})}
                  className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter donor name"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-400 mb-1">Donor ID (optional)</label>
                <input
                  type="text"
                  value={newDonation.id}
                  onChange={(e) => setNewDonation({...newDonation, id: e.target.value})}
                  className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter donor ID or leave blank for auto-generation"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-400 mb-1">Blood Type</label>
                <select
                  value={newDonation.bloodType}
                  onChange={(e) => setNewDonation({...newDonation, bloodType: e.target.value})}
                  className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-400 mb-1">Blood Amount (ml)</label>
                <input
                  type="number"
                  value={newDonation.amount}
                  onChange={(e) => setNewDonation({...newDonation, amount: e.target.value})}
                  className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter blood amount in ml"
                  min="100"
                  max="500"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-400 mb-1">Donation Date</label>
                <input
                  type="date"
                  value={newDonation.date}
                  onChange={(e) => setNewDonation({...newDonation, date: e.target.value})}
                  className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-400 mb-1">Hive Username</label>
                <input
                  type="text"
                  value={newDonation.hiveUsername}
                  onChange={(e) => setNewDonation({...newDonation, hiveUsername: e.target.value})}
                  className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter donor's Hive username (required for NFT)"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-400 mb-1">Notes (optional)</label>
                <textarea
                  value={newDonation.notes}
                  onChange={(e) => setNewDonation({...newDonation, notes: e.target.value})}
                  className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter any additional information"
                  rows={3}
                ></textarea>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowAddDonationModal(false)}
                  className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition-all"
                >
                  Cancel
                </button>
                
                <button
                  onClick={addDonation}
                  className="flex-1 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-lg font-medium transition-all shadow-lg hover:shadow-blue-500/20"
                >
                  Add Donation
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Verify Donation Modal */}
      {showVerifyDonationModal && selectedDonation && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            className="bg-slate-800 rounded-xl max-w-md w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="p-4 border-b border-slate-700 flex justify-between items-center">
              <h3 className="text-xl font-semibold">Verify Donation</h3>
              <button 
                onClick={() => setShowVerifyDonationModal(false)}
                className="p-2 rounded-lg hover:bg-slate-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <div className="bg-slate-700/50 rounded-lg p-4 mb-4">
                <div className="grid grid-cols-2 gap-4 mb-2">
                  <div>
                    <p className="text-slate-400 text-sm mb-1">Donor Name</p>
                    <p className="font-medium">{selectedDonation.name}</p>
                  </div>
                  
                  <div>
                    <p className="text-slate-400 text-sm mb-1">Donor ID</p>
                    <p className="font-medium font-mono text-sm">{selectedDonation.id}</p>
                  </div>
                  
                  <div>
                    <p className="text-slate-400 text-sm mb-1">Blood Type</p>
                    <p className="font-medium">
                      <span className="px-2 py-1 bg-red-500/10 text-red-400 rounded-md text-xs">
                        {selectedDonation.bloodType}
                      </span>
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-slate-400 text-sm mb-1">Date</p>
                    <p className="font-medium">{selectedDonation.date}</p>
                  </div>
                </div>
                
                {selectedDonation.notes && (
                  <div>
                    <p className="text-slate-400 text-sm mb-1">Notes</p>
                    <p className="text-slate-300">{selectedDonation.notes}</p>
                  </div>
                )}
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-400 mb-1">Verification Notes (optional)</label>
                <textarea
                  value={verificationNotes}
                  onChange={(e) => setVerificationNotes(e.target.value)}
                  className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter any verification notes"
                  rows={3}
                ></textarea>
              </div>
              
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="verify-checkbox"
                  className="w-4 h-4 text-green-500 border-slate-600 rounded focus:ring-green-500 focus:ring-2 bg-slate-700"
                />
                <label htmlFor="verify-checkbox" className="ml-2 text-sm text-slate-300">
                  I confirm that all donor information has been verified and is accurate
                </label>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowVerifyDonationModal(false)}
                  className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition-all"
                >
                  Cancel
                </button>
                
                <button
                  onClick={() => verifyDonation(selectedDonation.id)}
                  className="flex-1 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-lg font-medium transition-all shadow-lg hover:shadow-green-500/20"
                >
                  Verify Donation
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            className="bg-slate-800 rounded-xl max-w-md w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="p-4 border-b border-slate-700 flex justify-between items-center">
              <h3 className="text-xl font-semibold">Hospital Settings</h3>
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
              <form onSubmit={updateHospitalProfile}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-400 mb-1">Hospital Name</label>
                  <input
                    type="text"
                    defaultValue={hospitalData?.Hospital_Name || ""}
                    className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter hospital name"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-400 mb-1">License Number</label>
                  <input
                    type="text"
                    defaultValue={hospitalData?.License_Number || ""}
                    className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter license number"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-400 mb-1">Email</label>
                  <input
                    type="email"
                    defaultValue={hospitalData?.Email || ""}
                    className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter email address"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-400 mb-1">Phone</label>
                  <input
                    type="tel"
                    defaultValue={hospitalData?.Phone || ""}
                    className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter phone number"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-400 mb-1">Address</label>
                  <input
                    type="text"
                    defaultValue={hospitalData?.Address || ""}
                    className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter address"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">City</label>
                    <input
                      type="text"
                      defaultValue={hospitalData?.City || ""}
                      className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Enter city"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">State</label>
                    <input
                      type="text"
                      defaultValue={hospitalData?.State || ""}
                      className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Enter state"
                    />
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <motion.button
                    type="button"
                    className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowSettingsModal(false)}
                  >
                    Cancel
                  </motion.button>
                  
                  <motion.button
                    type="submit"
                    className="flex-1 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-lg font-medium transition-all shadow-lg hover:shadow-green-500/20"
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

      {showMintNFT && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Mint Blood Donation NFT</h2>
            <form onSubmit={handleMintNFT}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Donor ID</label>
                  <input
                    type="text"
                    value={nftData.donorId}
                    onChange={(e) => setNftData({...nftData, donorId: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Donor Name</label>
                  <input
                    type="text"
                    value={nftData.name}
                    onChange={(e) => setNftData({...nftData, name: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Blood Type</label>
                  <select
                    value={nftData.bloodType}
                    onChange={(e) => setNftData({...nftData, bloodType: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    required
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Amount (ml)</label>
                  <input
                    type="number"
                    value={nftData.amount}
                    onChange={(e) => setNftData({...nftData, amount: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">IPFS Hash</label>
                  <input
                    type="text"
                    value={nftData.ipfsHash}
                    onChange={(e) => setNftData({...nftData, ipfsHash: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowMintNFT(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                >
                  Mint NFT
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default HospitalDashboard;