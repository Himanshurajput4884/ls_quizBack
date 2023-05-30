const express = require("express");
const router = express.Router();
const adminVerify = require("../middleware/adminVerify");
const newQuiz = require("../controller/newQuiz");
const allQuizes = require("../controller/allQuizes");
const checkEligibility = require("../controller/checkEligibility");
const userVerify = require("../middleware/userVerify");
const registerUserQuiz = require("../controller/registerUserQuiz");


router.post("/newquiz", adminVerify, newQuiz);

router.get("/allquizes", allQuizes);

router.post("/eligible", userVerify, checkEligibility);

router.post("/register/quiz", userVerify, registerUserQuiz);




module.exports = router;
