const prisma = require('../config/prisma');

const buscarPorEmail = async (email) => {
    return await prisma.usuaria.findUnique({
        where: {
            email: email.toLowerCase()
        }
    });
};