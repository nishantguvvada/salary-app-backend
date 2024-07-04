const { detailsSchema } = require("../inputSchema/inputSchema");

const detailsValidation = (req, res, next) => {

    const response = detailsSchema.safeParse(req.body);

    if (response.success) {

        return next();

    } else {

        return res.status(400).json({message: "Invalid details received!"});

    }

}

module.exports = {
    detailsValidation
}