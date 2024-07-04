const zod = require("zod");

const signupSchema = zod.object({
    username: zod.string(),
    email: zod.string().email(),
    password: zod.string().min(6)
});

const detailsSchema = zod.object({
    salary: zod.number(),
    designation: zod.string(),
    industry: zod.string(),
    region: zod.string()
})

module.exports = {
    signupSchema, detailsSchema
}