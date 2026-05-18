<?php
require_once 'crud.php';

if (isset($_POST['titulo'])) {
    
    $novaMusica = [
        'titulo'    => $_POST['titulo'],
        'artista'   => $_POST['artista'],
        'categoria' => $_POST['categoria'],
        'album'     => $_POST['album'],
        'ano'       => $_POST['ano']
    ];

    $idMusicaNova = create($pdo, 'musica', $novaMusica);

    if ($idMusicaNova) {
        header('Location: index.php');
        exit;
    } else {
        echo "Não foi possível adicionar a música.";
    }
}
?>