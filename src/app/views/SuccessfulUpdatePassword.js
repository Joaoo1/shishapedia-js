const SuccessfulUpdatePassword = () =>
  `<!DOCTYPE html>
  <html lang="pt-br">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Senha alterada com sucesso</title>
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300&display=swap" rel="stylesheet">
  
    <style>
      body {
        background-color: #8257E5;
        padding-top: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
      }
  
      h1, p, h2 {
        font-family: 'Poppins', sans-serif;
        color: white;
        width: 200px;
        text-align: center;
      }

      p {
        font-size: 12pt;
      }
  
    </style>
  </head>
  <body>
    <h1>Shishapedia</h1>
    <div>
      <h2>Sucesso</h2>
      <p>A sua senha foi alterada com sucesso, 
      agora você já pode entrar no App com a nova senha.</p>
    </div>
  </body>
  </html>`;

export default SuccessfulUpdatePassword;
