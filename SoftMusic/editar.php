<?php
require_once 'crud.php';

if (isset($_GET['id'])) {
    $id = $_GET['id'];

    $dados = read($pdo, 'musica', 'id = ' . $id);
    
    if (!$dados) {
        header('Location: index.php');
        exit;
    }
} else {
    header('Location: index.php');
    exit;
}
?>

<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Edição</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/header.css">
</head>

<body>
    <?php
    require_once 'partials/header.php'
    ?>
    <main class="container">
        <h1 class="title">Editar <span>MUSÍCA</span></h1>

        <form action="update.php" method="POST" class="form-musica">

            <input type="hidden" name="id" value="<?= $dados['id'] ?>">

            <div class="form-group">
                <label>Título da Música</label>
                <input type="text" name="titulo" value="<?= $dados['titulo'] ?>" required>
            </div>

            <div class="form-group">
                <label>Artista(s)</label>
                <input type="text" name="artista" value="<?= $dados['artista'] ?>" required>
            </div>

            <div class="form-group">
                <label>Categoria</label>
                <input type="text" name="categoria" value="<?= $dados['categoria'] ?>">
            </div>

            <div class="form-group">
                <label>Álbum</label>
                <input type="text" name="album" value="<?= $dados['album'] ?>">
            </div>

            <div class="form-group">
                <label>Ano</label>
                <input type="number" name="ano" value="<?= $dados['ano'] ?>">
            </div>

            <div class="form-actions">
                <button type="submit" class="btn">Atualizar Música</button>
                <a href="index.php" class="btn-secundario">Cancelar</a>
            </div>
        </form>
    </main>
</body>

</html>