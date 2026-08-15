/* =========================================================
   RUN & SAMBA 2026
   PAGAR INSCRIÇÃO
   CPF + SUPABASE
   PAGAMENTO EXTERNO PELA IZY
========================================================= */

const SUPABASE_URL =
    "https://tqezxxobxsipjjuyydvc.supabase.co";

const SUPABASE_ANON_KEY =
    "sb_publishable_Yt-DyfGqRqfbPN6aPgLM5w_K2RIneDd";

/*
   LINK FIXO DO PAGAMENTO
   Não é salvo nem consultado no Supabase.
*/
const IZY_PAYMENT_URL =
    "https://eventos.izypass.com.br/share/run-and-samba-2-edicao_luziania_20-11-2026";


/* =========================================================
   CONEXÃO SUPABASE
========================================================= */

const { createClient } = supabase;

const db = createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("formConsulta");
    const cpf = document.getElementById("cpf");
    const btnConsultar = document.getElementById("btnConsultar");
    const mensagem = document.getElementById("mensagem");
    const resultado = document.getElementById("resultado");

    const resultadoNome =
        document.getElementById("resultadoNome");

    const resultadoCPF =
        document.getElementById("resultadoCPF");

    const resultadoPercurso =
        document.getElementById("resultadoPercurso");

    const resultadoCamiseta =
        document.getElementById("resultadoCamiseta");

    const resultadoValor =
        document.getElementById("resultadoValor");

    const resultadoStatus =
        document.getElementById("resultadoStatus");

    const btnPagamento =
        document.getElementById("btnPagamento");

    const statusPagamento =
        document.getElementById("statusPagamento");


    /* =====================================================
       VERIFICAÇÃO DOS ELEMENTOS
    ===================================================== */

    if (!form || !cpf) {
        console.error(
            "Formulário ou campo CPF não encontrado."
        );

        return;
    }


    /* =====================================================
       CPF
    ===================================================== */

    function limparCPF(valor) {

        return String(valor || "")
            .replace(/\D/g, "")
            .substring(0, 11);
    }


    function formatarCPF(valor) {

        const numero = limparCPF(valor);

        if (numero.length <= 3) {
            return numero;
        }

        if (numero.length <= 6) {

            return numero.replace(
                /^(\d{3})(\d{1,3})$/,
                "$1.$2"
            );
        }

        if (numero.length <= 9) {

            return numero.replace(
                /^(\d{3})(\d{3})(\d{1,3})$/,
                "$1.$2.$3"
            );
        }

        return numero.replace(
            /^(\d{3})(\d{3})(\d{3})(\d{1,2})$/,
            "$1.$2.$3-$4"
        );
    }


    /* =====================================================
       VALIDAÇÃO CPF
    ===================================================== */

    function cpfValido(valor) {

        const numero = limparCPF(valor);

        if (numero.length !== 11) {
            return false;
        }

        /*
           Impede CPFs como:
           111.111.111-11
           222.222.222-22
           etc.
        */

        if (/^(\d)\1{10}$/.test(numero)) {
            return false;
        }


        /* Primeiro dígito */

        let soma = 0;

        for (let i = 0; i < 9; i++) {

            soma +=
                Number(numero[i]) *
                (10 - i);
        }

        let resto = soma % 11;

        const digito1 =
            resto < 2
                ? 0
                : 11 - resto;

        if (digito1 !== Number(numero[9])) {
            return false;
        }


        /* Segundo dígito */

        soma = 0;

        for (let i = 0; i < 10; i++) {

            soma +=
                Number(numero[i]) *
                (11 - i);
        }

        resto = soma % 11;

        const digito2 =
            resto < 2
                ? 0
                : 11 - resto;


        return digito2 === Number(numero[10]);
    }


    /* =====================================================
       MENSAGENS
    ===================================================== */

    function mostrarMensagem(
        texto,
        tipo = "erro"
    ) {

        if (!mensagem) {

            alert(texto);

            return;
        }

        mensagem.textContent = texto;

        mensagem.className =
            "mensagem " + tipo;

        mensagem.style.display = "block";
    }


    function limparMensagem() {

        if (!mensagem) {
            return;
        }

        mensagem.textContent = "";

        mensagem.className =
            "mensagem";

        mensagem.style.display = "none";
    }


    /* =====================================================
       ESCONDER RESULTADO
    ===================================================== */

    function esconderResultado() {

        if (!resultado) {
            return;
        }

        resultado.hidden = true;
        resultado.style.display = "none";
    }


    /* =====================================================
       FORMATAÇÃO DO VALOR
       
       Como não vamos consultar valor no Supabase,
       usamos o valor fixo da inscrição.
    ===================================================== */

    function formatarValor() {

        return "R$ 89,90";
    }


    /* =====================================================
       CONSULTAR CPF NO SUPABASE
       
       IMPORTANTE:
       SOMENTE CONSULTAMOS A EXISTÊNCIA DA INSCRIÇÃO.

       NÃO CONSULTAMOS:
       - status
       - pagamento
       - payment_url
       - izy_payment_url
       - valor
    ===================================================== */

    async function consultarCPF(cpfInformado) {

        const cpfLimpo =
            limparCPF(cpfInformado);


        const resposta = await db
            .from("inscricoes")
            .select(`
                id,
                nome,
                cpf,
                percurso,
                camiseta
            `)
            .eq("cpf", cpfLimpo)
            .limit(1);


        if (resposta.error) {

            console.error(
                "Erro retornado pelo Supabase:",
                resposta.error
            );

            throw resposta.error;
        }


        if (
            !resposta.data ||
            resposta.data.length === 0
        ) {

            return null;
        }


        return resposta.data[0];
    }


    /* =====================================================
       MOSTRAR INSCRIÇÃO
    ===================================================== */

    function mostrarInscricao(inscricao) {

        /*
           Nome
        */

        if (resultadoNome) {

            resultadoNome.textContent =
                inscricao.nome ||
                "Participante";
        }


        /*
           CPF
        */

        if (resultadoCPF) {

            resultadoCPF.textContent =
                formatarCPF(
                    inscricao.cpf ||
                    cpf.value
                );
        }


        /*
           Percurso
        */

        if (resultadoPercurso) {

            resultadoPercurso.textContent =
                inscricao.percurso ||
                "—";
        }


        /*
           Camiseta
        */

        if (resultadoCamiseta) {

            resultadoCamiseta.textContent =
                inscricao.camiseta ||
                "—";
        }


        /*
           Valor fixo
        */

        if (resultadoValor) {

            resultadoValor.textContent =
                formatarValor();
        }


        /*
           NÃO existe consulta de pagamento.

           Portanto, toda inscrição encontrada
           fica disponível para pagamento.
        */

        if (resultadoStatus) {

            resultadoStatus.textContent =
                "AGUARDANDO PAGAMENTO";
        }


        if (statusPagamento) {

            statusPagamento.classList.remove(
                "status-pago"
            );
        }


        /*
           Link fixo da Izy
        */

        if (btnPagamento) {

            btnPagamento.href =
                IZY_PAYMENT_URL;

            btnPagamento.target =
                "_blank";

            btnPagamento.rel =
                "noopener noreferrer";

            btnPagamento.style.display =
                "flex";
        }


        /*
           Mostrar resultado
        */

        resultado.hidden = false;

        resultado.style.display =
            "block";


        /*
           Mensagem de sucesso
        */

        mostrarMensagem(
            "Inscrição encontrada! Agora você pode realizar o pagamento.",
            "sucesso"
        );


        /*
           Rolar até o resultado
        */

        resultado.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });
    }


    /* =====================================================
       MÁSCARA CPF
    ===================================================== */

    cpf.addEventListener(
        "input",
        () => {

            cpf.value =
                formatarCPF(cpf.value);

            esconderResultado();
            limparMensagem();
        }
    );


    /* =====================================================
       ENVIO DO FORMULÁRIO
    ===================================================== */

    form.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            limparMensagem();
            esconderResultado();


            const cpfLimpo =
                limparCPF(cpf.value);


            /*
               CPF incompleto
            */

            if (cpfLimpo.length !== 11) {

                mostrarMensagem(
                    "Digite o CPF completo.",
                    "erro"
                );

                cpf.focus();

                return;
            }


            /*
               CPF inválido
            */

            if (!cpfValido(cpfLimpo)) {

                mostrarMensagem(
                    "Digite um CPF válido.",
                    "erro"
                );

                cpf.focus();

                return;
            }


            /*
               Estado do botão
            */

            if (btnConsultar) {

                btnConsultar.disabled = true;

                const span =
                    btnConsultar.querySelector(
                        "span"
                    );

                if (span) {

                    span.textContent =
                        "CONSULTANDO...";
                }
            }


            try {

                /*
                   Consulta somente o CPF
                */

                const inscricao =
                    await consultarCPF(
                        cpfLimpo
                    );


                /*
                   CPF não encontrado
                */

                if (!inscricao) {

                    mostrarMensagem(
                        "CPF não encontrado. Verifique o número informado.",
                        "erro"
                    );

                    return;
                }


                /*
                   CPF encontrado
                */

                mostrarInscricao(
                    inscricao
                );


            } catch (erro) {

                console.error(
                    "Erro ao consultar CPF:",
                    erro
                );


                /*
                   Mostra o erro real no console
                   para facilitar a identificação.
                */

                mostrarMensagem(
                    "Não foi possível consultar sua inscrição. Tente novamente.",
                    "erro"
                );


            } finally {

                /*
                   Restaurar botão
                */

                if (btnConsultar) {

                    btnConsultar.disabled =
                        false;

                    const span =
                        btnConsultar.querySelector(
                            "span"
                        );

                    if (span) {

                        span.textContent =
                            "CONSULTAR INSCRIÇÃO";
                    }
                }
            }
        }
    );


    /* =====================================================
       INICIALIZAÇÃO CPF
    ===================================================== */

    cpf.value =
        formatarCPF(cpf.value);


    console.log(
        "✅ Pagar inscrição carregado."
    );

    console.log(
        "✅ Supabase configurado somente para consulta de CPF."
    );

    console.log(
        "✅ Pagamento será realizado externamente pela Izy."
    );

});