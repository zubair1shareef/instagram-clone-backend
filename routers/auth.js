const express = require('express')
const router =express.Router();
const mongoose = require("mongoose")
const User=mongoose.model("Users");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {JWT_SECRET}=require("../keys")
const loginCheck=require("../middleware/requireLogin")




router.post("/signup",(req,res)=>{
    const {name,email,password,pic,bio}=req.body
    if(!name|| !email ||!password){
        res.status(422).json({error:"enter all the fields"})
    }
   
    User.findOne({email:email}).then(found=>{
        if(found){
            res.status(422).json({error:"email alread exist"})

        }
        else{
            bcrypt.hash(password, 10).then(hash=>{
                const user=new User({name,email,password:hash,pic,bio})
                user.save().then(user=>{
                   
                   res.status(200).json(user)
                }).catch(err=>{
                    console.log(err)
                })
    
            }) .catch(err=>{
                console.log(err);
            })
        }
        
    }).catch(err=>{
        console.log(err)
            
        });
        
})

router.post("/signin",(req,res)=>{
    const{email,password}=req.body;
    if(!email||!password){
       return res.status(404).json({error:"enter all the feilds"})
    }
   
        User.findOne({email:email}).then(foundUser=>{
            if(!foundUser){
               return res.status(422).json({error:"user not found"})
            }
           
                bcrypt.compare(password,foundUser.password).then(match=>{
                    if(match){
                       
                       // res.json({message:"signin sucessfully"})
                        const token=jwt.sign({_id:foundUser._id},JWT_SECRET)
                        const {_id,name,email,followers,following,pic,bio}=foundUser
                        return  res.json({token,user:{_id,name,email,followers,following,pic,bio}})
                    }
                    
                       return res.status(422).json({message:"email and password doesnt match"})
                    
                })
            
        }).catch(err=>{
            console.log(err);
        })
    
})

router.get('/alluser',(req,res)=>{
    User.find().then(user=>{
        res.json({user})
    }).catch(err=>{
        console.log(err)
    })

})



module.exports = router