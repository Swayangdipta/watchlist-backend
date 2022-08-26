const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types;
const crypto = require('crypto');
const { v1 } = require('uuid');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    encryPassword: String,
    salt: String,
    contents: [{
        type: ObjectId,
        ref: 'Content'
    }]
},{timestamps: true})

userSchema.virtual('password')
    .set(function(password){
        this._password = password;
        this.salt = v1();
        this.encryPassword = this.securePassword(password);
    })
    .get(function(){
        return this._password
    })

userSchema.methods = {
    securePassword: function(password){
        if(!password) return '';

        try {
            return crypto.createHmac("sha256",this.salt)
                                    .update(password)
                                    .digest('hex');
        } catch (error) {
            return '';
        }
    },
    authenticate: function(password){
        return this.securePassword(password) === this.encryPassword;
    }
}


module.exports = mongoose.model("User",userSchema)