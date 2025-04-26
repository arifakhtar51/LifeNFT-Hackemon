# LifeNFT - Blockchain Blood Donation Management System

## Overview
LifeNFT is a decentralized application that enables hospitals to manage blood donations, verify them on the Hive blockchain, and issue NFTs to donors as proof of their contribution.

## Features
- Hospital dashboard for donation management
- Blockchain verification of donations
- NFT issuance for verified donations
- Donor tracking and management
- Real-time blockchain transaction monitoring
- Hospital profile and settings management

## Technology Stack
- React.js for frontend UI
- Tailwind CSS for styling
- Framer Motion for animations
- Hive blockchain for data storage and verification
- Hive Keychain for secure authentication
- LocalStorage for persistent data storage

## Project Structure
The project follows a component-based architecture with separate directories for:
- Components: Reusable UI components
- Pages: Main application views
- Context: Global state management
- Hooks: Custom React hooks
- Services: API and blockchain integration
- Utils: Helper functions and utilities
- Assets: Images, icons, and other static files

## Getting Started

### Prerequisites
- Node.js (v14+)
- npm or yarn
- Hive Keychain browser extension

### Installation
1. Clone the repository
   ```
   git clone https://github.com/yourusername/lifenft.git
   cd lifenft
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Start the development server
   ```
   npm start
   ```

4. Build for production
   ```
   npm run build
   ```

## Blockchain Integration
LifeNFT uses the Hive blockchain for:
1. Authenticating hospitals via Hive Keychain
2. Recording donations as custom_json operations
3. Verifying donations with cryptographic signatures
4. Issuing NFTs to donors as proof of donation

## Contributing
[Instructions for contributors...]

## License
[Your license information...]
