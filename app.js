//Load modules;
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('config');
const compression = require('compression');
const morgan = require('morgan');
const helmet = require('helmet');

//Load custom middlewares;
const routeResponser = require('./middlewares/route-responser');
const loginValidation = require('./middlewares/login-validation');
const httpsRedirect = require('./middlewares/https-redirect');

//Instanciate express;
const app = express();

//Implement best pratices security to express;
app.use(helmet());

//Use custom middlewares to responses in routes;
app.use(routeResponser);

//Health route;
app.get('/health', (req, res) => {
  return res.responser(200, 'Server running with ' + process.env.NODE_ENV + ' configuration.');
});

//Redirect to https if configured;
app.use(httpsRedirect);

//Configure morgan to server logs;
const logFormat = '[:date[clf]] IP :remote-addr HTTP/:http-version :method :url :status - :response-time ms';
app.use(morgan(logFormat, {
  skip: function (req, res) {
    return res.statusCode < 400
  },
  stream: process.stderr
}));
app.use(morgan(logFormat, {
  skip: function (req, res) {
    return res.statusCode >= 400
  },
  stream: process.stdout
}));

//Configure CORS for all routes;
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || config.cors.origin.indexOf("*") !== -1 || config.cors.origin.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  methods: config.cors.methods,
  preflightContinue: false,
  optionsSuccessStatus: 200 //some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

//Configure compression gzip;
app.use(compression());

//Configure bodyParser;
app.use(bodyParser.urlencoded({
  extended: false,
  limit: '50mb'
}));
app.use(bodyParser.json({
  limit: '50mb'
}));

//Configure cookieParser;
app.use(cookieParser());

//Configure static folder;
app.use(express.static(path.join(__dirname, 'public')));

//Load routes;
const index = require('./routes/index');
const auth = require('./routes/auth');
const resellers = require('./routes/v1/reseller');
const orders = require('./routes/v1/order');

//APIs without login validation;
app.use('/auth', auth);

//Validate login in below routes;
app.use(loginValidation.validate());

//APIs with login validation;
app.use('/', index);
app.use('/resellers', resellers);
app.use('/order', orders);

// Catch 404 and forward to error handler;
app.use((req, res, next) => {
  let err = new Error('The resource was not found at this URL');
  err.code = 404;
  err.name = 'UrlNotFound';
  err.msg = 'Não foi possível encontrar o recurso nesta url.';
  next(err);
});

// Error handler;
app.use((err, req, res, next) => {
  console.error(err);
  switch (err.name) {
    case 'UrlNotFound':
    case 'InvalidBody':
      return res.responser(err.code, err.msg);
    case 'InvalidUser':
      return res.redirect(`/auth/login`);
    case 'InvalidUserDb':
      return res.responser(401, `Usuário não autorizado.`);
    case 'SequelizeValidationError':
      return res.responser(400, err.message);
    case 'SequelizeDatabaseError':
      if (err.original.code == 'ER_BAD_FIELD_ERROR') {
        return res.responser(400, `Atributo inexistente na entidade.`);
      } else {
        return res.responser(400, err.message);
      }
    case 'SequelizeForeignKeyConstraintError':
      let table = err.table;
      return res.responser(400, `O identificador de '${table}' é inválido.`);
    case 'SequelizeUniqueConstraintError':
      let field = Object.keys(err.fields)[0];
      return res.responser(400, `Um cadastro já foi realizado com o campo '${field}'.`);
    default:
      return res.responser(500, 'Ops ocorreu um erro, tente novamente mais tarde.');
  }
});

module.exports = app;