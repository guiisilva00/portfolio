<?php

$categorias = [
    'mass' => 'Ganho de Massa',
    'burn' => 'Perda de Peso',
    'nutrition' => 'Dieta Nutritiva'
];

$produtos_base = [
    [
        'id' => 1,
        'nome' => 'DS Mass Gainer',
        'descricao' => 'O programa ideal para quem quer ganhar massa muscular de forma rápida e eficiente, com treinos
                        estruturados e foco total em evolução constante. ',
        'detalhes' => 'Aprenda a montar treinos de hipertrofia, melhorar sua execução e potencializar seus
                            resultados com técnicas comprovadas. Tudo de forma prática, direta e aplicável.',
        'preco_novo' => 97.90,
        'preco_antigo' => 297.00,
        'imagem' => '../img/squat.png',
        'categoria' => 'mass',
        'botao' => 'QUERO GANHAR MASSA'
    ],
    [
        'id' => 2,
        'nome' => 'DS Weight Loss',
        'descricao' => 'Um método completo para emagrecimento, combinando treinos estratégicos e alta queima calórica
                        para resultados visíveis em menos tempo. ',
        'detalhes' => 'Descubra como acelerar seu metabolismo, perder gordura e manter consistência sem dietas
                            extremas ou treinos complicados.',
        'preco_novo' => 107.90,
        'preco_antigo' => 219.00,
        'imagem' => '../img/burn2.avif',
        'categoria' => 'burn',
        'botao' => 'QUERO PERDER PESO'
    ],
    [
        'id' => 3,
        'nome' => 'DS Nutritional Diet',
        'descricao' => 'Um guia completo para transformar sua alimentação e potencializar seus resultados, sem
                        complicação e sem restrições impossíveis. ',
        'detalhes' => 'Aprenda a montar uma dieta equilibrada, escolher os alimentos certos e manter consistência
                            para alcançar seus objetivos com saúde.',
        'preco_antigo' => 149.00,
        'preco_novo' => 59.90,
        'imagem' => '../img/nutrition.jpg',
        'categoria' => 'nutrition',
        'botao' => 'QUERO ME ALIMENTAR MELHOR'
    ],
];
?>