// UserController.js
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var Class = require('./Class');

// CREATES A NEW USER
router.post('/', function (req, res) {
    Class.create({
            teacher : req.body.teacher,
            students : req.body.students,
            subject : req.body.subject,
            name : req.body.name,
            questions : req.body.questions
        }, 
        function (err, Class) {
            if (err) return res.status(500).send("There was a problem adding the information to the database.");
            res.status(200).send(Class);
        });
});
// RETURNS ALL THE USERS IN THE DATABASE
router.get('/', function (req, res) {
    Class.find({}, function (err, Class) {
        if (err) return res.status(500).send("There was a problem finding the users.");
        res.status(200).send(Class);
    });
});

// GETS A SINGLE USER FROM THE DATABASE
router.get('/:id', function (req, res) {
    Class.findById(req.params.id, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the class.");
        if (!user) return res.status(404).send("No class found.");
        res.status(200).send(user);
    });
});

// UPDATES A SINGLE USER IN THE DATABASE
router.put('/:id', function (req, res) {
    
    Class.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, user) {
        if (err) return res.status(500).send("There was a problem updating the user.");
        res.status(200).send(user);
    });
});

router.delete('/:id', function (req, res) {
    Class.findByIdAndRemove(req.params.id,  function (err, user) {
        if (err) return res.status(500).send("There was a problem deleting the Class.");
        const response = {
            message: user.name + " successfully deleted",
            id: user.id
        };
        return res.status(200).send(response);
    });
});


module.exports = router;