<?php
require_once 'crud.php';

if (isset($_POST['id'])) {
    $idFigurinha = $_POST['id'];

    $figurinhaAtual = read($pdo, 'figurinhas', "id = $idFigurinha");
    $fotoParaSalvar = $figurinhaAtual['foto']; 

    if (isset($_FILES['arquivo']) && $_FILES['arquivo']['error'] === UPLOAD_ERR_OK) {
        $extensao = pathinfo($_FILES['arquivo']['name'], PATHINFO_EXTENSION);
        $novonome = "figurinha_" . uniqid() . "." . $extensao;
        $caminho = "uploads/$novonome";

        if (move_uploaded_file($_FILES['arquivo']['tmp_name'], $caminho)) {
            $fotoParaSalvar = $caminho;
        }
    }

    $dadosAtualizados = [
        'nome' => $_POST['nome'],
        'categoria' => $_POST['categoria'],
        'descricao' => $_POST['descricao'],
        'status' => $_POST['status'],
        'quantidade' => $_POST['quantidade'],
        'foto' => $fotoParaSalvar
    ];

    $linhasAfetadas = update($pdo, 'figurinhas', $dadosAtualizados, "id = $idFigurinha");

    header('Location: inventario.php?status=updated');
    exit;
}