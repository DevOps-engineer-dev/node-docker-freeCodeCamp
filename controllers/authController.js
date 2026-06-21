const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

exports.signUp = async (req, res) => {
    const { username, password } = req.body;
    
    try {
        // Hash the password with a salt round of 12
        const hashpassword = await bcrypt.hash(password, 12);
        
        const newUser = await User.create({
            username,
            password: hashpassword
        });
        
        // Automatically log the user in after signing up
        req.session.user = newUser; 

        res.status(201).json({
            status: 'success',
            data: {
                user: newUser
            }
        });
    } catch (e) {
        res.status(400).json({
            status: 'fail',
        });
    }
}

exports.login = async (req, res) => {
    const { username, password } = req.body;
    
    try {
        const user = await User.findOne({ username });
        
        if (!user) {
            return res.status(404).json({
                status: 'fail',
                message: 'user not found'
            });
        }
        
        // Compare the plain text password with the hashed password in the DB
        const isCorrect = await bcrypt.compare(password, user.password);
        
        if (isCorrect) {
            // Attach user to session
            req.session.user = user;
            res.status(200).json({
                status: 'success',
            });
        } else {
            res.status(400).json({
                status: 'fail',
                message: 'incorrect username or password'
            });
        }
    } catch (e) {
        res.status(400).json({
            status: 'fail',
        });
    }
}