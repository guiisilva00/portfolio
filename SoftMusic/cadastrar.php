<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Adicionar música</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/header.css">
</head>

<body>
    <?php
    require_once 'partials/header.php'
    ?>

    <main class="container">
        <h1 class="title">Cadastre seu novo <span>SOM!</span></h1>

        <form action="insert.php" method="POST" class="form-musica">
            <div class="form-group">
                <label>Título da Música</label>
                <input type="text" name="titulo" placeholder="Ex: AUTOBAHN" required>
            </div>

            <div class="form-group">
                <label>Artista(s)</label>
                <input type="text" name="artista" placeholder="Ex: DESSIIIK" required>
            </div>

            <div class="form-group">
                <label>Categoria</label>
                <input type="text" name="categoria" placeholder="Ex: Trap">
            </div>

            <div class="form-group">
                <label>Álbum</label>
                <input type="text" name="album" placeholder="Ex: Calzone Tapes Vol 3.">
            </div>

            <div class="form-group">
                <label>Ano</label>
                <input type="number" name="ano" placeholder="Ex: 2024">
            </div>

            <div class="form-actions">
                <button type="submit" class="btn">Salvar Música</button>
                <a href="index.php" class="btn-secundario">Cancelar</a>
            </div>
        </form>
    </main>
</body>

</html>