const { PrismaClient } = require('@prisma/client');
const bcrypt = require("bcryptjs")
const prisma = new PrismaClient();
// Shift key for caesar encryption
const shiftKey = Math.floor(Math.random() * 26);

// caesar shift cipher encryption : shift of 21
const caesarEncrypt = {
    toEncrypt: function(stringToEncrypt, shift) {
      let encryptedFinal = '';

      for (let i = 0; i < stringToEncrypt.length; i++) {
      let charText = stringToEncrypt.charCodeAt(i);
      if ((charText >= 65 && charText <= 90) || (charText >= 97 && charText <= 122) || 
            (charText >= 48 && charText <= 57) || (charText >= 32 && charText <= 47) || 
            (charText >= 58 && charText <= 64) || (charText >= 91 && charText <= 96) || 
            (charText >= 123 && charText <= 126)) {
        encryptedFinal += String.fromCharCode(((charText - 32 + shift) % 94) + 32);
      } else {
        encryptedFinal += stringToEncrypt.charAt(i);
      }
    }
      return encryptedFinal;
    }
}

const register = async (req, res) => {
    const {id,firstname, lastname, age, gender, section, usertype, email, password, confirmpassword} = req.body
    console.log(req.body);
    if(!firstname || !lastname || !age || !section || !email || !password || !confirmpassword) {
        return res.json({status:"error", error:"Please fill all fields."});
    } else if (password != confirmpassword){
        return res.json({status:"error", error:"Passwords do not match."});
    } else if(age <= 17 && age >=0){
        return res.json({status:"error", error:"Invalid Age. User must be of legal age to register."});
    } else if (age >= 100){
        return res.json({status:"error", error:"Invalid Age. Age must be 100 below."});
    } else if (password.length < 8 ){
        return res.json({ status: "error", error: "Password too short. Should be at least 8 characters." });
    } else if (password.search(/[a-z]/) < 0) {
        return res.json({ status: "error", error: "Password should have at least 1 lowercase character." });
    } else if (password.search(/[A-Z]/) < 0) {
        return res.json({ status: "error", error: "Password should have at least 1 uppercase character." });
    } else if (password.search(/[0-9]/) < 0) {
        return res.json({ status: "error", error: "Password should have at least 1 digit." });
    } else if (password.search(/[!@#$%^&*]/) < 0) {
        return res.json({ status: "error", error: "Password should have at least 1 special character." });
    } else{
        const user = await prisma.user.findUnique({ where: { email } });
        if(user) {
            return res.json ({status:"error", error:"Email has already been registered."})
        } else {
            console.log(shiftKey);
            console.log(caesarEncrypt.toEncrypt(password, shiftKey));
                
            const encryptedPass = await caesarEncrypt.toEncrypt(password, shiftKey);

           await prisma.user.create({
                data: {
                    usertype: usertype, 
                    firstname: firstname, 
                    lastname: lastname, 
                    age: age, 
                    gender: gender, 
                    section: section, 
                    email: email, 
                    password: encryptedPass, 
                    shiftKey: shiftKey
                },


            });
            return res.json({status:"success", success:"User has been registered successfully!"});

        }
    }
}

module.exports = register;

       
