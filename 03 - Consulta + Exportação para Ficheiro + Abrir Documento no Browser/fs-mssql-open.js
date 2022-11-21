const sql = require ("mssql");
const fs = require ('fs');
const open = require('open');

const config = {
  server: "192.168.1.100", //IP do servidor
  port: 1433, //Porta
  user: "USER", //Utilizador
  password: "PASS", //Password
  database: "DB", //Nome da Base de Dados
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


// Expressão SQL
const consulta = `select bo.nmdos, bo.obrano, bo.nome, bo.dataobra

from bo
inner join bo2 on bo2.bo2stamp=bo.bostamp  
inner join bi on bi.bostamp=bo.bostamp   
where bo.ndos=1 and bo.dataobra>'2022-01-01 00:00:00.000' and bi.design like '%adj%'
order by dataobra desc`


async function getDossiers(){
  try{
    let pool = await sql.connect(config)
    let result1 = await pool.request().query(consulta);
    console.log(result1);
    const data = JSON.stringify(result1.recordset);
//Nome e formato do ficheiro:
	fs.writeFile('resultado.json', data, (err) => {
  		if (err) throw err;
  		console.log('ficheiro escrito!');
        await open('resultado.json', {app: {name: 'firefox'}});
	});
    sql.close();
}  catch (error) {
    console.log(err.message);
    sql.close();
   }
}
getDossiers();