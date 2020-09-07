const express = require('express');
const router = express.Router();
const {interface} = require('config');

const ResellerClass = require(`../../interfaces/${interface}/classes/resellers`);
let Reseller = new ResellerClass();

//Routes;
router.post('/', async (req, res, next) => {
  try{
    const response = await Reseller.save(req.body);
    return res.responser(200, 'Revendedor cadastrado com sucesso.', response);
  }catch(err){
    next(err);
  }
});

router.get('/', async (req, res, next) => {
  const attributes = req.query.attributes ? req.query.attributes : false;
  try{
    const users = await Reseller.get(req.query, attributes);
    const response = {
        rows: users[0],
        count: users[1]
    }

    if (response.count) {
      return res.responser(200, 'Os revendedores foram listados com sucesso.', response);
    } else {
      return res.responser(200, 'Nenhum revendedor foi encontrado.', response);
    }
  }catch(err){
    next(err);
  }
});

router.get('/me', (req, res, next) => {
  if (req.user) {
    const response = {rows:[req.user],count:1};
    return res.responser(200, 'Revendedor identificado com sucesso.', response);
  } else {
    return res.responser(200, 'Nenhum revendedor foi encontrado para ser listado.');
  }
});

router.get('/:id', async (req, res, next) => {
  if (!req.params.id || isNaN(req.params.id) || req.params.id < 1) {
    return res.responser(400, 'O identificador do revendedor não é válido.');
  }

  let attributes = req.query.attributes ? req.query.attributes : false;
  try{
    const user = await Reseller.get(req.params, attributes);
    const response = {
      rows: user[0],
      count: user[1]
    }

    if (response.count) {
      return res.responser(200, 'Revendedor listado com sucesso.', response);
    } else {
      return res.responser(200, 'Nenhum revendedor foi encontrado para ser listado.', response);
    }
  }catch(err){
    next(err);
  }
});

router.put('/validate/:id', async (req, res, next) => {
  if (!req.params.id || isNaN(req.params.id) || req.params.id < 1) {
    return res.responser(400, 'O identificador do revendedor não é válido.');
  }

  let _where = { id:req.params.id };

  try{
    const response = await Reseller.validate(_where);
    return res.responser(200, 'Revendedor validado com sucesso.');
  }catch(err){
    next(err);
  }
});

router.delete('/', async (req, res, next) => {
  if (!req.body.ids || !Array.isArray(req.body.ids) || !req.body.ids.length) {
    return res.responser(400, 'O identificador dos revendedores não é válido.');
  }

  if(req.body.ids.includes(req.user.id)){
    return res.responser(400, 'O revendedor não pode se deletar.');
  }

  try{
    const response = Reseller.delete(req.body.ids);
    if (response) {
      return res.responser(200, 'Revendedor deletado com sucesso.', response);
    } else {
      return res.responser(400, 'Revendedor não encontrado para ser deletado.', response);
    }
  }catch(err){
    next(err);
  }
});

module.exports = router;