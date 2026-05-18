<?php
require_once 'init.php';

// 1. Captura o ID da URL garantindo que seja um número inteiro
$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

// 2. Garante que o array de produtos exista, mesmo que a sessão esteja vazia
$produtos = $_SESSION['produtos'] ?? [];

// 3. Busca a posição (index) do produto dentro do array usando o ID
$index = array_search($id, array_column($produtos, 'id'));

// 4. Se não encontrar (retornar false), manda para a página de erro
if ($index === false) {
    header("Location: 404.php");
    exit();
}

// 5. Se encontrou, salva o produto em uma variável simples
$produto = $produtos[$index];
?>

<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../css/variaveis.css">
    <link rel="stylesheet" href="../css/style.css">
    <link rel="stylesheet" href="../css/header.css">
    <link rel="stylesheet" href="../css/footer.css">
    <link rel="stylesheet" href="../css/detalhes.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Lexend+Deca:wght@100..900&display=swap" rel="stylesheet">
    <link rel="icon" type="image/png" href="../img/s.png">
    
    <title>DS | <?= htmlspecialchars($produto['nome']) ?></title>
</head>
<body>

    <?php require '../partials/header.php'; ?>
    
    <main>
        <section class="section section-dark">
            <div class="container detalhe-wrapper">
                
                <h2 class="title"><?= htmlspecialchars($produto['nome']) ?></h2>
                <div class="underline"></div>
                
                <img class="detalhe-img" src="<?= htmlspecialchars($produto['imagem']) ?>" alt="<?= htmlspecialchars($produto['nome']) ?>">
                
                <div class="detalhe-box">
                    <p class="subtitle" style="margin-bottom: 10px;">
                        <strong>Resumo:</strong> <?= htmlspecialchars($produto['descricao']) ?>
                    </p>
                    
                    <div class="divider" style="margin: 30px 0;"></div>
                    
                    <h3 style="margin-bottom: 15px; font-family: var(--fonte-principal); font-weight: 400;">Detalhes do Programa</h3>
                    <p style="color: var(--color-text-muted); line-height: 1.6; text-align: left;">
                        <?= htmlspecialchars($produto['detalhes']) ?>
                    </p>

                    <div class="preco-destaque">
                        R$ <?= number_format($produto['preco_novo'], 2, ',', '.') ?>
                    </div>

                    <a href="#" class="botao" style="font-size: 1.2rem; padding: 15px 40px;">
                        <?= htmlspecialchars($produto['botao']) ?>
                    </a>
                </div>
                
                <a href="produtos.php" class="link-voltar">
                    ← Voltar para o Catálogo de Cursos
                </a>

            </div>
        </section>
    </main>

    <?php require_once '../partials/footer.php'; ?> 

</body>
</html>