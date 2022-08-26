const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxlength: 100
    },
    status: {
        type: String,
        default: "Completed"
    },
    type: String,
    imdb_id: {
        type: String,
        unique: true
    }
},{timestamps: true});

module.exports = mongoose.model("Content",contentSchema);