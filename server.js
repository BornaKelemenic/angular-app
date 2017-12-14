const express    = require('express');
const router     = express.Router();
const app        = express();
const path       = require('path');
const port       = process.env.port || 8080;
const mongoose   = require('mongoose');
const config     = require('./config/database');
const authRouter = require('./routes/auth')(router);
const blogRouter = require('./routes/blog')(router);
const contactRouter = require('./routes/contact')(router);
const bodyParser = require('body-parser');
const cors       = require('cors');
const morgan     = require('morgan');

mongoose.Promise = global.Promise;
// Connect to mongo base 
const mongoPromise = mongoose.connect(config.uri, {useMongoClient: true});
mongoPromise.then(
    // Handle succsesfull connection
    () => { console.log(`\nConnected to the database: ${config.db}\n`) },

    // Handle failed connection
    (err) => { console.log('\nCould not connect to database.\n') } 
);

// Cross-origin
app.use(cors({
    origin: 'http://localhost:4200'
}));

// Morgan logging
app.use(morgan('dev'));

// Body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Express middleware
app.use(express.static(__dirname + '/client/dist/'));
app.use('/auth', authRouter);
app.use('/blog', blogRouter);
app.use('/contact', contactRouter);


// Return index.html file to the user
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/dist/index.html'));
});

// Log to console info about server port
app.listen(port, () => 
{
    console.log(`Server started on ${port}`);
});