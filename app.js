require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const encrypt=require('mongoose-encryption');
const app = express();


app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true,
}));


//Setting up Database and Schema
mongoose.connect('mongodb://127.0.0.1:27017/userDB');
const userSchema = new mongoose.Schema({
    email: String,
    password: String,
});

//Encryt password field
userSchema.plugin(encrypt, { secret: process.env.SECRET ,encryptedFields: ['password']});

//Create collection
const User = new mongoose.model('User', userSchema);


//HTTP requests
app.get('/', function (req, res) {
    res.render('home');
});
app.get('/login', function (req, res) {
    res.render('login');
});
app.get('/register', function (req, res) {
    res.render('register');
});


app.post('/login', function (req, res) {
    User.findOne({email:req.body.username})
    .then(arr=>{
        if(arr===null)
        console.log('User not found');
        else{
            if(arr.password===req.body.password)
            res.render('secrets');
            else
            console.log('Invalid Credentials');
        }
    })
    .catch(err=>console.log(err));
});
app.post('/register', function (req, res) {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password,
    });
    newUser.save()
        .then(() => res.render('secrets'))
        .catch(err => console.log("ERROR"));
});

app.listen(3000, function () {
    console.log('running');
})