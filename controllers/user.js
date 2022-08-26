const User = require('../models/user');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const {expressjwt}= require('express-jwt');

exports.getUserById = (req,res,next,id) => {
    User.findById(id)
    .populate("contents")
    .exec((err,user)=>{
        if(err){
            return res.status(404).json({error: err});
        }

        user.encryPassword = undefined;
        user.salt = undefined;

        req.profile = user;
        next();
    })
}

exports.getUserInfo = (req,res) => {
    if(req.profile){
        return res.json(req.profile);
    }
}

exports.register = (req,res) => {
    let user = new User(req.body);

    if(!req.body.name || !req.body.email){
        return res.status(400).json({error: "All fields are required!"})
    }

    user.save((err,savedUser)=>{
        if(err){
            return res.status(404).json({error: err});
        }

        savedUser.encryPassword = undefined;
        savedUser.salt = undefined;
        return res.json(savedUser);
    })
}

exports.login = (req,res) => {

    const {email,password} = req.body
    if(!email|| !password){
        return res.status(400).json({error: "All fields are required!"})
    }

    User.findOne({email}).exec((err,user)=>{
        if(err || !user){
            return res.status(404).json({error: "Email not registered! Sign Up."});
        }

        if(!user.authenticate(password)){
            return res.status(406).json({error: "Password did not Matched"});
        }

        const token = jwt.sign({_id: user._id},process.env.SECRET);
        res.cookie("token",token,{expires: new Date(Date.now()+99999999*100)});

        return res.json({
            token,
            user:{
                _id: user._id,
                name: user.name,
                email: user.email
            }
        })

    })
}

exports.logout = (req,res) => {
    res.clearCookie("token");
    return res.json({message: "User signed out successfully!"})
}

exports.updateUser = (req,res) => {
    let user = req.profile;
    user = _.extend(user,req.body);
    user.save((err,updatedUser)=> {
        if(err){
            return res.status(400).json({error: err});
        }

        return res.json({message: "Info updated."});
    })
}

exports.removeUser = (req,res) => {
    let user = req.profile;
    user.remove((err,removedUser)=>{
        if(err){
            return res.status(400).json({error: err});
        }

        return res.json({message: `${removedUser.name}'s account closed.`});
    })
}

exports.pushContentInUser = (req,res) => {
    User.findByIdAndUpdate(req.profile._id
        ,{$push: {"contents": req.body._id}},
        {safe: true,upsert: true,new:true},
        (err,updatedUser)=>{
            if(err || !updatedUser){
                return res.status(400).json("Faild to add new content.")
            }
        return res.json(updatedUser.contents);
    })
}

exports.popContentFromUser = (req,res) => {
    User.findByIdAndUpdate(req.profile._id
        ,{$pop: {"contents": req.body._id}},
        {safe: true,upsert: true,new:true},
        (err,updatedUser)=>{
            if(err || !updatedUser){
                return res.status(400).json("Faild to remove content.")
            }
        return res.json({message: "Content Removed."});
    })
}

exports.isSignedIn = expressjwt({
    secret: process.env.SECRET,
    algorithms: ['SHA256','HS256','RS256','RSA',"sha1"],
    userProperty: "auth"
})

exports.isAuthenticated = (req,res,next) => {
    let checker = req.profile && req.auth && req.profile._id == req.auth._id;

    if(!checker){
        return res.status(401).json({error: "UnAuthorized"});
    }

    next();
}