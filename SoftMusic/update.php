<?php
require_once 'crud.php';

if (isset($_POST['id'])) {
    
    $idMusica = $_POST['id'];

    $dadosAtualizados = [
        'titulo'    => $_POST['titulo'],
        'artista'   => $_POST['artista'],
        'categoria' => $_POST['categoria'],
        'album'     => $_POST['album'],
        'ano'       => $_POST['ano']
    ];

    $linhasAfetadas = update($pdo, 'musica', $dadosAtualizados, 'id = ' . $idMusica);

    if ($linhasAfetadas >= 0) { 
        header('Location: index.php?status=updated');
        exit;
    } else {
        echo 'Não foi possível alterar a música!!!';
    }
} else {
    header('Location: index.php');
    exit;
}