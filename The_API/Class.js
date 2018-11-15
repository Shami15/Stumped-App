// User.js
var mongoose = require('mongoose');  
var ClassSchema = new mongoose.Schema({  
    "name": String,
    "teacher": String,
    "students": Array,
    "subject": String,
    "questions": Array,
    "description" : String,
    "lang" : String,
    // "Class" : String
});
mongoose.model('Class', ClassSchema);
module.exports = mongoose.model('Class');