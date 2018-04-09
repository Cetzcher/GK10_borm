const express = require('express'),
  app = express(),
  port = process.env.PORT || 3030;

const mongoose = require('mongoose');

//Set up default mongoose connection
const mongoDB = "mongodb://dbuser:dbpass@ds213759.mlab.com:13759/mobiledb";
const config      = require('./config/database'); // get db config file
const User        = require('./app/models/user'); // get the mongoose model
const bodyParser  = require('body-parser');
//Get the default connection

mongoose.connect(mongoDB, {
	useMongoClient: true
});

const db = mongoose.connection;

// get our request parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



function create_user(username, mail, password, callback)
{
	// note: password hashing is done in the user scheme
	console.log("User:", username, "mail", mail, "pw", password)

	if(!username || !mail || !password) 
		return callback({success: false, error: "incomplete form"});
	// attempt to create user
	
	var newUser = new User({
      name: username,
      password: password,
      email_addr: mail
    });

	newUser.save(function(err){
		var is_err = err ? false : true;
		return callback({success: is_err, error: "user already exists"});
	});
}

function show_user(username, password, callback)
{
	User.findOne(
		{ name: username },
		function(err, user) {
			if(err || !user)
				return callback({success: false, error: 'Authentication failed. password or username is incorrect' });
      		// check if password matches
      		user.comparePassword(password, function (err, isMatch) {
      				callback({success: (isMatch && !err), error: "Authentication failed. password or username is incorrect", mail: user.email_addr});
      			});
    		});
}

/* Performs a login operation. */
app.post("/api/login", (req, res) => {
	show_user(req.body.username, req.body.pw, result =>  res.json(result));
});

/* Preforms a signup */
app.post("/api/register", (req, res) => {
	console.log(req.body)
	create_user(req.body.username, req.body.mail, req.body.pw, result => res.json(result));
});


 app.listen(port);
console.log('There will be dragons: http://localhost:' + port);
console.log("views @: " + __dirname + "/app/views");