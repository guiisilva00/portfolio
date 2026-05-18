<?php
// Se o seu header.php precisar da sessão iniciada, descomente a linha abaixo:
// require_once 'init.php';

// 1. Captura e Segurança: Usamos htmlspecialchars para evitar que códigos maliciosos quebrem o site
$nome = htmlspecialchars($_POST['nome'] ?? 'Não informado');
$email = htmlspecialchars($_POST['email'] ?? 'Não informado');
$objetivo = htmlspecialchars($_POST['objetivo'] ?? 'Não informado');
$mensagem = htmlspecialchars($_POST['mensagem'] ?? 'Não informada');

// O bloco que adicionava um item fantasma em $_SESSION['produtos'] foi removido!
?>

<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../css/variaveis.css">
    <link rel="stylesheet" href="../css/style.css">
    <link rel="stylesheet" href="../css/header.css">
    <link rel="stylesheet" href="../css/hero.css">
    <link rel="stylesheet" href="../css/footer.css">
    <link rel="stylesheet" href="../css/receba.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="icon" type="image/png" href="../img/s.png">
    <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Lexend+Deca:wght@100..900&family=Major+Mono+Display&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Major+Mono+Display&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Comic+Neue:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Lexend+Deca:wght@100..900&family=Major+Mono+Display&display=swap" rel="stylesheet">
    <title>DS | Dados</title>
</head>

<body>
    <?php require_once '../partials/header.php'; ?>
    
    <main>
        <section class="hero-receba">
            <div class="hero__content">
                <h1 class="hero__title">Cadastro realizado com<span> sucesso!</span></h1>
            </div>
        </section>
        
        <section class="section section-dark">
            <div class="container">
                <header class="info-header">
                    <h2 class="title">Confira os dados que você enviou:</h2>
                    <div class="underline"></div>
                </header>
                
                <div class="card-dados">
                    <p><strong>Nome:</strong> <?= $nome ?></p>
                    <p><strong>Email:</strong> <?= $email ?></p>
                    <p><strong>Objetivo:</strong> <?= $objetivo ?></p>
                    <p><strong>Mensagem:</strong> <?= nl2br($mensagem) ?></p> </div>
            </div> </section>
    </main>
    
    <?php require_once '../partials/footer.php'; ?>
</body>

</html>