# Hive Blockchain Integration Guide

## Overview

LifeNFT uses the Hive blockchain for secure, transparent record-keeping of blood donations and for issuing NFTs to donors. This document explains how the integration works and how to use it.

## Prerequisites

- Hive account
- Hive Keychain browser extension
- Understanding of basic blockchain concepts

## Authentication Flow

1. **Connection Request**:
   ```javascript
   function connectToHive() {
     if (window.hive_keychain) {
       const username = prompt("Enter your Hive username:");
       if (!username) return;
       
       window.hive_keychain.requestSignBuffer(
         username,
         `I am connecting to LifeNFT at ${new Date().toISOString()}`,
         "Posting",
         (response) => {
           if (response.success) {
             // User authenticated successfully
             setHiveUsername(username);
             setIsHiveConnected(true);
           }
         }
       );
     }
   }
   ```

2. **Verification**: The signature verifies the user owns the private key associated with the username.

3. **Session Management**: After successful authentication, the username is stored in context and localStorage for session persistence.

## Data Storage on Blockchain

All donation data is stored on the Hive blockchain using custom_json operations:

1. **Creating a Donation Record**:
   ```javascript
   const customJson = {
     app: "blooddonornft",
     action: "create_donation",
     data: {
       hospital: hospitalName,
       donor_id: donationId,
       donor_name: donorName,
       blood_type: bloodType,
       donation_date: donationDate,
       // Other relevant data
     }
   };
   
   window.hive_keychain.requestCustomJson(
     username,
     "blooddonornft_create",
     "Active",
     JSON.stringify(customJson),
     "Create Blood Donation Record",
     handleResponse
   );
   ```

2. **Verifying a Donation**:
   ```javascript
   const customJson = {
     app: "blooddonornft",
     action: "verify_donation",
     data: {
       hospital: hospitalName,
       donor_id: donationId,
       verification_date: new Date().toISOString(),
       verified_by: username,
       // Other verification data
     }
   };
   
   window.hive_keychain.requestCustomJson(
     username,
     "blooddonornft_verify",
     "Active",
     JSON.stringify(customJson),
     "Verify Blood Donation",
     handleResponse
   );
   ```

3. **Issuing an NFT**:
   ```javascript
   const customJson = {
     app: "blooddonornft",
     action: "issue_nft",
     data: {
       hospital: hospitalName,
       donor_id: donationId,
       donor_name: donorName,
       blood_type: bloodType,
       nft_metadata: {
         name: `Blood Donation - ${bloodType}`,
         description: `Donation at ${hospitalName} on ${donationDate}`,
         // Other NFT metadata
       }
     }
   };
   
   window.hive_keychain.requestCustomJson(
     username,
     "blooddonornft_issue",
     "Active",
     JSON.stringify(customJson),
     "Issue NFT for Donation",
     handleResponse
   );
   ```

## Transaction Handling

For each blockchain transaction:

1. **Prepare Data**: Format data according to the operation type
2. **Request Signature**: Use Hive Keychain to sign the transaction
3. **Handle Response**: Process the blockchain response
4. **Update UI**: Reflect the transaction status in the UI
5. **Error Handling**: Handle potential blockchain errors

Example response handling:

javascript
function handleResponse(response) {
if (response.success) {
// Add transaction to local history
const newTransaction = {
id: tx${Math.floor(Math.random() * 10000)},
type: 'NFT Issuance',
donor: donorName,
bloodType: bloodType,
date: new Date().toLocaleString(),
tx: response.result.id,
status: 'confirmed'
};
setBlockchainTransactions([newTransaction, ...blockchainTransactions]);
localStorage.setItem("blockchainTransactions", JSON.stringify([newTransaction, ...blockchainTransactions]));
// Show success message
alert(Transaction completed successfully! TX ID: ${response.result.id});
} else {
// Handle error
alert(Transaction failed: ${response.message});
}
}
```

## NFT Implementation

NFTs in LifeNFT represent verified blood donations with:

1. **Metadata**: Information about the donation (blood type, date, hospital)
2. **Image**: Visual representation of the blood donation with type indicator
3. **Attributes**: Properties that define the donation (blood type, donor, hospital)
4. **Ownership**: Transferred to the donor's wallet

## Benefits of Blockchain Integration

1. **Immutability**: Donation records cannot be altered once verified
2. **Transparency**: All donations are publicly verifiable
3. **Ownership**: Donors receive NFTs as proof of their contribution
4. **Security**: Cryptographic verification of all operations
5. **Interoperability**: NFTs can be used in other compatible systems

## Best Practices

1. Always check for Keychain availability before requesting operations
2. Provide clear feedback on transaction status
3. Implement proper error handling for blockchain operations
4. Store blockchain transaction IDs for future reference
5. Use the appropriate permission level for each operation