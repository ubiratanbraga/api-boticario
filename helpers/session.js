function mysqlStore(session) {
  const dotenv = require('dotenv');
  if (dotenv.config({
      path: `env/${process.env.NODE_ENV}.env`
    }).error) {
    throw new Error(`Verify that .env file exists in the env folder`);
  }

  let options = {
    database: process.env.DBAAS_MYSQL_DATABASE,
    host: process.env.DBAAS_MYSQL_HOSTS,
    port: process.env.DBAAS_MYSQL_PORT,
    user: process.env.DBAAS_MYSQL_USER,
    password: process.env.DBAAS_MYSQL_PASSWORD
  };
  
  let MySQLStore = require('express-mysql-session')(session);
  return new MySQLStore(options);
}

module.exports = {
  mysqlStore
}