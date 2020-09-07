const router = require('express').Router();
const config = require('config');
const jwt = require('jsonwebtoken');
const moment = require('moment-timezone');
const Util = require('../helpers/util');

const util = new Util();

const configAuth = config.auth;

const ResellerClass = require(`../interfaces/${config.interface}/classes/resellers`);
const Reseller = new ResellerClass();


//Routes
router.post("/login",(req, res, next) => {
  if (!req.body.email) {
    return res.responser(400, 'O email deve ser preenchido.');
  }

  if (!req.body.password) {
    return res.responser(400, 'A senha deve ser preenchida.');
  }
  
  Reseller.checkEmailPassword(req.body.email, req.body.password).then(async (credentials) => {
    if (credentials) {
      let user = credentials.user;
      let checked = credentials.checked;
      if (checked) {
          let userToken = {
            id:  user.dataValues.id,
            name: user.dataValues.name,
            email: user.dataValues.email,
            password: user.dataValues.password
          }
        return res.responser(200, 'Usuário checado com sucesso.', userToken);
      } else {
        return res.responser(401, 'Usuário com email ou senha incorreto.');
      }
    } else {
      return res.responser(401, 'Usuário com email ou senha incorreto.');
    }
  }).catch((err) => {
    next(err);
  });
});

router.get("/logout", (req, res) => {
  const msg = `Logout efetuado com sucesso!`;
  console.info(msg);
  req.logout();
  res.redirect(config.auth.url_logout);
});

module.exports = router;