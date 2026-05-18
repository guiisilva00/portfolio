<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SS | Adicionar figurinha</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/header.css">
</head>

<body>

    <?php
    require_once 'partials/header.php'
    ?>

    <main class="container">
        <h1 class="title">Cadastro de figurinhas</h1>
        <p class="subtitle">Preencha os campos abaixo para incluir uma nova figurinha ao seu inventário. Certifique-se de anexar uma foto nítida para facilitar a identificação durante as trocas!</p>
        <main class="container">
            <form action="insert.php" method="POST" enctype="multipart/form-data" class="form-musica">
                <div class="form-group">
                    <label>Nome da Figurinha</label>
                    <input type="text" name="nome" placeholder="Ex: Neymar Jr." required>
                </div>

                <div class="form-group">
                    <label>Categoria / Time</label>
                    <input type="text" name="categoria" placeholder="Ex: Brasil / Craques" required>
                </div>

                <div class="form-group">
                    <label>Descrição</label>
                    <input type="text" name="descricao" placeholder="Ex: Edição especial brilhante">
                </div>

                <div class="form-group">
                    <label>Quantidade</label>
                    <input type="number" name="quantidade" placeholder="Ex: 1" min="0" required>
                </div>

                <div class="form-group">
                    <label>Status</label>
                    <select name="status">
                        <option value="Pendente">Pendente</option>
                        <option value="Colada">Colada</option>
                        <option value="Repetida">Repetida</option>
                    </select>
                </div>

                <div class="form-group">
                    <label>Foto da Figurinha</label>
                    <input type="file" name="arquivo" accept="image/*" required>
                </div>

                <div class="form-actions">
                    <button type="submit" class="btn">Adicionar Figurinha</button>
                    <a href="index.php" class="btn-secundario">Cancelar</a>
                </div>
            </form>
        </main>
</body>

</html>