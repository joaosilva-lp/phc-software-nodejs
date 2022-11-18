const sql = require ("mssql");

const config = {
  server: "IP DO SERVIDOR",
  port: Nº DA PORTA,
  user: "UTILIZADOR",
  password: "A SUA PASSWORD",
  database: "Nome da Base de Dados",
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

// ABAIXO PODE ESCREVER A SUA EXPRESSÃO SQL

const consulta = `select bo.nmdos, bo.obrano, bo.nome, bo.dataobra
from bo
inner join bo2 on bo2.bo2stamp=bo.bostamp  
inner join bi on bi.bostamp=bo.bostamp   
where bo.ndos=1 and bo.dataobra>'2022-01-01 00:00:00.000'
order by dataobra desc`


async function getDossiers(){
  try{
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
