const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function getRandomPrime(min, max) {
  var num = Math.floor(Math.random() * (max - min + 1)) + min;
  
    while (!isPrime(num)) {
    num = Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  return num;
}
  
function isPrime(num) {
  if (num < 2 || !Number.isInteger(num)) {
    return false;
  }

  if (num === 2) {
    return true;
  }

  if (num % 2 === 0) {
    return false;
  }

  for (var i = 3; i <= Math.sqrt(num); i += 2) {
    if (num % i === 0) {
      return false;
    }
  }

  return true;
}

let shiftKeyA = getRandomPrime(0, 25);
const shiftKeyB = Math.floor(Math.random() * 26);
 
function affineEncrypt(plaintext, a, b) {
  var ciphertext = "";
  for (var i = 0; i < plaintext.length; i++) {
    var charCode = plaintext.charCodeAt(i);
    var cipherCode;
    if (charCode >= 65 && charCode <= 90) { 
      cipherCode = ((a * (charCode - 65) + b) % 26) + 65;
    } else if (charCode >= 97 && charCode <= 122) { 
      cipherCode = ((a * (charCode - 97) + b) % 26) + 97;
    } else { 
      cipherCode = charCode;
    }
    ciphertext += String.fromCharCode(cipherCode);
  }
  return ciphertext;
}


const index = async (req, res) => {         
	const { usertype,userId,lastName, firstName, middleName, homeAddress, country, stateId, city, zipCode, birthdate, gender, hobby, civilStatus } = req.body
  console.log(req.body);

  console.log(userId);
  console.log(stateId);

  const encryptedFirstName = affineEncrypt(firstName, shiftKeyA, shiftKeyB);
  const encryptedLastName = affineEncrypt(lastName, shiftKeyA, shiftKeyB);


	if(country === ""){
    return res.json({ status: "error", error: "Please Select a Valid Country." });
  }else if(stateId === ""){
    return res.json({ status: "error", error: "Please Select a Valid State/Region." });
  }else if(city === ""){
    return res.json({ status: "error", error: "Please Select a Valid City." });
  }else if(!userId || !firstName || !lastName || !middleName || !birthdate || !gender || !homeAddress || !zipCode || !hobby || !civilStatus) {
    return res.json({ status: "error", error: "Please fill all fields." });
	}else if (!zipCode.search(/^[0-9]*$/) < 0) {
    return res.json({ status: "error", error: "Zip Code should all be numbers and should only contain digits" });
  }else if (firstName <= 2) {
    return res.json({ status: "error", error: "First Name should be at least 2 characters" });
  }else if (userId <= 2) {
    return res.json({ status: "error", error: "ID" });
  }else if (lastName <= 2) {
    return res.json({ status: "error", error: "Last Name should be at least 2 characters" });
  }else if (middleName <= 2) {
    return res.json({ status: "error", error: "Middle Name should be at least 2 characters" });
  }else if (!zipCode == 4) {
    return res.json({ status: "error", error: "Zip code should contain only 4 digits" });
  }else {
    try {
      const result = await prisma.userDetails.create({
        data: {
          userId:userId, 
          usertype: usertype,
          lastName: encryptedLastName,
          firstName: encryptedFirstName,
          middleName: middleName,
          homeAddress: homeAddress,
          city: city,
          region: stateId,
          country: country,
          gender: gender,
          zipCode: zipCode,
          birthdate: birthdate,
          hobby: hobby,
          civilStatus: civilStatus,
          shiftKeyA: shiftKeyA,
          shiftKeyB: shiftKeyB,
        }
      });
      return res.json({ status: "success", success: "User has been registered successfully!" });
    } catch (error) {
      console.error(error);
      return res.json({ status: "error", error: "An error occurred while inserting the data." });
    }
  }
}



module.exports = index;