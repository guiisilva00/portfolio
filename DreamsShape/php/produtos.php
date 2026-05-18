<?php
require_once 'init.php';
if (!isset($_SESSION['produtos'])) {
    $_SESSION['produtos'] = [];
}

$categoria_get = isset($_GET['categoria']) ?
    trim($_GET['categoria']) : '';
//print_r($_GET);
//
//print "<pre>";
//print_r($_SESSION['produtos']);


?>


<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../css/variaveis.css">
    <link rel="stylesheet" href="../css/style.css">
    <link rel="stylesheet" href="../css/header.css">
    <link rel="stylesheet" href="../css/footer.css">
    <link rel="stylesheet" href="../css/produtos.css">
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
    <title>DS | Cursos</title>
</head>

<body>

    <?php
    require '../partials/header.php';
    ?>
    <main>
        <section id="intro">
            <div class="container"></div>
            <h2 class="title">Conheça nosso cursos</h2>
            <div class="underline"></div>
            <p class="subtitle">Explore nossos cursos de treinamento personalizados, projetados para transformar seu
                corpo e alcançar seus objetivos fitness. Com uma abordagem prática e eficiente, oferecemos programas
                adaptados às suas necessidades, seja para emagrecimento, ganho de massa muscular ou melhoria do
                condicionamento físico. Junte-se a nós e comece sua jornada rumo ao corpo dos seus sonhos hoje mesmo!
            </p>
        </section>
        <section id="produto-principal">
            <div class="container">
                <h2>Catálogo</h2>
                <div class="underline"></div>
                <nav class="nav-produto">
                    <a href="produtos.php">Todas</a>
                    <?php
                    foreach ($categorias as $kcat => $vcat) {
                        print '<a href="produtos.php?cat=' . $kcat . '">' . $vcat . '</a>';
                    }
                    ?>
                </nav>
            </div>

            <?php
            $categoria_get = $_GET['cat'] ?? '';

            foreach ($categorias as $kcat => $vcat):

                if ($categoria_get !== '' && $categoria_get !== $kcat) {
                    continue;
                }
                ?>

                <div id="cat-<?= $kcat ?>" class="container">
                    <h2><?= $vcat ?></h2>
                    <br>

                    <?php
                    foreach ($_SESSION['produtos'] as $produto):

                        if (strtolower($produto['categoria']) === $kcat):
                            ?>

                            <div class="container-produto">
                                <div class="produto-media">
                                    <img src="<?= $produto['imagem'] ?>" alt="<?= $produto['nome'] ?>">
                                    <div class="selo-oferta">OFERTA LIMITADA</div>
                                </div>

                                <div class="produto-info">
                                    <h3 class="nome-curso"><?= $produto['nome'] ?></h3>
                                    <p class="texto-dinamico"><?= $produto['descricao'] ?></p>

                                    <div class="caixa-texto">
                                        <p class="texto-dinamico"><?= $produto['detalhes'] ?></p>
                                        <a href="detalhes.php?id=<?= $produto['id'] ?>" class="btn-detalhes">Ver
                                            Detalhes</a>
                                    </div>



                                    <div class="preco-container">
                                        <span class="preco-antigo">R$
                                            <?= number_format($produto['preco_antigo'], 2, ',', '.') ?></span>
                                        <span class="preco-novo">R$ <?= number_format($produto['preco_novo'], 2, ',', '.') ?></span>

                                        <a href="#" class="btn-comprar"><?= $produto['botao'] ?></a>


                                        <a href="processa_excluir.php?id=<?= $produto['id'] ?>"
                                            style="color: #ff4d4d; display: block; margin-top: 10px; font-size: 0.8rem; text-decoration: underline;"
                                            onclick="return confirm('Tem certeza que deseja apagar este curso?')">
                                            Remover Curso
                                        </a>
                                    </div>
                                </div>
                            </div>

                        <?php endif; ?>
                    <?php endforeach; ?>

                </div> <?php endforeach; ?>

        </section>

        <section class="section section-dark">
            <div class="container">
                <h2>Feedback</h2>
                <p class="section-lead">
                    Conheça algumas histórias de sucesso de clientes que transformaram seus corpos e
                    vidas com o método
                    Dream's Shape
                </p>

                <div class="services-grid">
                    <div class="card-whover">
                        <div class="card-content">
                            <span class="case-tag">Transformação</span>
                            <h3>Igor Prestes</h3>
                            <p><strong>Desafio:</strong> falta de disciplina e dificuldade em manter uma
                                rotina de
                                treinos.</p>
                            <p><strong>Solução:</strong> seguir o método Dream's Shape com treinos
                                simples e
                                acompanhamento contínuo.</p>
                            <p><strong>Resultado:</strong> mais consistência, perda de peso e melhora na
                                autoestima.</p>
                        </div>
                    </div>

                    <div class="card-whover">
                        <div class="card-content">
                            <span class="case-tag">Iniciante</span>
                            <h3>Catharina Leite</h3>
                            <p><strong>Desafio:</strong> nunca ter treinado antes e sentir insegurança
                                para começar.</p>
                            <p><strong>Solução:</strong> iniciar com treinos básicos do Dream's Shape em
                                casa.
                            </p>
                            <p><strong>Resultado:</strong> evolução física visível e mais confiança no
                                dia a dia.</p>
                        </div>
                    </div>

                    <div class="card-whover">
                        <div class="card-content">
                            <span class="case-tag">Rotina corrida</span>
                            <h3>Rafael Araújo</h3>
                            <p><strong>Desafio:</strong> falta de tempo por conta do trabalho e estudos.
                            </p>
                            <p><strong>Solução:</strong> aplicar treinos rápidos e eficientes do método.
                            </p>
                            <p><strong>Resultado:</strong> melhora no condicionamento físico mesmo com
                                pouco tempo
                                disponível.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    </main>

    <?php
    require_once '../partials/footer.php';
    ?>

</body>

</html>