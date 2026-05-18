<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Stickers Stock</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/header.css">
</head>

<body>

    <?php
    require_once 'partials/header.php'
    ?>

    <main class="container">
            <div class="welcome-section">
                <h1 class="title">Bem-vindo ao <span>Stickers Stock!</span></h1>

                <p class="subtitle">
                    Sua plataforma digital para organizar, gerenciar e facilitar a troca de figurinhas.
                    Mantenha seu álbum sob controle e não perca mais nenhuma repetida!
                </p>

                <div class="features-grid">
                    <div class="feature-card">
                        <i class="icon">➕</i>
                        <h3>Cadastre</h3>
                        <p>Adicione novas figurinhas com fotos, categorias e status de colada ou repetida.</p>
                    </div>

                    <div class="feature-card">
                        <i class="icon">📋</i>
                        <h3>Organize</h3>
                        <p>Visualize seu inventário completo e saiba exatamente o que você tem em mãos.</p>
                    </div>

                    <div class="feature-card">
                        <i class="icon">🔄</i>
                        <h3>Troque</h3>
                        <p>Gerencie suas repetidas e facilite a negociação com outros colecionadores.</p>
                    </div>
                </div>

                <div class="home-actions">
                    <a href="adicionar.php" class="btn">Começar Coleção</a>
                    <a href="inventario.php" class="btn-secundario">Ver meu Inventário</a>
                </div>
            </div>
    </main>

</body>

</html>