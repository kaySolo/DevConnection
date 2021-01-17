const express = require('express');
const router = express.Router();

// @route   api/user/test
// @desc    Tests user route
// @access  public 
router.get('/test', (req, res) => res.json({msg : "user works fine"}));

module.exports = router;