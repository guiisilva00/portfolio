<?php
require_once('init.php');

$erros = []; // Array para guardar possíveis erros

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // 1. Captura e Sanitização Básica
    $nome = trim($_POST['nome'] ?? '');
    $categoria = trim($_POST['categoria'] ?? '');
    $descricao = htmlspecialchars(trim($_POST['descricao'] ?? ''));
    $detalhes = htmlspecialchars(trim($_POST['detalhes'] ?? ''));
    $imagem = trim($_POST['imagem'] ?? '');
    
    // Captura de preços substituindo vírgula por ponto (caso o usuário digite 10,50)
    $preco_novo_raw = str_replace(',', '.', $_POST['preco_novo'] ?? '0');
    $preco_antigo_raw = str_replace(',', '.', $_POST['preco_antigo'] ?? '0');

    // 2. Validações
    if (empty($nome)) {
        $erros[] = "O nome do curso é obrigatório.";
    }

    $categoriasPermitidas = ['mass', 'burn', 'nutrition'];
    if (!in_array($categoria, $categoriasPermitidas)) {
        $erros[] = "Por favor, selecione uma categoria válida.";
    }

    // Validação de Preços (Garante que são números e >= 0)
    $preco_novo = filter_var($preco_novo_raw, FILTER_VALIDATE_FLOAT);
    $preco_antigo = filter_var($preco_antigo_raw, FILTER_VALIDATE_FLOAT);

    if ($preco_novo === false || $preco_novo < 0) {
        $erros[] = "O preço final informado é inválido.";
    }
    if ($preco_antigo === false || $preco_antigo < 0) {
        $erros[] = "O preço original informado é inválido.";
    }

    // Validação de URL (Se não estiver vazia)
    if (!empty($imagem) && !filter_var($imagem, FILTER_VALIDATE_URL)) {
        $erros[] = "O link da imagem precisa ser uma URL válida.";
    }

    // 3. Se não houver erros, salva na sessão
    if (empty($erros)) {
        if (!isset($_SESSION['produtos'])) {
            $_SESSION['produtos'] = [];
        }

        $ids = array_column($_SESSION['produtos'], 'id');
        $novoId = $ids ? max($ids) + 1 : 1;

        $novoProduto = [
            'id' => $novoId,
            'nome' => $nome,
            'categoria' => $categoria,
            'descricao' => $descricao,
            'detalhes' => $detalhes,
            'preco_novo' => number_format($preco_novo, 2, '.', ''),
            'preco_antigo' => number_format($preco_antigo, 2, '.', ''), // Corrigido o bug do valor fixo!
            'imagem' => !empty($imagem) ? $imagem : '../img/padrao.jpg', 
            'botao' => 'Ver Curso'
        ];

        $_SESSION['produtos'][] = $novoProduto;

        header("Location: cursoCadastro.php?sucesso=1");
        exit();
    }
}
?>


<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../css/variaveis.css">
    <link rel="stylesheet" href="../css/header.css">
    <link rel="stylesheet" href="../css/footer.css">
    <link rel="stylesheet" href="../css/cursoCadastro.css">
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
    <title>Cadastro de Curso</title>
</head>

<body>
    <?php
    require_once('../partials/header.php');
    ?>

    <main>
        <section class="section hero_login">
            <div class="login-card">
                <h2>Cadastrar Novo Curso</h2>

                <form action="cursoCadastro.php" method="POST" enctype="multipart/form-data">

                    <label>Nome do Curso*</label>
                    <input type="text" name="nome" placeholder="Ex: Musculação Iniciante" required>

                    <label>Categoria*</label>
                    <select name="categoria" required>
                        <option value="">Selecione uma categoria</option>
                        <option value="mass">Ganho de Massa</option>
                        <option value="burn">Perda de Peso</option>
                        <option value="nutrition">Dieta Nutritiva</option>
                    </select>

                    <label>Descrição Curta</label>
                    <textarea name="descricao" placeholder="Resumo do curso..."></textarea>

                    <label>Detalhes</label>
                    <textarea name="detalhes" placeholder="Conte um pouco mais do curso..."></textarea>

                    <label>Preço final c/ desconto (R$)</label>
                    <input type="number" name="preco_novo" step="0.01" placeholder="0,00">

                    <label>Preço original (R$)</label>
                    <input type="number" name="preco_antigo" step="0.01" placeholder="0,00">

                    <label>Link da Imagem (URL)</label>
                    <input type="url" name="imagem" placeholder="https://exemplo.com/imagem.jpg">

                    <button type="submit">Salvar Curso</button>

                    <p id="ja"><a href="produtos.php" id="conta">Voltar ao Painel</a></p>
                </form>
            </div>
        </section>
    </main>
    <?php
    require_once '../partials/footer.php';
    ?>
</body>

</html>