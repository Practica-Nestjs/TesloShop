export const EnvConfiguration = () => ({
  db_host: process.env.DB_HOST,
  db_port: +process.env.DB_PORT,
  db_name: process.env.DB_NAME,
  db_username: process.env.DB_USERNAME,
  db_password: process.env.DB_PASSWORD,
  port: +process.env.PORT,
  host_api: process.env.HOST_API,
  jwt_secret: process.env.JWT_SECRET,
});
