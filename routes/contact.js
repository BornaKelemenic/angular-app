const User = require('../models/user');
const jwt  = require('jsonwebtoken');
const config = require('../config/database');
const Contact = require('../models/contact');

module.exports = (router) =>
{
    // Route for saving a contact
    router.post('/save', (req, res) => 
    {
        if (!req.body.name)
        {
            res.json({ success: false, msg: 'Name was not provided.' });
        }
        else if (!req.body.surname)
        {
            res.json({ success: false, msg: 'Surname was not provided.' });
        }
        else if (req.body.addedBy)
        {
            res.json({ success: false, msg: 'This is not suposed to be here -> ' +  req.body.addedBy });
        }
        else
        {
            const newContact = new Contact({
                name: req.body.name,
                surname: req.body.surname,
                city: req.body.city ? req.body.city : undefined,
                desc: req.body.desc,
                addedBy: req.decoded.username,
                mobile_numbers: req.body.mobile_numbers
            });

            newContact.save(err => {
                if (err)
                {
                    res.json({ success: false, msg: err });
                }
                else
                {
                    res.json({ success: true, msg: 'Contact saved.' });
                }
            });
        }
    });

    // Route for getting user's contacts
    router.get('/my', (req, res) => 
    {
        if (!req.decoded.userId && !req.decoded.username)
        {
            res.json({ success: false, msg: 'Can\'t get user\'s info from token because it was not provided.' });
        }
        else
        {
            Contact.find({ addedBy: req.decoded.username }).exec((err, contacts) => 
            {
                if (err)
                {
                    res.json({ success: false, msg: err });
                }
                else if (!contacts)
                {
                    res.json({ success: false, msg: 'No contacts found.' });
                }
                else
                {
                    res.json({ success: true, msg: 'Found contacts.', contacts: contacts });
                }
            });
        }
    });

    return router;
}
