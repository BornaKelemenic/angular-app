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
                city: req.body.city,
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

    return router;
}
