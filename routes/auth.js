const router = require('express').Router();
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { registerValidation, loginValidation } = require('../validation');

router.post('/register', async (req, res) => {

    //Validate info before making request
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Check if email exists
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) return res.status(400).send('User already exists');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });
    try {
        const savedUser = await user.save();
        res.send(savedUser);
    } catch (err) {
        res.status(400).send(err);
    }
});

//Login
router.post('/login', async(req, res) => {
    //Validate info before making request
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Check if email doesn't exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("Email doesn't exists");

    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass)  return res.status(400).send("Password is incorrect!");

    //Create and assign web token
    const token = jwt.sign({_id: user._id}, process.env.SECRET_TOKEN);
    res.header('auth-token', token).send(token);
});

module.exports = router;