
/**
 * Adds the email to the database
 * @param {Http request containing the email inside Http body} req 
 * @param {Http response} res 
 */
exports.add_email = (req, res) => {
    res.send('NOT IMPLEMENTED');
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {JWT token} token
 */
exports.verify_mail = (req, res) => {
    res.send('NOT IMPLEMENTED' + req.params.token);
}