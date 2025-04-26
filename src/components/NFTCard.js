import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function NFTCard({ nft, onContactDonor }) {
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
      className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden hover:border-purple-500/50 transition-colors"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={nft.image}
          alt={nft.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-white">{nft.name}</h3>
            <p className="text-sm text-slate-400">
              Donated by {nft.donorName}
            </p>
          </div>
          <span className="bg-slate-700 px-3 py-1 rounded text-white font-bold">
            {nft.bloodType}
          </span>
        </div>
        
        <p className="text-slate-300 mb-4">{nft.description}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex justify-between">
            <span className="text-slate-400">Hospital</span>
            <span className="font-medium">{nft.hospitalName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Amount</span>
            <span className="font-medium">{nft.amount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Date</span>
            <span className="font-medium">
              {new Date(nft.timestamp).toLocaleDateString()}
            </span>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center text-slate-400">
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {nft.hospitalName}
          </div>
          <button
            onClick={() => onContactDonor(nft.donorName)}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:opacity-90 transition-all"
          >
            Contact Donor
          </button>
        </div>
      </div>
    </motion.div>
  );
}