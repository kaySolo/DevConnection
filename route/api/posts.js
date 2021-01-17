const express = require('express');
const router = express.Router();

// @route   api/posts/test
// @desc    Tests posts route
// @access  public  
router.get('/test', (req, res) => res.json({msg : "posts works fine"}));

module.exports = router;