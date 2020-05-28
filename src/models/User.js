const mongoose = require('mongoose');
const joigoose = require('joigoose')(mongoose);
const joi = require('@hapi/joi');

const nameRegex = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/;
const pwdRegex = /\S+/;

const SignInSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(8).max(255).regex(pwdRegex).required(),
});

const SignUpSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(8).max(255).regex(pwdRegex).required(),
  firstName: joi.string().regex(nameRegex).required(),
  lastName: joi.string().regex(nameRegex).required(),
  language: joi.string().valid('fr-FR', 'en-EN', 'es-ES').required(),
  currency: joi.string().valid('euro', 'dollar', 'yen').required(),
});

const UpdateSchema = joi.object({
  email: joi.string().email(),
  firstName: joi.string().regex(nameRegex),
  lastName: joi.string().regex(nameRegex),
  language: joi.string().valid('fr-FR', 'en-EN', 'es-ES'),
  currency: joi.string().valid('euro', 'dollar', 'yen'),
});

const UserSchema = new mongoose.Schema(joigoose.convert(SignUpSchema), {
  timestamps: true,
});
const User = mongoose.model('User', UserSchema);

module.exports = {
  SignInSchema,
  SignUpSchema,
  UpdateSchema,
  User,
};
