# LifeNFT Architecture Guide

## Overview

LifeNFT follows a modern React architecture with separation of concerns and component-based design. This document outlines the key architectural decisions and patterns used in the project.

## Core Architecture Principles

1. **Component-Based Design**: UI is broken down into reusable components
2. **Context API for State Management**: Global state is managed through React Context
3. **Custom Hooks for Logic Reuse**: Business logic is encapsulated in custom hooks
4. **Service Layer for External Interactions**: API and blockchain calls are abstracted in services
5. **Responsive Design**: Mobile-first approach using Tailwind CSS

## Data Flow 

┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ Context     │     │ Services    │     │ External    │
│ Providers   │     │             │     │ Sources     │
└─────┬───────┘     └─────────────┘     └─────────────┘
│ ▲
▼ │
┌─────────────┐     ┌─────────────┐     ┌─────┴───────┐
│ Hooks       │────►│       Pages │────►│ Services    │
└─────────────┘     └─────────────┘     └─────────────┘
│
▼
┌─────────────┐
│ Components  │
└─────────────┘

## Key Subsystems

### Authentication System
- Leverages Hive Keychain for secure authentication
- Sign-in process uses cryptographic signatures
- Session management through Context API and localStorage

### Donation Management
- CRUD operations for donations
- Status tracking (pending, verified, NFT issued)
- Search and filtering capabilities
- Verification workflow

### Blockchain Integration
- Custom JSON operations for recording data on Hive
- Transaction creation and broadcasting
- NFT issuance and tracking
- Transaction history management

### Hospital Profile Management
- Hospital information management
- Settings configuration
- Statistics and analytics

## State Management

The application uses React Context API for state management with the following contexts:

1. **AuthContext**: Manages authentication state and user information
2. **DonationContext**: Manages donation data and operations
3. **HospitalContext**: Manages hospital profile data
4. **BlockchainContext**: Manages blockchain connection and transactions

## Blockchain Integration

LifeNFT uses the Hive blockchain as its underlying distributed ledger with:

1. **Custom JSON Operations**: Used to store donation and verification data
2. **Hive Keychain**: Browser extension for secure signing of transactions
3. **NFT Layer**: Custom implementation for issuing NFTs to donors

Each blockchain operation follows this flow:
1. Prepare transaction data
2. Request signature via Hive Keychain
3. Broadcast transaction to the Hive network
4. Handle response and update UI accordingly

## Performance Considerations

1. **Code Splitting**: Implemented via React Router
2. **Memoization**: React.memo and useMemo to prevent unnecessary re-renders
3. **Virtualization**: For long lists (donations, transactions)
4. **Lazy Loading**: For images and non-critical components

## Security Measures

1. **No Private Keys Stored**: All blockchain operations use Hive Keychain
2. **Input Validation**: All user inputs are validated
3. **Secure Storage**: Sensitive data is not stored in plaintext
4. **Transaction Verification**: All blockchain transactions are verified

## Testing Strategy

1. **Unit Tests**: For utils, services, and hooks
2. **Component Tests**: For UI components
3. **Integration Tests**: For component interactions
4. **E2E Tests**: For complete user flows

## Future Scalability

The architecture is designed to scale with:

1. **Modular Components**: Easy to add new features
2. **Service Abstraction**: Can switch blockchain providers if needed
3. **Responsive Design**: Works on various device sizes
4. **Extensible State Management**: Can add new contexts as needed