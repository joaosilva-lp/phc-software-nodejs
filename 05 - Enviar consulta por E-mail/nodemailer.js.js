const sql = require ("mssql");
const fs = require ('fs');

const config = {
  server: "192.168.1.100", //IP do Servidor
  port: 1433, //Porta
  user: "Utilizador", //Utilizador
  password: "PASS", //Password
  database: "DB", //Base de Dados
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

//Express�o SQL

const consulta = `select nmdos, obrano, dataobra, nome, etotaldeb, contacto, u_c2tacto, u_dados, u_realizado
from u_segui (nolock) inner join bo (nolock) on bo.bostamp = u_segui.u_oristamp 
inner join bo2 (nolock) on bo2.bo2stamp = bo.bostamp 
where u_data<=convert(date, SYSDATETIME()) and u_segui.u_realizado = 0 and u_segui.u_user='JSilva' and u_segui.u_data <= getdate() and bo.fechada = 0 and u_segui.u_origem = 'BO' and bo2.u_estado in ('Em decis�o','Espera marca��o triagem','Espera or�.')
order by u_segui.u_data desc`


async function getDossiers(){
  try{
    let pool = await sql.connect(config)
    let result1 = await pool.request().query(consulta);
    console.log(result1);
    const data = JSON.stringify(result1.recordset);
//Gerar ficheiro JSON:
	fs.writeFile('resultado.json', data, (err) => {
  		if (err) throw err;
  		console.log('ficheiro escrito!');
	});
//Configura��es para envio de e-mail:
    const nodemailer = require('nodemailer');

    let transporter = nodemailer.createTransport({
      host: '', //dominio do host, exemplo smtp.oseusite.dominio
      port: 25, //porta
      secure: false,
      // use SSL or not
      auth: {
        user: 'emailexemplo@dominio.xyz', //o seu endere�o de e-mail
        pass: 'Password' //a password do seu e-mail
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    let texto = JSON.stringify(result1.recordsets, null, '&nbsp;').split('\n').join('<br>');
    let mailOptions = {
      from: 'REMETENTE', //e-mail do remetente
      to: 'DESTINATARIO', //e-mail do destinat�rio
      subject: 'Este � o Assunto', //Assunto do E-mail
      //text: '',
      html: `Bom dia, <br> Encontrei ${JSON.stringify(result1.rowsAffected).replaceAll("[", "").replaceAll("]", "")} seguimentos por realizar: ${texto.trim().replaceAll("nmdos", "Dossier").replaceAll("obrano", "N�").replaceAll("nome", "Cliente").replaceAll("dataobra", "Data").replaceAll("u_estado", "Estado da Oportunidade").replaceAll("[", "").replaceAll("]", "").replaceAll("{", "").replaceAll("}", "").replaceAll(",", "").replaceAll('"', "").replaceAll("contacto","Pessoa de Contacto").replaceAll('T00:00:00.000Z', "").replaceAll("u_c2tacto","Contacto").replaceAll("u_dados","Observa��es").replaceAll("false","N�o").replaceAll("u_realizado","Seguimento Realizado?").replaceAll("etotaldeb","Valor")}<br><br> Com os melhores cumprimentos,<br>Jo�o Silva`
    }; // c�digo HTML com os dados pretendidos e o respetivo texto a enviar. 
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error.message);
      }

      console.log('E-mail enviado!: %s', info.messageId);
      console.log(mailOptions)
    });
    sql.close();
}  catch (error) {
    console.log(err.message);
    sql.close();
   }
}
getDossiers();