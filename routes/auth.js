const User = require('../models/user');
const jwt  = require('jsonwebtoken');
const config = require('../config/database');

module.exports = (router) =>
{
    // Register route to save user
    router.post('/register', (req, res) => 
    {
        let email = req.body.email.trim();
        let username = req.body.username.trim();
        let password = req.body.password.trim();
        
        if(!email) // Check if email is entered
        {
            res.json({success: false, msg: 'You must provide an email.'});
        }
        else if(!username) // Check if username is entered
        {
            res.json({success: false, msg: 'You must provide a username.'});
        }
        else if(!password) // Check if password is entered
        {
            res.json({success: false, msg: 'You must provide a password.'});
        }
        else if(password && password.length < 8) // Temporary, until validators are made
        {
            res.json({ success: false, msg: 'Password must have at least 8 characheters.' });
        }
        else // Create user object and save to database
        {
            // Create User mongoose object
            let newUser = new User({
                email: email,
                username: username,
                password: password
            });

            // Invoke .save function for saving the new user to database
            newUser.save((err) => 
            {
                if(err)
                {
                    if(err.code === 11000) // Check for duplicate error
                    {
                        res.json({success: false, msg: 'Username or email already taken.'});
                    }
                    else if(err.errors) // Check for validator errors TODO: actually create the validators
                    {
                        if(err.errors.email)
                        {
                            res.json({ success: false, msg: err.errors.email.message });
                        }
                        else if(err.errors.username)
                        {
                            res.json({ success: false, msg: err.errors.username.message });
                        }
                        else if(err.errors.password)
                        {
                            res.json({ success: false, msg: err.errors.password.message });
                        }
                    }
                    else // General purpose error
                    {
                        res.json({success: false, msg: 'Failed to register.', err: err});
                    }
                }
                else // Successfull registration of the user
                {
                    res.json({success: true, msg: 'Account registered.'});
                }
            });
        }
    });

    // Route to check the availability of email
    router.get('/checkEmail/:email', (req, res) => 
    {
        if(!req.params.email)
        {
            res.json({ success: false, msg: 'E-mail was not provided.' });
        }
        else
        {
            // Search the database for provided email
            User.findOne({ email: req.params.email }, (err, user) => {

                if(err) 
                    res.json({ success: false, msg: err });

                else if(user)
                    res.json({ success: false, msg: 'E-mail already taken.' });
                
                else
                    res.json({ success: true, msg: 'E-mail is available.' });
            })
        }
    });

    // Route to check the availability of Username
    router.get('/checkUsername/:username', (req, res) => 
    {
        if(!req.params.username)
        {
            res.json({ success: false, msg: 'Username was not provided.' });
        }
        else
        {
            const username = req.params.username.trim();
            if (!username || username.length < 5)
            {
                res.json({ success: false, msg: 'Username must have at least 5 characters.' })
            }
            else
            {
                // Search the database for provided username
                User.findOne({ username: username }, (err, user) => 
                {    
                    if(err) 
                        res.json({ success: false, msg: err });
    
                    else if(user)
                        res.json({ success: false, msg: 'Username already taken.' });
                    
                    else
                        res.json({ success: true, msg: 'Username is available.' });
                });
            }
        }
    });

    // Route to login user
    router.post('/login', (req, res) => 
    {
        if (!req.body.username) // Check if username was provided
        {
            res.json({ success: false, msg: 'Username was not provided.' });
        }
        else if (!req.body.password) // Check if password was provided
        {
            res.json({ success: false, msg: 'Password was not provided.' });
        }
        else
        {
            // Search the database by username that was provided
            User.findOne({ username: req.body.username }, (err, foundUser) => {
                if (err) 
                {
                    res.json({ success: false, msg: err });
                }
                else if (!foundUser) 
                {
                    // If no user was found return an error message
                    res.json({ success: false, msg: 'Username not found.' });
                }
                else
                {
                    // Compare provided password with the one stored in database
                    const isValid = foundUser.comparePassword(req.body.password);

                    if (!isValid) // Password not valid
                    {
                        res.json({ success: false, msg: 'Invalid password.' });
                    } 
                    else // Password valid
                    {
                        // Make a token
                        const token = jwt.sign({ 
                            userId: foundUser._id, 
                            username: foundUser.username, 
                            role: foundUser.role 
                        }, config.secret, { expiresIn: '24h' });

                        // Send a response containing token and user object
                        res.json({ 
                            success: true, 
                            msg: 'Successfully logged in.', 
                            token: token, 
                            user: { userId: foundUser._id, username: foundUser.username, role: foundUser.role } }
                        );
                    }
                }
            });
        }
    });

    // Get public profile information
    router.get('/publicProfile/:username', (req, res) => 
    {
        if (!req.params.username)
        {
            res.json({ success: false, msg: 'Username was not provided.' });
        }
        else
        {
            User.findOne({ username: req.params.username }).select('username email role').exec((err, user) => 
            {
                if (err)
                {
                    res.json({ success: false, msg: err });
                }
                else if (!user)
                {
                    res.json({ success: false, msg: 'User not found.' });
                }
                else
                {
                    res.json({ success: true, user: user });
                }
            });
        }
    });

    // Everything after this middleware requires authentication
    // Headers middleware
    router.use((req, res, next) => 
    {
        const token = req.headers['authorization'];

        if (!token) 
        {
            res.json({ success: false, msg: 'No token provided.' });
        }
        else
        {
            jwt.verify(token, config.secret, (err, decoded) => {
                if (err) 
                {
                    res.json({ success: false, msg: err });
                } 
                else 
                {
                    req.decoded = decoded;
                    //res.json({ success: true, msg: 'Success.' });
                    next();
                }
            });
        }
    });

    // Fetch user's profile info
    router.get('/profile', (req, res) => 
    {
        User.findOne({ _id: req.decoded.userId }).select('username email role').exec((err, user) => 
        {
            if (err) 
            {
                res.json({ success: false, msg: err });
            }
            else if (!user)
            {
                res.json({ success: false, msg: 'User not found.' });
            }
            else 
            {
                res.json({ success: true, user: user });
            }
        });
    });

    // Get all users
    router.get('/all-users', (req, res) => 
    {
        if (!req.decoded.userId)
        {
            res.json({ success: false, msg: 'You are not logged in.' });
        }
        else if (req.decoded.role !== 'admin')
        {
            res.json({ success: false, msg: 'You are not authorized to use this page.' });
        }
        else
        {
            User.find({}).select('-password').exec((err, users) => 
            {
                if (err)
                {
                    res.json({ success: false, msg: err });
                }
                else if (!users || users.length < 1)
                {
                    res.json({ success: false, msg: 'No users found.' });
                }
                else
                {
                    res.json({ success: true, msg: 'Found users.', users: users });
                }
            });
        }
        
    });

    return router;
}