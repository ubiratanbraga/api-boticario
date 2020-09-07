const { Users } = require(`../`);

const validateToken = token =>
  Users.findOne({
    where: {
      token
    }
  });
 
module.exports = { validateToken };