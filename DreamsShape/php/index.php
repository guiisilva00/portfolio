

<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dream's Shape</title>
    <link rel="stylesheet" href="../css/variaveis.css">
    <link rel="stylesheet" href="../css/style.css">
    <link rel="stylesheet" href="../css/header.css">
    <link rel="stylesheet" href="../css/hero.css">
    <link rel="stylesheet" href="../css/card.css">
    <link rel="stylesheet" href="../css/sobre.css">
    <link rel="stylesheet" href="../css/form.css">
    <link rel="stylesheet" href="../css/footer.css">
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
</head>

<body>
    <?php
    require_once '../partials/header.php';
    ?>
    <main>
        <section class="hero">
            <div class="hero__content">
                <h1 class="hero__title">Conquiste o corpo dos seus <span>sonhos</span>.</h1>
                <p class="hero__subtitle">Transforme seu corpo e alcance seus objetivos fitness com nosso programa de
                    treinamento personalizado. Junte-se a nós e comece sua jornada para um estilo de vida mais saudável
                    hoje mesmo!</p>
                <a href="#contato" class="hero__cta">Comece Agora</a>
            </div>
        </section>

        <section id="cards" class="section section-dark">
            <div class="container">
                <header class="info-header">
                    <h2 class="info-header-title">Por que escolher a Dream's Shape?</h2>
                    <div class="underline"></div>
                </header>
                <div class="card-grid">
                    <article class="info-card ">
                        <div class="info-card-photo">
                            <img src="../img/casa.jpg" alt="#">
                        </div>
                        <h3 class="info-card-title">Desculpa zero</h3>
                        <p class="info-card-text">Treine no conforto da sua casa, sem precisar de equipamentos ou
                            mensalidades. Economizando tempo e garantindo ainda mais benefícios.</p>
                    </article>

                    <article class="info-card ">
                        <div class="info-card-photo">
                            <img src="../img/praia.avif" alt="#">
                        </div>
                        <h3 class="info-card-title">Alta acessibilidade</h3>
                        <p class="info-card-text">Um programa pensado para qualquer nível de experiência. E além disso,
                            Você pode
                            participar de qualquer momento, sem limites de tempo ou local.</p>
                    </article>

                    <article class="info-card ">
                        <div class="info-card-photo">
                            <img src="../img/antesDepois.jpg" alt="#">
                        </div>
                        <h3 class="info-card-title">Resultados rápidos</h3>
                        <p class="info-card-text">Obtenha resultados visíveis em pouco tempo com nossa abordagem eficaz.
                            Garantindo autoestima e motivação para continuar sua jornada fitness.
                        </p>
                    </article>

                    <article class="info-card ">
                        <div class="info-card-photo">
                            <img src="../img/personal.png" alt="#">
                        </div>
                        <h3 class="info-card-title">Acompanhamento personalizado</h3>
                        <p class="info-card-text">
                            Você não estará sozinho nessa jornada. Oferecemos suporte e acompanhamento para garantir que
                            você
                            alcance seus objetivos de forma segura e eficaz.
                        </p>
                    </article>
                </div>
            </div>
        </section>

        <section id="sobre" class="section section-dark">
            <div class="container sobre">
                <div class="sobre-texto">
                    <h2>Como funciona a <span>Dream's Shape</span></h2>

                    <p>
                        O Dreams Shape é um método de treino desenvolvido para quem busca resultados reais sem depender
                        de academia.
                        Com exercícios simples e eficientes, você pode evoluir no conforto da sua casa, respeitando seu
                        ritmo e sua rotina.
                    </p>

                    <p>
                        Nosso objetivo é tornar o treino acessível para todos, ajudando você a transformar seu corpo e
                        melhorar sua qualidade de vida de forma prática e eficaz.
                    </p>

                    <a href="produtos.php" class="botao">Começar agora</a>
                </div>
                <div class="sobre-imagem">
                    <img src="../img/ramon.avif" alt="Pessoa treinando">
                </div>
            </div>
        </section>

        <section id="contato" class="section section-dark">
            <div class="container contato">

                <div class="contato-info">
                    <h2 id="comece">Comece sua transformação</h2>
                    <p>
                        Dê o primeiro passo para conquistar o corpo dos seus sonhos com o Dream’s Shape.
                        Treinos simples, resultados reais.
                    </p>

                    <ul class="contato-beneficios">
                        <li>Sem academia</li>
                        <li>Treinos rápidos</li>
                        <li>Resultados reais</li>
                    </ul>
                </div>

                <div class="contato-form ">
                    <form action="receba.php" method="POST" class="formulario">

                        <div class="grupo">
                            <label>Nome</label>
                            <input type="text" name="nome" placeholder="Seu nome">
                        </div>

                        <div class="grupo">
                            <label>Email</label>
                            <input type="email" name="email" placeholder="seuemail@email.com">
                        </div>

                        <div class="grupo largura-total">
                            <label>Mensagem</label>
                            <textarea name="mensagem" placeholder="Descreva seu objetivo ou dificuldade" rows="4"
                                maxlength="300"></textarea>
                        </div>

                        <div class="grupo largura-total">
                            <label>Objetivo</label>
                            <select name="objetivo">
                                <option>Selecione</option>
                                <option value="Perder peso">Perder peso</option>
                                <option value="Ganhar massa muscular">Ganhar massa muscular</option>
                            </select>
                        </div>

                        <button type="submit" class="botao">Começar agora</button>

                    </form>
                </div>

            </div>
        </section>
        <section id="cards-curso" class="section section-dark">
            <div class="container"></div>


        </section>
    </main>

    <?php
    require_once '../partials/footer.php';
    ?> 
</body>

</html>