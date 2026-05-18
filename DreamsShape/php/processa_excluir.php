<?php
session_start(); 

if (isset($_GET['id'])) {
    $idParaRemover = $_GET['id'];

    if (isset($_SESSION['produtos'])) {
        
        foreach ($_SESSION['produtos'] as $indice => $produto) {
            if ($produto['id'] == $idParaRemover) {
                
                unset($_SESSION['produtos'][$indice]);
                
                $_SESSION['produtos'] = array_values($_SESSION['produtos']);
                
                break; 
            }
        }
    }
}

header("Location: cursoCadastro.php");
exit();
?>