<?php
require_once 'crud.php';

if (isset($_GET['id'])) {
    $id = $_GET['id'];

    $dados = read($pdo, 'figurinhas', 'id = ' . $id);

    if (!$dados) {
        header('Location: inventario.php');
        exit;
    }
} else {
    header('Location: inventario.php');
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
        <h1 class="title">Editar <span>Figurinha</span></h1>

        <main class="container">
            <h1 class="title">Editar <span>Figurinha</span></h1>

            <form action="update.php" method="POST" enctype="multipart/form-data" class="form-musica">

                <input type="hidden" name="id" value="<?= $dados['id'] ?>">

                <div class="form-group">
                    <label>Nome da Figurinha</label>
                    <input type="text" name="nome" value="<?= $dados['nome'] ?>" required>
                </div>

                <div class="form-group">
                    <label>Categoria / Time</label>
                    <input type="text" name="categoria" value="<?= $dados['categoria'] ?>" required>
                </div>

                <div class="form-group">
                    <label>Descrição</label>
                    <input type="text" name="descricao" value="<?= $dados['descricao'] ?>">
                </div>

                <div class="form-group">
                    <label>Quantidade</label>
                    <input type="number" name="quantidade" value="<?= $dados['quantidade'] ?>" min="0" required>
                </div>

                <div class="form-group">
                    <label>Status</label>
                    <select name="status">
                        <option value="Pendente" <?= $dados['status'] == 'Pendente' ? 'selected' : '' ?>>Pendente</option>
                        <option value="Colada" <?= $dados['status'] == 'Colada' ? 'selected' : '' ?>>Colada</option>
                        <option value="Repetida" <?= $dados['status'] == 'Repetida' ? 'selected' : '' ?>>Repetida</option>
                    </select>
                </div>

                <div class="form-group">
                    <label>Foto da Figurinha (Deixe vazio para manter a atual)</label>
                    <input type="file" name="arquivo" accept="image/*">
                </div>

                <div class="form-actions">
                    <button type="submit" class="btn">Salvar Alterações</button>
                    <a href="inventario.php" class="btn-secundario">Cancelar</a>
                </div>
            </form>
        </main>
    </main>
</body>

</html>