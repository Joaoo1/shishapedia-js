const RecoverPassword = (token) =>
  `<!DOCTYPE html>
  <html lang="pt-br">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recuperar senha</title>
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300&display=swap" rel="stylesheet">
  
    <style>
      body {
        background-color: #8257E5;
        padding-top: 30px;
      }
  
      h1, p {
        font-family: 'Poppins', sans-serif;
        color: white;
        width: 300px;
        text-align: center;
      }
  
      .formContainer {
        margin-bottom: 100px;
        display: flex;
        flex:1;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
  
      .form {
        display: flex;
        flex-direction: column;
        width: 300px;
      }
  
      .input, .submitButton {
        margin-top: 20px;
        padding-top: 12px;
        padding-bottom: 12px;
        border: 1px solid #E6E6F0;
        border-radius: 8px;

        font-family: 'Poppins', sans-serif;
      }
  
      .input {
        background-color: #E6E6F0;
        padding-left: 15px;
        font-size: 11pt;
      }
  
      .submitButton {
        background-color: #24EF7F;
        border: none;
        color: white;
        font-weight: bold;
        font-size: 12pt;
      }
  
    </style>
  </head>
  <body>
    <div class="formContainer">
        <h1>Shishapedia</h1>
        <p>Preencha os campos abaixo para alterar sua senha</p>
        <form 
          class="form" 
          action="http://shishapedia.pagekite.me/reset_password/${token}" 
          method="POST"
        >
          <input 
            type="password" 
            name="password" 
            class="input" 
            placeholder="Digite sua nova senha"/>
  
          <input 
            type="password" 
            name="confirm_password" 
            class="input" 
            placeholder="Confirme a senha"/>
  
          <button type="submit" class="submitButton">Alterar</button>
        <form>
    </div>
  </body>
  </html>`;

export default RecoverPassword;
