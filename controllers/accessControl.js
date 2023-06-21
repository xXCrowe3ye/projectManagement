const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/* Here is the explanation for the code above:
1. First, we are getting the user from the database.
2. Then, we are checking if the user is an admin or manager.
3. If the user is not an admin or manager, then we are checking if the user is a normal user and if the id passed in the URL is the same as the id of the logged in user.
4. If the user is not an admin, manager, or normal user, then we are sending a 403 status code. */

exports.canView = async function(req, res, next) {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    if (user.usertype === 'Admin' || user.usertype === 'Manager' || (user.usertype === 'User' && req.params.userId === user.id)) {
        next();
    } else {
        res.status(403).send('Access denied');
    }
}

exports.canEdit = async function(req, res, next) {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    if (user.usertype === 'Admin' || user.usertype === 'Manager' || (user.usertype === 'User' && req.params.userId === user.id)) {
        next();
    } else {
        res.status(403).send('Access denied');
    }
}

exports.canDelete = async function(req, res, next) {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    if (user.usertype === 'Admin') {
        next();
    } else {
        res.status(403).send('Access denied');
    }
}
