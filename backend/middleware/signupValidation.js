const { signupSchema } = require("../inputSchema/inputSchema");

const signupValidation = (req, res, next) => {

    const response = signupSchema.safeParse(req.body);

    if (response.success) {

        return next();

    } else {

        return res.status(400).json({message: "Invalid inputs received!"});

    }
}

module.exports = {
    signupValidation
}