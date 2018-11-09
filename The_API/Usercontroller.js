// UserController.js
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var User = require('./User');
var config = { secret: 'idkman' }
var jwt = require('jwt-simple');

// User.statics.authenticate = function (email, password, callback) {
//     User.findOne({ email: email })
//       .exec(function (err, user) {
//         if (err) {
//           return callback(err)
//         } else if (!user) {
//           var err = new Error('User not found.');
//           err.status = 401;
//           return callback(err);
//         }

//         User.findOne({ password: password })
//         .exec(function (err, user) {
//           if (err) {
//             return callback(err)
//           } else if (!user) {
//             var err = new Error('User not found.');
//             err.status = 401;
//             return callback(err);
//           }  

//         }


//         // bcrypt.compare(password, user.password, function (err, result) {
//         //   if (result === true) {
//         //     return callback(null, user);
//         //   } else {
//         //     return callback();
//         //   }
//         // })
//       });
//   }

// CREATES A NEW USER
// router.post('/', function (req, res) {
//     User.create({
//             id : req.body.id,
//             userName : req.body.userName,
//             email : req.body.email,
//             password : req.body.password,
//             fName : req.body.fName,
//             lName : req.body.lName,
//             Classes : req.body.Classes
//         }, 
//         function (err, user) {
//             if (err) return res.status(500).send("There was a problem adding the information to the database.");
//             res.status(200).send(user);
//         });
// });

router.post('/signup', function (req, res) {
  console.log(req.body.userName);
  if (!req.body.userName || !req.body.password) {
    res.json({ success: false, msg: 'Please pass name and password.' });
  } else {
    var newUser = new User({
      id: req.body.id,
      userName: req.body.userName,
      email: req.body.email,
      password: req.body.password,
      fName: req.body.fName,
      lName: req.body.lName,
      Classes: req.body.Classes
    });
    // save the user
    newUser.save(function (err) {
      if (err) {
        return res.json({ success: false, msg: 'Username already exists.' });
      }
      res.json({ success: true, msg: 'Successful created new user.', userInfo: newUser });
    });
  }
});

router.post('/login', function (req, res) {
  let userName = req.body.userName
  User.findOne({
    userName
  }, function (err, user) {
    if (err) throw err;
    if (!user) {
      res.send({ success: false, msg: 'Authentication failed. User not found.' });
    } else {
      // check if password matches
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          // if user is found and password is right create a token
          var token = jwt.encode(user, config.secret);
          // return the information including token as JSON
          res.json({ success: true, token: 'JWT ' + token, userInfo: user });
        } else {
          res.send({ success: false, msg: 'Authentication failed. Wrong password.' });
        }
      });
    }
  });
});

// RETURNS ALL THE USERS IN THE DATABASE
router.get('/', function (req, res) {
  User.find({}, function (err, users) {
    if (err) return res.status(500).send("There was a problem finding the users.");
    res.status(200).send(users);
  });
});

// GETS A SINGLE USER FROM THE DATABASE
router.get('/:id', function (req, res) {
  User.findById(req.params.id, function (err, user) {
    if (err) return res.status(500).send("There was a problem finding the user.");
    if (!user) return res.status(404).send("No user found.");
    res.status(200).send(user);
  });
});

router.put('/:id', function (req, res) {

  User.findByIdAndUpdate(req.params.id, req.body, { new: true }, function (err, user) {
    if (err) return res.status(500).send("There was a problem updating the user.");
    res.status(200).send(user);
  });
});


//authenticate input against database
// User.statics.authenticate = function (email, password, callback) {
//     User.findOne({ email: email })
//       .exec(function (err, user) {
//         if (err) {
//           return callback(err)
//         } else if (!user) {
//           var err = new Error('User not found.');
//           err.status = 401;
//           return callback(err);
//         }
//         bcrypt.compare(password, user.password, function (err, result) {
//           if (result === true) {
//             return callback(null, user);
//           } else {
//             return callback();
//           }
//         })
//       });
//   }




module.exports = router;