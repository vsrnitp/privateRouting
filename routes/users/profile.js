const express = require('express');
const router = express.Router();



router.get('/profile', (req,res) => {
res.json({
    message: "Secure Route Accessed",
    user: req.user
})

}
);

module.exports = router;