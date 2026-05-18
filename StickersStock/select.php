<?php
require_once 'crud.php';

$id = (int)$_GET['id'];
$figurinhas = read($pdo, 'figurinhas', "id = $id");

if ($figurinhas) {
    echo "<h1>" . $figurinhas['nome'] . "</h1>";
    echo "<p><strong>Categoria:</strong> " . $figurinhas['categoria'] . "</p>";
    echo "<p><strong>Descrição:</strong> " . $figurinhas['descricao'] . "</p>";
    echo "<p><strong>Status:</strong> " . $figurinhas['status'] . "</p>";
    echo "<p><strong>Quantidade:</strong> " . $figurinhas['quantidade'] . "</p>";
    echo '<img src="' . $figurinhas['foto'] . '" width="200" alt="Foto de ' . $figurinhas['nome'] . '">';
}
