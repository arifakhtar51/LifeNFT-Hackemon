// ... existing code ...

exports.logout = (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ message: "User ID is required!" });

  const query = "CALL usp_Login(?, ?, ?)";  // Fixed parameter count
  db.query(query, ["Logout", userId, null], (err, results) => {  // Added null for password parameter
    if (err) return res.status(500).json({ message: "Internal Server Error" });
    res.json({ message: "✅ Logout Successful" });
  });
};
// ... existing code ...