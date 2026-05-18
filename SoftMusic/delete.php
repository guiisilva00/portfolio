<?php
require_once 'crud.php';

if (isset($_GET['id'])) {
    
    $idMusica = $_GET['id'];

    $deleted = delete($pdo, 'musica', 'id = ' . $idMusica);

    if ($deleted) {
        header('Location: index.php');
        exit; 
    } else {
        echo "Não foi possível apagar a música selecionada.";
    }

} else {
    header('Location: index.php');
    exit;
}
?>