var matrizJogo = {
    'a': [0, 0, 0], // Primeira linha
    'b': [0, 0, 0], // Segunda linha
    'c': [0, 0, 0] // Terceira linha
};
var rodada = 1;

$(document).ready(function () {
    /** Ação para iniciar o jogo */
    $("#btn-iniciar-jogo").click(function () {
        // Captura os apelidos

        apelidoJogador1 = $('#entrada-apelido-jogador-1').val();
        apelidoJogador2 = $('#entrada-apelido-jogador-2').val();

        if (!apelidoJogador1 || !apelidoJogador2) {
            // Verifica se os apelidos foram preenchidos
            // Exibe um alerta de erro usando SweetAlert2
            exibirMensagem("error", "Oops...", "Preencha os apelidos para continuar!");
            // Swal.fire({
            //     icon: "error",
            //     title: "Oops...",
            //     text: "Preencha os apelidos para continuar!",
            //     confirmButtonText: "OK"
            // });
            return;
        }


        //contrala visualização das divs
        $('#pagina-inicial').hide();
        $('#palco-jogo').show();

        // Exibir os nomes
        $('#nome-jogador-1').html(apelidoJogador1);
        $('#nome-jogador-2').html(apelidoJogador2);

        // Primeira vez que aparece a vez do jogador
        $('#vez-jogador').html(`Vez de: ${apelidoJogador1}`);
    });

    /** Ação para definir a posição clicada no tabuleiro e fazer marcação */
    $('.jogada').click(function () {

        var idCampo = this.id;
        var linhaColuna = idCampo.split('-'); //quebra a string separando por ('-')
        console.log(linhaColuna);

        //Pegando o indice da linha e coluna
        let lin = linhaColuna[0]; // 'a', 'b', 'c' -> 0, 1, 2
        let col = linhaColuna[1] - 1; // 1, 2, 3 -> 0, 1, 2

        // seu código aqui
        if (rodada % 2 != 0) {
            if (matrizJogo[lin][col] === 0) {
                //atualiza a matriz
                matrizJogo[lin][col] = 1;


                // Atualiza o fundo da célula com a imagem
                let diretorioImg1 = "./images/marcacao_1.png";
                $('#' + idCampo).css('background-image', `url(${diretorioImg1})`);

            } else {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Esta posição já foi marcada! Escolha outra.",
                    confirmButtonText: "OK",
                });
                return;

            }
            $('#vez-jogador').html(`Vez de: ${apelidoJogador2}`);
        } else {
            if (matrizJogo[lin][col] === 0) {
                //atualiza a matriz
                matrizJogo[lin][col] = -1;

                // Atualiza o fundo da célula com a imagem
                let diretorioImg2 = "./images/marcacao_2.png";
                $('#' + idCampo).css('background-image', `url(${diretorioImg2})`);
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Esta posição já foi marcada! Escolha outra.",
                    confirmButtonText: "OK",
                });
                return;
            }
            $('#vez-jogador').html(`Vez de: ${apelidoJogador1}`);
        }
        // Verifica se o jogador venceu
        verificarVencedor();


        // Atualiza a matriz de jogo
        rodada++;
        console.log(matrizJogo);

    });
    // Verifica se o jogo terminou
    function verificarVencedor() {
        //Soma as linhas
        let somaLinhaA = matrizJogo['a'][0] + matrizJogo['a'][1] + matrizJogo['a'][2];
        let somaLinhaB = matrizJogo['b'][0] + matrizJogo['b'][1] + matrizJogo['b'][2];
        let somaLinhaC = matrizJogo['c'][0] + matrizJogo['c'][1] + matrizJogo['c'][2];

        //Soma as colunas
        let somaColunaA = matrizJogo['a'][0] + matrizJogo['b'][0] + matrizJogo['c'][0];
        let somaColunaB = matrizJogo['a'][1] + matrizJogo['b'][1] + matrizJogo['c'][1];
        let somaColunaC = matrizJogo['a'][2] + matrizJogo['b'][2] + matrizJogo['c'][2];


        //Para a diagonal principal, os índices de linha e coluna são iguais:
        //(a,0), (b,1), (c,2) → i = 0, 1, 2
        const chaves = ['a', 'b', 'c'];
        let somaDiagonalPrincipal = 0;
        let somaDiagonalSecundaria = 0;

        for (let i = 0; i < 3; i++) {
            // Para diagonal principal: linha e coluna são iguais
            somaDiagonalPrincipal += matrizJogo[chaves[i]][i];

            // Para diagonal secundária: a coluna é o oposto da linha
            somaDiagonalSecundaria += matrizJogo[chaves[i]][2 - i];

        }

        if (((somaLinhaA == 3) || (somaLinhaB == 3) || (somaLinhaC == 3)) ||
            ((somaColunaA == 3) || (somaColunaB == 3) || (somaColunaC == 3)) || ((somaDiagonalPrincipal == 3) || (somaDiagonalSecundaria == 3))) {
            // Jogador 1 venceu
            Swal.fire({
                icon: "success",
                title: "Vitória!",
                text: `${apelidoJogador1} venceu a partida!`,
                confirmButtonText: "OK"
            }).then(() => reiniciarJogo());
            $('#vez-jogador').html(`Parabens: ${apelidoJogador1}, você venceu!`);
            return;
        }

        if (((somaLinhaA == -3) || (somaLinhaB == -3) || (somaLinhaC == -3)) ||
            ((somaColunaA == -3) || (somaColunaB == -3) || (somaColunaC == -3)) || ((somaDiagonalPrincipal == -3) || (somaDiagonalSecundaria == -3))) {
            // Jogador 2 venceu
            Swal.fire({
                icon: "success",
                title: "Vitória!",
                text: `${apelidoJogador2} venceu a partida!`,
                confirmButtonText: "OK"
            }).then(() => reiniciarJogo());
            $('#vez-jogador').html(`Parabens: ${apelidoJogador2}, você venceu!`);
            return;
        }

        // ⬇️ Aqui entra a verificação de empate
        let todasPreenchidas = true;
        for (let linha of ['a', 'b', 'c']) {
            for (let i = 0; i < 3; i++) {
                if (matrizJogo[linha][i] === 0) {
                    todasPreenchidas = false;
                    break;
                }
            }
        }

        if (todasPreenchidas) {
            Swal.fire({
                icon: "info",
                title: "Empate!",
                text: "O jogo terminou empatado!",
                confirmButtonText: "OK"
            }).then(() => reiniciarJogo());
        }
    }


    $('#btn-reiniciar').click(reiniciarJogo)

    //Resetar o jogo
    function reiniciarJogo() {
        rodada = 1;
        $('#vez-jogador').html(`Vez de: ${apelidoJogador1}`);
        matrizJogo = {
            'a': [0, 0, 0],
            'b': [0, 0, 0],
            'c': [0, 0, 0]
        }
        // Limpa o tabuleiro
        for (let e = 0; e < 3; e++) {
            for (let i = 0; i < 3; i++) {
                switch (e) {
                    case 0:
                        $('#a-' + (i + 1)).css('background-image', 'none');
                        break;
                    case 1:
                        $('#b-' + (i + 1)).css('background-image', 'none');
                        break;
                    case 2:
                        $('#c-' + (i + 1)).css('background-image', 'none');
                        break;
                }
            }
        }

        console.log(matrizJogo);
        // Limpa os apelidos
        $('#entrada-apelido-jogador-1').val('');
        $('#entrada-apelido-jogador-2').val('');

    }

});