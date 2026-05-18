<?php
require_once 'crud.php';

$musicas = readAll($pdo, 'musica', 'id < 50');
?>


<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Playlist</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/header.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
</head>

<body>
    <?php
    require_once 'partials/header.php'
    ?>

    <main class="container">
        <h1 class="title">Isso é trap MIXTAPE</h1>
        <table>
            <thead>
                <tr class="verdin">
                    <th>Nº</th>
                    <th>Título</th>
                    <th>Artista (s)</th>
                    <th>Categoria</th>
                    <th>Álbum</th>
                    <th>Ano</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody id="musicas-lista">
                <?php if (count($musicas) > 0): ?>
                    <?php foreach ($musicas as $musica): ?>
                        <tr>
                            <td><?= $musica['id'] ?></td>
                            <td><?= $musica['titulo'] ?></td>
                            <td><?= $musica['artista'] ?></td>
                            <td><?= $musica['categoria'] ?></td>
                            <td><?= $musica['album'] ?></td>
                            <td><?= $musica['ano'] ?></td>
                            <td class="actions"> <a href="editar.php?id=<?= $musica['id'] ?>" class="btn-action btn-edit">✏️</a>
                                <a href="delete.php?id=<?= $musica['id'] ?>" class="btn-action btn-del" onclick="return confirm('Excluir?')">🗑️</a>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                <?php else: ?>
                    <tr>
                        <td colspan="7">
                            <div class="empty-state">
                                <p>Nenhuma música encontrada.</p>
                                <p>Sua playlist está vazia. Que tal adicionar um som?</p>
                                <a href="cadastrar.php" class="btn-primary">ADICIONAR PRIMEIRA MÚSICA</a>
                            </div>
                        </td>
                    </tr>
                <?php endif; ?>
            </tbody>
        </table>
    </main>
</body>

</html>