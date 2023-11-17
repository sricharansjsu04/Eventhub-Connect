const express = require("express");
const router = express.Router();
const path = require("path");


router.get('^/$|/index(.html)?',(req,res)=>{
    res.send("<h1>Landing Page</h1><p>Hello World!!!</p>");
});


module.exports = router;

