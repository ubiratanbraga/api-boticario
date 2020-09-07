const jwt = require('jsonwebtoken');

class tokenGenerator {
  constructor() {}

    create(user, secret) {
      return new Promise((resolve, reject) => {
        jwt.sign({user}, secret, (err, token) => {
          if(err) {
            reject(err)
          }
          resolve(token)
        })
      })
  }
}

module.exports = tokenGenerator;
