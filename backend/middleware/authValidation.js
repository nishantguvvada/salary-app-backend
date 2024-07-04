const authValidation = (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader) {

        return res.status(400).json({error: "Unauthorized attempt!"})

    }

    const token = authHeader.split(" ")[1];

    req.vtoken = token; // Storing token in a variable vtoken

    console.log("token from authValidation", token);

    next();
}

module.exports = {
    authValidation
}