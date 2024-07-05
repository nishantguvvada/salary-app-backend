const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const zod = require("zod");
const { Salary, User } = require("../dB/model");
const { percentile } = require("../percentile/logic");
const { signupValidation } = require("../middleware/signupValidation");
const { authValidation } = require("../middleware/authValidation");
const { detailsValidation } = require("../middleware/detailsValidation");
require('dotenv').config(); 
const JWT_SECRET = process.env.JWT_SECRET;

mongoose.connect(process.env.MONGO_URL);

const app = express();

app.use(cors());
app.use(express.json());

// Signup
app.post("/signup", signupValidation, async (req, res) => {

    try{

        const existingUser = await User.findOne({email: req.body.email});

        if (existingUser) {
    
            return res.status(403).json({error: "User already exists!"});
    
        }

        const user = new User({    
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        });

        await user.save();

        const token = jwt.sign(user._id.toHexString(), JWT_SECRET);

        return res.status(200).json({message: "Signed up!", token: token});

    } catch(err){

        return res.status(403).json({message: "Caught an error", error: err});

    }

});

// Signin
app.post("/signin", async (req, res) => {

    const existingUser = await User.findOne({email: req.body.email, password: req.body.password});

    if(!existingUser) {

        return res.status(400).json({message: "User does not exist!"});

    }

    const token = jwt.sign(existingUser._id.toHexString(), JWT_SECRET);

    return res.status(200).json({message: "Signed in!", token: token});

});

// Input details
app.post("/details", authValidation, detailsValidation, async (req, res) => {

    const userId = jwt.decode(req.vtoken); // Using value stored in authValidation middleware

    try{

        const existingDetails = await Salary.findOne({id: userId});

        if (existingDetails) {
    
            return res.status(403).json({error: "Details present, update if required!"});
    
        }

        const details = new Salary({
            id: userId,
            salary: req.body.salary,
            designation: req.body.designation,
            industry: req.body.industry,
            region: req.body.region
        });

        await details.save();

        return res.status(200).json({message: "Details saved!"})

    } catch(err) {

        return res.status(403).json({error: err})

    }

});

// Update details
app.put("/updatedetails", authValidation, async (req, res) => {

    const userId = jwt.decode(req.vtoken); // Using value stored in authValidation middleware

    try {

        const existingDetails = await Salary.findOne({id: userId});

        if (!existingDetails) {
    
            return res.status(403).json({error: "No details available for updating!"});
    
        }

        const update = await Salary.findOneAndUpdate({id: userId}, {
            salary: req.body.salary,
            designation: req.body.designation,
            industry: req.body.industry,
            region: req.body.region
        });

        return res.status(200).json({message: "Details updated!"});

    } catch(err) {

        return res.status(403).json({error: err})

    }

});

// Get total users
app.get("/totalusers", async (req, res)=> {

    const totalUser = await User.aggregate([
        {
            $count: "totaluser"
        }
    ]);

    return res.status(200).json({total: totalUser[0]['totaluser']});
});

// Get average salary
app.get("/averagesalary", async (req, res)=> {

    const totalUser = await User.aggregate([
        {
            $count: "totalusers"
        }
    ]);

    const totalSalary = await Salary.aggregate([
        { $group : { _id : null , totalsum: { $sum: "$salary" } } }
    ])

    const averageSalary = totalSalary[0]["totalsum"]/totalUser[0]["totalusers"]

    const result = +(Math.round(averageSalary + "e+2")  + "e-2")

    return res.status(200).json({message: `The average Salary is ${result}!`, average: result});
});

// Get maximum salary
app.get("/maximumsalary", async (req, res)=> {

    const maximumSalary = await Salary.aggregate([
        { $group : { _id : null , maxSal: { $max: "$salary" } } }
    ])

    return res.status(200).json({message: `The maximum Salary is ${maximumSalary[0].maxSal}!`, maximum: maximumSalary[0].maxSal});
});

// Percentile
app.post("/percentile", async (req, res) => {

    const salaries = await Salary.find({}, {
        salary: 1,
        _id: 0
    }).lean();

    const database = salaries.map(s => s.salary);

    const result = percentile(database, req.body.value);

    console.log("noted")

    return res.status(200).json({message: `You are at ${result}th percentile!`, result: result});

});

app.listen(8000);