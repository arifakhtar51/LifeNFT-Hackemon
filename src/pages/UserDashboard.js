import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import NFTCard from '../components/NFTCard';

export default function UserDashboard() {
  const [nfts, setNfts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchUsername, setSearchUsername] = useState('');

  const fetchHiveTransactions = async (username) => {
    if (!username) return;
    
    setIsLoading(true);
    try {
      // Clean up Hive username (remove @ if present)
      const cleanUsername = username.startsWith('@') 
        ? username.substring(1) 
        : username;
      
      console.log('Fetching Hive transactions for:', cleanUsername);
      
      // Fetch account history from Hive
      const response = await fetch('https://api.hive.blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'condenser_api.get_account_history',
          params: [cleanUsername, -1, 100],
          id: 1
        })
      });

      const data = await response.json();
      console.log('Hive API response:', data);
      
      if (data.result) {
        // Filter for blooddonornft_issue operations
        const nftTransactions = data.result.filter(op => {
          return op[1].op[0] === 'custom_json' && 
                 op[1].op[1].id === 'blooddonornft_issue';
        });

        // Parse and format NFT data
        const nftData = nftTransactions.map(tx => {
          try {
            const nftData = JSON.parse(tx[1].op[1].json);
            const attributes = nftData.data.nft_metadata?.attributes || [];
            const amount = attributes.find(attr => attr.trait_type === "Amount")?.value || "450 ml";
            
            return {
              id: `NFT-${tx[1].trx_id}`,
              name: nftData.data.nft_metadata?.name || "Blood Donation NFT",
              description: nftData.data.nft_metadata?.description || "",
              bloodType: nftData.data.blood_type || "Unknown",
              hospitalName: nftData.data.hospital || "Unknown Hospital",
              createdAt: nftData.data.donation_date || new Date().toISOString(),
              txHash: tx[1].trx_id,
              status: "confirmed",
              hiveUsername: nftData.data.recipient || "Unknown",
              donorName: nftData.data.donor_name || "Unknown Donor",
              donorId: nftData.data.donor_id || "Unknown",
              image: nftData.data.nft_metadata?.image || "https://images.unsplash.com/photo-1582719471384-894fbb16e074?ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80",
              attributes: attributes,
              amount: amount,
              timestamp: nftData.data.donation_date || new Date().toISOString()
            };
          } catch (error) {
            console.error('Error processing NFT data:', error);
            return null;
          }
        }).filter(Boolean); // Remove any null entries from failed processing

        console.log('Processed NFT data:', nftData);
        setNfts(nftData);
      } else {
        console.log('No transactions found');
        setNfts([]);
      }
    } catch (err) {
      console.error('Error fetching Hive transactions:', err);
      setError(err.message || 'Failed to fetch transactions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchUsername) {
      setError('Please enter a Hive username');
      return;
    }
    fetchHiveTransactions(searchUsername);
  };
    
  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Blood Donation NFTs</h1>
        </div>

        {/* Search Section */}
        <div className="mb-8">
          <div className="flex gap-4 max-w-md">
            <input
              type="text"
              value={searchUsername}
              onChange={(e) => setSearchUsername(e.target.value)}
              placeholder="Enter Hive username to search"
              className="flex-1 p-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSearch}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-semibold hover:opacity-90 transition-all"
            >
              Search NFTs
            </motion.button>
          </div>
          {error && (
            <p className="mt-2 text-red-500">{error}</p>
          )}
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        ) : nfts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nfts.map((nft, index) => (
              <NFTCard key={index} nft={nft} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-800/50 rounded-lg">
            <p className="text-xl text-slate-400">No NFTs found</p>
            <p className="text-slate-500 mt-2">
              {searchUsername 
                ? `No blood donation NFTs found for @${searchUsername}`
                : 'Enter a Hive username to search for NFTs'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}