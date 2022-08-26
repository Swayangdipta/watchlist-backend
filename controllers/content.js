const Content = require('../models/content');
const _ = require('lodash');
const fs = require('fs');

exports.getContentById = (req,res,next,id) => {
    Content.findById(id).exec((err,content)=>{
        if(err || !content){
            return res.status(404).json({error: err});
        }
        req.content = content;
        next();
    })
}

exports.getASingleContent = (req,res) => {
    if(req.content){
        req.content.photo.data = undefined;
        return res.json(req.content);
    }
}


exports.createContent = (req,res) => {
    let content = new Content(req.body)
    Content.findOne({imdb_id: req.body.imdb_id}).exec((err,item)=>{
        if(err || item){
            return res.status(400).json({error: "Item already available in your collection"})
        }
        content.save((err,savedContent)=>{
            if(err){
                return res.status(400).json({error: "Faild to add item.Try again"})
            }
    
            return res.json(content)
        })
    })
}


exports.updateContentStatus = (req,res) => {
    Content.findByIdAndUpdate(req.body._id,{status: req.body.status},(err,updatedContent)=>{
        if(err){
            return res.status(400).json({error: "Faild to update status",body:err})
        }
        return res.json(updatedContent)
    })

}

exports.removeContent = (req,res) => {
    let content = req.content;
    content.remove((err,removedContent)=>{
        if(err){
            return res.status(400).json({error: err});
        }
        return res.json(removedContent);
    })
}