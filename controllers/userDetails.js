const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// exports.getAllUserDetails = async (req, res) => {
//     const userDetails = await prisma.userDetails.findMany();
//     res.render('userDetails', { userDetails: userDetails });
// };

exports.getAllUserDetails = async (req, res) => {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    let userDetails = [];
    let users = [];

    if (user.usertype === 'Admin' || user.usertype === 'Manager') {
        userDetails = await prisma.userDetails.findMany();
    } else if (user.usertype === 'User') {
        userDetails = await prisma.userDetails.findMany({ where: { userId: user.id } });
    }

    res.render('userDetails', { userDetails: userDetails });
    

};


exports.getAllUser = async (req, res) => {
    const userID = await prisma.user.findMany();
    res.render('index', { userID: userID });
};

exports.getEditUserDetails = async (req, res) => {
    const id = req.params.userId;
    const userDetails = await prisma.userDetails.findUnique({ where: { userId: id } });
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    // 'editUserDetails' is your EJS template for editing user details
    res.render('editUserDetails', { userDetails: userDetails, user: user });
};


// exports.updateUserDetails = async (req, res) => {
//     const userId = req.params.userId;
//     let updateData = {...req.body};

//     // Replace 'state' with 'region' if it exists in your form data
//     if(updateData.state) {
//         updateData.region = updateData.state;
//         delete updateData.state;
//     }

//     // Convert hobby array to a string if it exists in your form data
//     if(Array.isArray(updateData.hobby)) {
//         updateData.hobby = updateData.hobby.join(", ");
//     }

//     // Retrieve the user requesting the update
//     const userRequestingUpdate = await prisma.user.findUnique({
//         where: { id: req.user.id }, // Assuming you have req.user.id containing the ID of the currently logged-in user
//     });

//     // Only allow updating userType if the user requesting the update is an Admin
//     if (userRequestingUpdate.usertype !== "Admin") {
//         res.status(403).send('You must be an Admin to perform this action');
//         return;
//     }

//     if (!updateData.usertype) {
//         res.status(400).send('Missing userType field for update');
//         return;
//     }

//     // You can now safely update the usertype along with the other details
//     await prisma.user.update({ where: { id: userId }, data: { usertype: updateData.usertype } });
//     res.redirect('/user-details');
// };

exports.updateUserDetails = async (req, res) => {
    const userId = req.params.userId;
    let updateData = {...req.body};

    // Replace 'state' with 'region' if it exists in your form data
    if(updateData.state) {
        updateData.region = updateData.state;
        delete updateData.state;
    }

    // Convert hobby array to a string if it exists in your form data
    if(Array.isArray(updateData.hobby)) {
        updateData.hobby = updateData.hobby.join(", ");
    }

    // If there's a userType field in the update data, handle it separately
    if (updateData.hasOwnProperty('usertype')) {
        // Retrieve the user requesting the update
        const userRequestingUpdate = await prisma.user.findUnique({
            where: { id: req.user.id }, // Assuming you have req.user.id containing the ID of the currently logged-in user
        });

        // Only allow updating userType if the user requesting the update is an Admin
        if (userRequestingUpdate.usertype !== "Admin") {
            res.status(403).send('You must be an Admin to perform this action');
            return;
        }

        // Update usertype and remove it from updateData
        await prisma.user.update({ where: { id: userId }, data: { usertype: updateData.usertype } });
        delete updateData.usertype;
    }

    // Proceed with updating other details
    await prisma.userDetails.update({ where: { userId: userId }, data: updateData });
    res.redirect('/user-details');
};




//default
// exports.updateUserDetails = async (req, res) => {
//     const userId = req.params.userId;
//     let updateData = {...req.body};

//     // Retrieve the user requesting the update
//     const userRequestingUpdate = await prisma.user.findUnique({
//       where: { id: req.user.id }, // Assuming you have req.user.id containing the ID of the currently logged-in user
//     });

//     // Only allow updating userType if the user requesting the update is an Admin
//     if (userRequestingUpdate.usertype !== "Admin") {
//         res.status(403).send('You must be an Admin to perform this action');
//         return;
//     }

//     if (!updateData.usertype) {
//         res.status(400).send('Missing userType field for update');
//         return;
//     }

//     console.log(updateData);  // Add this line to check the final content of 'updateData'

//     await prisma.user.update({ where: { id: userId }, data: { usertype: updateData.usertype } });
//     res.redirect('/user-details');
// };



exports.deleteUserDetails = async (req, res) => {
    const id = req.params.userId;
    await prisma.userDetails.delete({ where: { userId: id } });
    res.redirect('/user-details');
};


exports.getVisualizePage = async (req, res) => {
    const userDetails = await prisma.userDetails.findMany();
    
    // Transform the data for the charts
    const cityCounts = {};
    const regionCounts = {};
    const countryCounts = {};
    const genderCounts = {};
    const civilStatusCounts = {};

    userDetails.forEach(details => {
        cityCounts[details.city] = (cityCounts[details.city] || 0) + 1;
        regionCounts[details.region] = (regionCounts[details.region] || 0) + 1;
        countryCounts[details.country] = (countryCounts[details.country] || 0) + 1;
        genderCounts[details.gender] = (genderCounts[details.gender] || 0) + 1;
        civilStatusCounts[details.civilStatus] = (civilStatusCounts[details.civilStatus] || 0) + 1;
    });

    res.render('visualize', {
        cityCounts,
        regionCounts,
        countryCounts,
        genderCounts,
        civilStatusCounts,
    });
};

exports.getUserDetails = async (req, res) => {
    const id = req.params.userId;
    const userDetails = await prisma.userDetails.findUnique({ where: { id: id } });
    res.render('userDetails', { userDetails: userDetails });
};

