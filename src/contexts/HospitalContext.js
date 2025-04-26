import React, { createContext, useState, useContext, useEffect } from 'react';

const HospitalContext = createContext();

export const HospitalProvider = ({ children }) => {
  const [hospitals, setHospitals] = useState(() => {
    // Try to load hospitals from localStorage
    const savedHospitals = localStorage.getItem('hospitals');
    return savedHospitals ? JSON.parse(savedHospitals) : [];
  });
  const [nfts, setNfts] = useState(() => {
    const savedNfts = localStorage.getItem('nfts');
    return savedNfts ? JSON.parse(savedNfts) : [];
  });

  // Save NFTs to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('nfts', JSON.stringify(nfts));
  }, [nfts]);

  // Generate random credentials
  const generateCredentials = () => {
    const username = `HOSP${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const password = Math.random().toString(36).substring(2, 10);
    return { username, password };
  };

  // Add new hospital
  const addHospital = (hospitalData) => {
    const credentials = generateCredentials();
    const newHospital = {
      ...hospitalData,
      ...credentials,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      verificationStatus: "pending"
    };
    
    const updatedHospitals = [...hospitals, newHospital];
    setHospitals(updatedHospitals);
    
    // Save to localStorage
    localStorage.setItem('hospitals', JSON.stringify(updatedHospitals));
    
    return credentials;
  };

  // Verify hospital credentials
  const verifyHospitalCredentials = (username, password) => {
    const hospital = hospitals.find(h => h.username === username && h.password === password);
    if (hospital) {
      return {
        success: true,
        user: {
          ...hospital,
          Role: 'hospital',
          userId: hospital.username
        }
      };
    }
    return {
      success: false,
      message: "Invalid credentials"
    };
  };

  // Update hospital
  const updateHospital = (id, updates) => {
    const updatedHospitals = hospitals.map(hospital => 
      hospital.id === id ? { ...hospital, ...updates } : hospital
    );
    setHospitals(updatedHospitals);
    localStorage.setItem('hospitals', JSON.stringify(updatedHospitals));
  };

  // Reset hospital password
  const resetHospitalPassword = (id) => {
    const newPassword = Math.random().toString(36).substring(2, 10);
    const updatedHospitals = hospitals.map(hospital => 
      hospital.id === id ? { ...hospital, password: newPassword } : hospital
    );
    setHospitals(updatedHospitals);
    localStorage.setItem('hospitals', JSON.stringify(updatedHospitals));
    return newPassword;
  };

  // Get hospital by username
  const getHospitalByUsername = (username) => {
    return hospitals.find(h => h.username === username);
  };

  // Add new NFT with Hive blockchain integration
  const mintNFT = async (nftData, hospitalData) => {
    try {
      if (!window.hive_keychain) {
        throw new Error("Hive Keychain is not installed");
      }

      console.log('Minting NFT with data:', nftData);
      console.log('Hospital data:', hospitalData);

      // Ensure we have a valid Hive username
      if (!nftData.hiveUsername) {
        throw new Error("Hive username is required to mint NFT");
      }

      // Clean up Hive username (remove @ if present)
      const cleanHiveUsername = nftData.hiveUsername.startsWith('@') 
        ? nftData.hiveUsername.substring(1) 
        : nftData.hiveUsername;

      const customJson = {
        app: "lifenft",
        action: "mint_nft",
        data: {
          donor: cleanHiveUsername,
          hospital: hospitalData.name,
          hospitalId: hospitalData.id,
          bloodType: nftData.bloodType,
          donationDate: new Date().toISOString(),
          amount: nftData.amount,
          nftId: `NFT-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`
        }
      };

      console.log('Custom JSON for blockchain:', customJson);

      // Broadcast to Hive blockchain
      return new Promise((resolve, reject) => {
        window.hive_keychain.requestCustomJson(
          hospitalData.username, // Hospital's Hive username
          "lifenft_mint_nft",
          "Active",
          JSON.stringify(customJson),
          `Mint Blood Donation NFT for ${cleanHiveUsername}`,
          async (response) => {
            if (response.success) {
              const newNFT = {
                ...nftData,
                id: customJson.data.nftId,
                createdAt: customJson.data.donationDate,
                hospitalName: hospitalData.name,
                hospitalId: hospitalData.id,
                txHash: response.result.id,
                status: "confirmed",
                hiveUsername: cleanHiveUsername // Ensure Hive username is stored
              };

              console.log('Created new NFT:', newNFT);

              // Get existing NFTs from localStorage
              const existingNfts = JSON.parse(localStorage.getItem('nfts') || '[]');
              console.log('Existing NFTs:', existingNfts);

              // Add new NFT to the list
              const updatedNfts = [...existingNfts, newNFT];
              console.log('Updated NFTs list:', updatedNfts);

              // Save to localStorage
              localStorage.setItem('nfts', JSON.stringify(updatedNfts));
              setNfts(updatedNfts);

              console.log('NFT saved to localStorage and state');
              resolve(newNFT);
            } else {
              console.error('Failed to mint NFT:', response.message);
              reject(new Error(response.message));
            }
          }
        );
      });
    } catch (error) {
      console.error("Error in mintNFT:", error);
      throw new Error(`Failed to mint NFT: ${error.message}`);
    }
  };

  // Get NFTs for a specific Hive user
  const getUserNFTs = (hiveUsername) => {
    if (!hiveUsername) return [];
    
    // Remove @ symbol if present
    const username = hiveUsername.startsWith('@') ? hiveUsername.substring(1) : hiveUsername;
    
    // Get NFTs from localStorage
    const savedNfts = JSON.parse(localStorage.getItem('nfts') || '[]');
    console.log('All saved NFTs:', savedNfts);
    
    // Filter NFTs for this user
    const userNFTs = savedNfts.filter(nft => {
      const nftUsername = nft.hiveUsername?.startsWith('@') 
        ? nft.hiveUsername.substring(1) 
        : nft.hiveUsername;
      console.log('Comparing NFT username:', nftUsername, 'with user:', username);
      return nftUsername === username;
    });
    
    console.log('Found NFTs for user:', username, userNFTs);
    return userNFTs;
  };

  // Fetch NFTs from Hive blockchain
  const fetchHiveNFTs = async (hiveUsername) => {
    try {
      if (!hiveUsername) return [];

      // Remove @ symbol if present
      const username = hiveUsername.startsWith('@') ? hiveUsername.substring(1) : hiveUsername;

      // Fetch custom_json operations from Hive blockchain
      const response = await fetch(`https://api.hive.blog`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'condenser_api.get_account_history',
          params: [username, -1, 100],
          id: 1
        })
      });

      const data = await response.json();
      
      if (data.result) {
        // Filter for lifenft_mint_nft operations
        const nftOperations = data.result.filter(op => {
          return op[1].op[0] === 'custom_json' && 
                 op[1].op[1].id === 'lifenft_mint_nft';
        });

        // Parse and format NFT data
        const blockchainNFTs = nftOperations.map(op => {
          const nftData = JSON.parse(op[1].op[1].json);
          return {
            id: nftData.data.nftId,
            hiveUsername: nftData.data.donor,
            bloodType: nftData.data.bloodType,
            amount: nftData.data.amount,
            hospitalName: nftData.data.hospital,
            hospitalId: nftData.data.hospitalId,
            createdAt: nftData.data.donationDate,
            txHash: op[1].trx_id,
            status: "confirmed"
          };
        });

        // Update local NFTs with blockchain data
        const savedNfts = JSON.parse(localStorage.getItem('nfts') || '[]');
        const updatedNfts = [...savedNfts];
        
        blockchainNFTs.forEach(blockchainNft => {
          if (!updatedNfts.some(n => n.id === blockchainNft.id)) {
            updatedNfts.push(blockchainNft);
          }
        });
        
        // Save updated NFTs to localStorage
        localStorage.setItem('nfts', JSON.stringify(updatedNfts));
        setNfts(updatedNfts);

        return blockchainNFTs;
      }
      return [];
    } catch (error) {
      console.error("Error fetching NFTs from Hive:", error);
      return [];
    }
  };

  return (
    <HospitalContext.Provider value={{
      hospitals,
      nfts,
      addHospital,
      updateHospital,
      resetHospitalPassword,
      verifyHospitalCredentials,
      getHospitalByUsername,
      mintNFT,
      getUserNFTs,
      fetchHiveNFTs
    }}>
      {children}
    </HospitalContext.Provider>
  );
};

export const useHospital = () => {
  const context = useContext(HospitalContext);
  if (!context) {
    throw new Error('useHospital must be used within a HospitalProvider');
  }
  return context;
}; 