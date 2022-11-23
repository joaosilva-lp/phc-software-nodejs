const sql = require ("mssql");
const fs = require('fs/promises');
const config = {
  server: "192.168.1.100", //ip do server
  port: 1433, //porta
  user: "USER",
  password: "PASS",
  database: "DB_NOME",
  options: {
    enableArithAbort: true,
    encrypt: false,
    trustServerCertificate: true,
  },
  connectionTimeout: 150000,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};


async function getDossiers(){
  try{
    const consulta = await fs.readFile('query.txt', { encoding: 'utf8' });
    let pool = await sql.connect(config)
    let result1 = await pool.request().query(consulta);
    console.log(result1);
    sql.close();
}  catch (error) {
    console.log(err.message);
    sql.close();
   }
}
getDossiers()