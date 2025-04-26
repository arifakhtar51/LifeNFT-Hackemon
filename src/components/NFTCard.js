import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function NFTCard({ nft }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Using refs to prevent unnecessary re-renders
  const cardRef = useRef(null);
  
  // Handle purchase button click
  const handlePurchase = () => {
    alert(`Thank you for supporting blood donation initiatives! Your purchase of "${nft.name}" for ${nft.price} is being processed.`);
  };
  
  // Handle like button click
  const handleLike = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };
  
  // Handle card click to show modal
  const handleCardClick = () => {
    setIsModalOpen(true);
  };
  
  // Close modal when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (isModalOpen && cardRef.current && !cardRef.current.contains(event.target)) {
        setIsModalOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen]);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-slate-800 rounded-xl overflow-hidden shadow-lg hover:shadow-purple-500/20 transition-shadow"
    >
      {nft.image && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={nft.image}
            alt={`Blood Donation NFT - ${nft.bloodType}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://images.unsplash.com/photo-1582719471384-894fbb16e074?ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
        </div>
      )}

      <div className="p-6">
        <h3 className="text-xl font-semibold mb-4 text-white">
          {nft.name}
        </h3>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Donor</span>
            <span className="text-white font-medium">{nft.donorName}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Blood Type</span>
            <span className="text-white font-medium">{nft.bloodType}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Amount</span>
            <span className="text-white font-medium">{nft.amount}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Date</span>
            <span className="text-white font-medium">
              {new Date(nft.createdAt).toLocaleDateString()}
            </span>
          </div>

          {nft.hiveUsername && (
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Hive Username</span>
              <span className="text-white font-medium">@{nft.hiveUsername}</span>
            </div>
          )}
        </div>

        {nft.tokenId && (
          <div className="mt-6 pt-4 border-t border-slate-700">
            <p className="text-sm text-slate-400">
              Token ID: <span className="text-purple-400">{nft.tokenId}</span>
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}