const { dateToString, getDateExtensive } = require("../utils");

function generateReportEmail(nome, field_name, data) {
  return `<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AGRI-ARO</title>
    <style>
        body{
            font-family: sans-serif;
        }
        .d-flex{
            display: flex;
        }

        .items-center{
            align-items: center;
        }
        .gap{
            gap: 10px;
        }

        p{
            margin-bottom: 15px;
        }
    </style>
</head>
<body>
    <div class="d-flex gap items-center">
        <img src="https://api-agriaro.arotec.ao/assets/seed_green.png" width="30" alt="">
       <strong> AGRI-ARO</strong>
    </div>

  <p><strong>Assunto:</strong> Relatório Disponível</p> 

   <p> Olá ${nome},</p>
    
    <p>
    Gostaríamos de informar que o relatório do campo ${field_name} referente ao dia ${getDateExtensive(data)} está agora disponível.
</p> 
<p>
    Para acessar o relatório, por favor, clique 
    <a href="https://agriaro.arotec.ao/app/report?date=${dateToString(data)}"> Aqui</a>
</p>
<p>
    Caso tenha alguma dúvida ou necessite de mais informações, estamos à disposição.
</p>
<br><br>
    Atenciosamente,  <br>
    <strong>AROTEC</strong>
</body>
</html>`;
}

function generateAlertEmail(nome, date, alertas) {
  const [data, hora] = date.toLocaleString("pt").split(" ");

  let alertasString = "";

  for (const alerta of alertas) {
    alertasString += ` <p>
        <strong>${alerta.title}</strong> <br>
        <div class="ml-2">
            <p>- Atual: ${alerta.value} ${alerta.unit}</p>
            <p>- Ideal: ${alerta.interval.min}-${alerta.interval.max} ${alerta.unit}</p>
        </div>
    </p>`;
  }
  return `<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AGRI-ARO</title>
    <style>
        body{
            font-family: sans-serif;
        }
        .d-flex{
            display: flex;
        }

        .items-center{
            align-items: center;
        }
        .gap{
            gap: 10px;
        }

        p{
            margin-bottom: 15px;
        }
        .ml-2{
            margin-left: 20px;
        }
    </style>
</head>
<body>
    <div class="d-flex gap items-center">
        <img src="https://api-agriaro.arotec.ao/assets/seed_green.png" width="30" alt="">
       <strong> AGRI-ARO</strong>
    </div>

  <p><strong>Assunto:</strong> Alerta de Níveis Críticos </p> 

   <p> Olá ${nome},</p>
    
    <p>
        Gostaríamos de informar que, em ${data} às ${hora}, o seu sistema AGRI-ARO detectou níveis críticos de:
    

    ${alertasString}
   

        <p>
    
    Você pode visualizar mais detalhes e acompanhar a situação diretamente em seu painel do AGRI-ARO clique:
    <a href="https://agriaro.arotec.ao/app"> Aqui</a>
</p>
<p>
    Caso tenha alguma dúvida ou necessite de mais informações, estamos à disposição.
</p>
<br><br>
    Atenciosamente,  <br>
    <strong>AROTEC</strong>
</body>
</html>`;
}
export { generateReportEmail, generateAlertEmail };
