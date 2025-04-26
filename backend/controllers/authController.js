const db = require("../db");

exports.login = (req, res) => {
  const { userId, password, role } = req.body;
  if (!userId || !password) {
    return res.status(400).json({ message: "User ID and Password are required!" });
  }
  
  let query;
  if (role === 'hospital') {
    query = `
      SELECT u.*, h.* 
      FROM Users u
      LEFT JOIN Hospital_Details h ON u.User_Id = h.Hospital_Id
      WHERE u.User_Id = ? AND u.Password = ? AND u.Role = 'hospital'
    `;
  } else {
    query = "CALL usp_Login(?, ?, ?)";
  }

  const queryParams = role === 'hospital' ? [userId, password] : ["Login", userId, password];
  
  db.query(query, queryParams, (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
    
    if (results[0] && results[0].length > 0) {
      // For hospital login, structure the response properly
      const userData = role === 'hospital' ? {
        ...results[0][0],
        role: 'hospital'
      } : results[0][0];

      res.json({ 
        message: "✅ Login Successful", 
        user: userData
      });
    } else {
      res.status(401).json({ message: "❌ Invalid Credentials" });
    }
  });
};

exports.register = (req, res) => {
  const { userId, password, firstName, lastName, email, role } = req.body;
  
  // Hospital-specific fields
  const { hospitalName, licenseNumber, address, phone, website } = req.body;
  
  // Government-specific fields
  const { departmentName, jurisdiction, authorityLevel, officeAddress, contactEmail } = req.body;
  
  // Validate required fields
  if (!userId || !password) {
    return res.status(400).json({ message: "User ID and Password are required!" });
  }
  
  // Check if user already exists
  db.query("SELECT User_Id FROM Users WHERE User_Id = ?", [userId], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
    
    if (results.length > 0) {
      return res.status(409).json({ message: "User ID already exists!" });
    }
    
    // Begin transaction
    db.getConnection((err, connection) => {
      if (err) {
        console.error("Connection error:", err);
        return res.status(500).json({ message: "Database connection error" });
      }
      
      connection.beginTransaction(err => {
        if (err) {
          connection.release();
          console.error("Transaction error:", err);
          return res.status(500).json({ message: "Transaction error" });
        }
        
        // Insert base user data
        const insertUserQuery = `
          INSERT INTO Users (User_Id, Password, First_Name, Last_Name, Email, Role) 
          VALUES (?, ?, ?, ?, ?, ?)
        `;
        
        connection.query(
          insertUserQuery, 
          [userId, password, firstName, lastName, email, role || 'user'], 
          (err, results) => {
            if (err) {
              return connection.rollback(() => {
                connection.release();
                console.error("User insert error:", err);
                res.status(500).json({ message: "Failed to register user" });
              });
            }
            
            // If hospital role, insert hospital details
            if (role === 'hospital' && hospitalName) {
              const insertHospitalQuery = `
                INSERT INTO Hospital_Details 
                (Hospital_Id, Hospital_Name, License_Number, Address, Phone, Website) 
                VALUES (?, ?, ?, ?, ?, ?)
              `;
              
              connection.query(
                insertHospitalQuery,
                [userId, hospitalName, licenseNumber, address, phone, website],
                (err, results) => {
                  if (err) {
                    return connection.rollback(() => {
                      connection.release();
                      console.error("Hospital insert error:", err);
                      res.status(500).json({ message: "Failed to register hospital details" });
                    });
                  }
                  
                  completeTransaction();
                }
              );
            } 
            // If government role, insert government details
            else if (role === 'government' && departmentName) {
              const insertGovQuery = `
                INSERT INTO Government_Details 
                (Authority_Id, Department_Name, Jurisdiction, Authority_Level, Office_Address, Contact_Email) 
                VALUES (?, ?, ?, ?, ?, ?)
              `;
              
              connection.query(
                insertGovQuery,
                [userId, departmentName, jurisdiction, authorityLevel, officeAddress, contactEmail],
                (err, results) => {
                  if (err) {
                    return connection.rollback(() => {
                      connection.release();
                      console.error("Government insert error:", err);
                      res.status(500).json({ message: "Failed to register government details" });
                    });
                  }
                  
                  completeTransaction();
                }
              );
            } else {
              // Regular user, just commit the transaction
              completeTransaction();
            }
          }
        );
        
        // Helper function to commit the transaction
        function completeTransaction() {
          connection.commit(err => {
            if (err) {
              return connection.rollback(() => {
                connection.release();
                console.error("Commit error:", err);
                res.status(500).json({ message: "Failed to complete registration" });
              });
            }
            
            connection.release();
            res.status(201).json({ 
              message: "✅ Registration Successful",
              userId: userId,
              role: role || 'user'
            });
          });
        }
      });
    });
  });
};

exports.logout = (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ message: "User ID is required!" });

  const query = "CALL usp_Login(?, ?, ?)";
  db.query(query, ["Logout", userId, null], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
    res.json({ message: "✅ Logout Successful" });
  });
};

// New endpoint to fetch user profile data based on role
exports.getUserProfile = (req, res) => {
  const { userId, role } = req.params;
  
  if (!userId || !role) {
    return res.status(400).json({ message: "User ID and Role are required" });
  }
  
  let query = '';
  
  if (role === 'hospital') {
    query = `
      SELECT u.*, h.* 
      FROM Users u
      JOIN Hospital_Details h ON u.User_Id = h.Hospital_Id
      WHERE u.User_Id = ? AND u.Role = 'hospital'
    `;
  } else if (role === 'government') {
    query = `
      SELECT u.*, g.* 
      FROM Users u
      JOIN Government_Details g ON u.User_Id = g.Authority_Id
      WHERE u.User_Id = ? AND u.Role = 'government'
    `;
  } else {
    query = 'SELECT * FROM Users WHERE User_Id = ?';
  }
  
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Profile fetch error:", err);
      return res.status(500).json({ message: "Failed to fetch profile" });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Remove password before sending response
    const userData = results[0];
    delete userData.Password;
    
    res.json({ 
      message: "Profile fetched successfully", 
      profile: userData 
    });
  });
};