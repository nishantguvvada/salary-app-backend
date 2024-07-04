const mongoose = require("mongoose");

const Salary = mongoose.model("Salary", {
    id: String,
    salary: Number,
    designation: String,
    industry: String,
    region: String
});

const User = mongoose.model("User", {
    username: String,
    email: String,
    password: String
});

module.exports = {
    Salary, User
}