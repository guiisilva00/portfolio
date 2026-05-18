<?php
require_once 'crud.php';
$figurinhas = readAll($pdo, 'figurinhas');
?>


<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SS | Inventário</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/header.css">
</head>

<body>

    <?php
    require_once 'partials/header.php';
    ?>

    <main class="container">
        <h1 class="title">Meu Inventário</h1>
        <p class="subtitle">Bem-vindo à sua coleção oficial. Aqui você pode gerenciar cada detalhe das suas figurinhas, acompanhar quais já foram coladas e organizar suas repetidas para futuros trocas. Mantenha seu inventário atualizado e complete seu álbum!</p>

        <div class="features-grid grid-inventario">
            <?php foreach ($figurinhas as $f): ?>
                <div class="sticker-card ">
                    <img src="<?= $f['foto'] ?>" alt="<?= $f['nome'] ?>" class="sticker-img">
                    <div class="sticker-info">
                        <h3 class="sticker-name"><?= $f['nome'] ?></h3>

                        <span class="badge <?= ($f['status'] == 'Repetida') ? 'status-repetida' : 'status-colada' ?>">
                            <?= $f['status'] ?>
                        </span>

                        <p class="sticker-detail"><strong>Categoria:</strong> <?= $f['categoria'] ?></p>
                        <p class="sticker-detail"><strong>Quantidade:</strong> <?= $f['quantidade'] ?></p>
                        <p class="sticker-detail"><strong>Cadastrada em:</strong> <?= date('d/m/Y', strtotime($f['data_cadastro'])) ?></p>

                        <p class="sticker-description"><?= $f['descricao'] ?></p>

                        <div class="actions">
                            <a href="editar.php?id=<?= $f['id'] ?>" class="btn-action btn-edit">Editar</a>
                            <a href="delete.php?id=<?= $f['id'] ?>" class="btn-action btn-del" onclick="return confirm('Deseja excluir essa figurinha?')">Excluir</a>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </main>
</body>

</html>