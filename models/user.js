var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var validatedRoles = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol permitido'
};


var userSchema = new Schema({

    name: { type: String, required: [true, 'The name is mandattory'] },
    email: { type: String, unique: true, required: [true, 'The email is mandattory'] },
    password: { type: String, required: [true, 'The password is mandattory'] },
    role: { type: String, required: [true, 'The role is mandattory'], default: 'USER_ROLE', enum: validatedRoles }

});

userSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });

module.exports = mongoose.model('User', userSchema);