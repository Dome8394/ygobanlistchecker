const { Email } = require('../models/email');
const Token = require('../models/token');

const nodemailer = require("nodemailer");
/**
 * Adds the email to the database
 * @param {Http request containing the email inside Http body} req 
 * @param {Http response} res 
 */
exports.add_email = async (req, res) => {
    // res.send('NOT IMPLEMENTED');
    try {
        let user = await Email.findOne({ email: req.body.email });
        if (user) return res.status(400).send("User with the email " + user + " does already exist.");

        user = await new User({
            email: req.body.email
        }).save();

        let token = await new Token({
            userId: user._id,
            token: crypto.randomBytes(32).toString("hex")
        }).save();

        const message = `${process.env.BASE_URL}/email/verify/${user.id}/${token.token}`;
        await sendEmail(user.email, "Account verification", message);

        res.send("An email has been sent to your account. Please check your inbox.");

    } catch (error) {
        res.status(400).send("An error occured");
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {JWT token} token
 */
exports.verify_mail = async (req, res) => {
    // res.send('NOT IMPLEMENTED' + req.params.token);
    try {
        const user = await User.findOne({ _id: req.params.id });
        if (!user) return res.status(400).send("Invalid link");

        const token = await Token.findOne({
            userId: user._id,
            token: req.params.token,
        });
        if (!token) return res.status(400).send("Invalid link");

        await User.updateOne({ _id: user._id, active: true });
        await Token.findByIdAndRemove(token._id);
        
        res.send("email has been verified successfully!");
    } catch (error) {
        res.status(400).send("An error has occured: ", error);
    }
}

// ================================================

/**
 * Email configuration
 */
const sendEmail = async (email, subject, message) => {
    try {
        const transporter = nodemailer.createTransport({
            port: 587,
            secure: true,
            auth: {
                user: process.env.USER,
                pass: process.env.PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.USER,
            to: email,
            subject: subject,
            text: message
        });

        console.log("Email has been sent successfully!");

    } catch (err) {
        console.log("Email has not been sent due to an error: ", err);
    }
}