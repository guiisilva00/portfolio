<?php
require_once 'crud.php';

if (isset($_GET['id'])) {
    
    $idFigurinha = $_GET['id'];

    $deleted = delete($pdo, 'figurinhas', 'id = ' . $idFigurinha);

    if ($deleted) {
        header('Location: inventario.php');
        exit; 
    } else {
        echo "Não foi possível apagar a figurinha selecionada.";
    }

} else {
    header('Location: inventario.php');
    exit;
}
?>