const express = require('express');
const router = express.Router();
const verifyJWT = require('../middlewares/auth.js');
const { loadCanvas, getUserCanvases,createCanvas,updateCanvas,deleteCanvas,shareCanvas } = require("../Controllers/Canvas.js");



router.post("/create", verifyJWT, createCanvas);
router.get("/list", verifyJWT, getUserCanvases);
router.get("/load/:id", verifyJWT, loadCanvas);
router.put("/update", verifyJWT, updateCanvas); 
router.delete("/:canvasId", verifyJWT, deleteCanvas);
router.put("/share/:canvasId", verifyJWT, shareCanvas);

module.exports = router;