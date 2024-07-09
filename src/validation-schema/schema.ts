import User from "../model/user";
import { body } from 'express-validator';

export const signupSchema = [
    body('name').notEmpty().withMessage('Please Fill name..!').trim(),
    body('email').isEmail().notEmpty().withMessage('Please Enter Valid Email..!').trim()
        .custom((value) => { 
            return User.findOne({email : value})
            .then(userDoc => {
                if(userDoc){
                    return Promise.reject('Email Exist Already..!');
                }
            });
        }).normalizeEmail(),
    body('password','Please Enter atleast 5 character').notEmpty().isLength({min : 5}).trim(),
    body('confirm_pass').notEmpty().custom((value,{req}) => {
        if(value != req.body.password){
            throw new Error('Password Mismatched..!');
        }
        return true;
    }),
    body('role', "Please enter Role...!").notEmpty().trim()
]


export const loginSchema = [
    body('email').isEmail().notEmpty().withMessage('Please Enter Valid Email..!').trim().normalizeEmail(),
    body('password','Please Enter atleast 5 character').notEmpty().isLength({min : 5}).trim()
]