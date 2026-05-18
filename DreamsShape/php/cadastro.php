<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../css/variaveis.css">
    <link rel="stylesheet" href="../css/cadastro.css">
    <link rel="stylesheet" href="../css/footer.css">
    <link rel="stylesheet" href="../css/style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="icon" type="image/png" href="../img/s.png">
    <link
        href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Lexend+Deca:wght@100..900&family=Major+Mono+Display&display=swap"
        rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Major+Mono+Display&display=swap" rel="stylesheet">
    <link
        href="https://fonts.googleapis.com/css2?family=Comic+Neue:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Lexend+Deca:wght@100..900&family=Major+Mono+Display&display=swap"
        rel="stylesheet">
    <title>DS | Cadastro</title>
</head>

<body>
    <?php
    require_once('../partials/header2.php');
    ?>

    <section class="section hero_login">
        <div class="login-card">

            <h2>Cadastre-se</h2>

            <form>
                <label>Nome</label>
                <input type="text" placeholder="Nome completo">

                <label>Email</label>
                <input type="email" placeholder="SeuEmail@gmail.com">

                <label>Senha</label>
                <input type="password" placeholder="Informe sua senha">

                <label>Celular</label>
                <input type="number" placeholder="(11) 99999-9999">

                <button>Cadastre-se</button>
                <p id="ja">Já possui conta? <a href="login.php" id="conta">Faça login</a></p>
            </form>
        </div>
    </section>
    <?php
    require_once '../partials/footer.php';
    ?> 
</body>

</html>