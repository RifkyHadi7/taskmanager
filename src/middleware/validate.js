const { schema } = require("../validators/taskValidator");

module.exports = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({error: error.details[0].message });
    next();
}