const express = require("express");
const router = express.Router();
const adminVerify = require("../middleware/adminVerify");
const newQuiz = require("../controller/newQuiz");
const allQuizes = require("../controller/allQuizes");
const checkEligibility = require("../controller/checkEligibility");
const userVerify = require("../middleware/userVerify");


router.post("/newquiz", adminVerify, newQuiz);

router.get("/allquizes", allQuizes);

router.post("/eligible", userVerify, checkEligibility);




module.exports = router;
