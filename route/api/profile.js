const express = require('express');
const router = express.Router();

// @route   api/profile/test
// @desc    Tests profile route
// @access  public 
router.get('/test', (req, res) => res.json({msg : "profile works fine"}));

module.exports = router;