<?php
require_once 'crud.php';

$novaFigurinha = [
    'nome' => $_POST['nome'],
    'categoria' => $_POST['categoria'],
    'descricao' => $_POST['descricao'],
    'status' => $_POST['status'],
    'quantidade' => $_POST['quantidade'],
    'foto' => ''
];

$idFigurinha = create($pdo, 'figurinhas', $novaFigurinha);

$tipos_permitidos = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
if (! in_array($_FILES['arquivo']['type'], $tipos_permitidos)) {
    echo "Tipo de arquivo não permitido. Por favor, envie uma imagem JPEG, PNG OU GIF.";
    exit;
}

$tamanho_max = 1 * 1024 * 1024; // 1MB
if ($_FILES['arquivo']['size'] > $tamanho_max) {
    echo "O arquivo é muito grande. O tamanho máximo permitido é 1MB.";
    exit;
}

$extensao = pathinfo($_FILES['arquivo']['name'], PATHINFO_EXTENSION);
$novonome = "figurinha_" . uniqid() . "." . $extensao;

$dir = "uploads/";
$caminho = $dir . "$idFigurinha/";
$file = $caminho . $novonome;

if (!is_dir($caminho)) {
    mkdir($caminho, 0777, true);
}

if (move_uploaded_file($_FILES['arquivo']['tmp_name'], $file)) {
    $fotoUrl = $file;

    update($pdo, 'figurinhas', ['foto' => $fotoUrl], "id = $idFigurinha");

    header("Location: inventario.php"); 
    exit; 
} else {
    echo "Erro ao enviar a imagem da figurinha.";
}