const jwt = require("jsonwebtoken");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const {decrypt} = require('caesar-encrypt');

const caesarDecrypt = {
    toDecrypt: function(stringToDecrypt, shift) {
        let decryptedFinal = '';

        for (let i = 0; i < stringToDecrypt.length; i++) {
            let charText = stringToDecrypt.charCodeAt(i);
            if ((charText >= 65 && charText <= 90) || (charText >= 97 && charText <= 122) || 
                (charText >= 48 && charText <= 57) || (charText >= 32 && charText <= 47) || 
                (charText >= 58 && charText <= 64) || (charText >= 91 && charText <= 96) || 
                (charText >= 123 && charText <= 126)) {
                    decryptedFinal += String.fromCharCode(((charText - 32 - shift + 94) % 94) + 32);
                } else {
                    decryptedFinal += stringToDecrypt.charAt(i);
                }
            }
            return decryptedFinal;
        }
    }

const login = async (req, res) => {
    const {email, password} = req.body;
    if(!email || !password ) {
        return res.json({status:"Please fill all fields.", error:error})
    } else {
        const user = await prisma.user.findUnique({ where: { email } });
        if(!user){
            return res.json({status:"error", error:"Incorrect Email or Password."})
        }

        const origPassword = user.password;
        const origShiftKey = user.shiftKey;

        console.log("This is the Original Shift Key: "+origShiftKey);
        console.log("This is the Original Password: "+origPassword);
        console.log("This is the User's inputted Password: "+password);
        console.log("This is the Decrypted Original Password: "+caesarDecrypt.toDecrypt(origPassword, origShiftKey));

        const decryptedPass = await caesarDecrypt.toDecrypt(origPassword, origShiftKey);

        if(!(decryptedPass === password)){
            return res.json({status:"error", error:"Incorrect Email or Password."})
        }else if (decryptedPass === password){

            const token = jwt.sign({id: user.id}, "fodiguer9u34oi%@Vn34r934ergye0pwrgGerg0u34G4g34g$@(241@@$we239yr23g", {
                expiresIn: "90d",
            })
            const cookieOptions = {
                expiresIn: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
                httpOnly: true                                                                                            
            }
            res.cookie("userRegistered", token, cookieOptions);


            return res.json({status:"success", success:"User has been logged in. Please go to Landing Page immediately."});
       }
    } 
}

module.exports = login;
