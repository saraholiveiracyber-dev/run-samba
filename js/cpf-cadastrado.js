/* =========================================================
   RUN & SAMBA — CORREÇÃO CPF JÁ CADASTRADO
   Não altera o restante do sistema
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const cpf = document.getElementById("cpf");
    const form = document.getElementById("form-inscricao");

    if (!cpf || !form) {
        console.warn("Campo CPF ou formulário não encontrado.");
        return;
    }

    // ---------------------------------------------------------
    // SUPABASE
    // ---------------------------------------------------------

    const SUPABASE_URL =
        "https://tqezxxobxsipjjuyydvc.supabase.co";

    const SUPABASE_ANON_KEY =
        "sb_publishable_Yt-DyfGqRqfbPN6aPgLM5w_K2RIneDd";

    const { createClient } = supabase;

    const db = createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
    );


    // ---------------------------------------------------------
    // CRIA MENSAGEM ABAIXO DO CPF
    // ---------------------------------------------------------

    let mensagemCPF =
        document.getElementById("mensagem-cpf-cadastrado");

    if (!mensagemCPF) {

        mensagemCPF =
            document.createElement("div");

        mensagemCPF.id =
            "mensagem-cpf-cadastrado";

        mensagemCPF.style.display =
            "none";

        mensagemCPF.style.marginTop =
            "8px";

        mensagemCPF.style.fontSize =
            "14px";

        mensagemCPF.style.fontWeight =
            "600";

        mensagemCPF.style.color =
            "#d32f2f";

        cpf.parentNode.appendChild(
            mensagemCPF
        );
    }


    // ---------------------------------------------------------
    // LIMPAR CPF
    // ---------------------------------------------------------

    function limparCPF(valor) {

        return String(valor || "")
            .replace(/\D/g, "");

    }


    // ---------------------------------------------------------
    // VERIFICAR CPF
    // ---------------------------------------------------------

    async function verificarCPF() {

        const cpfLimpo =
            limparCPF(cpf.value);


        // Só consulta quando tiver 11 números

        if (cpfLimpo.length !== 11) {

            mensagemCPF.style.display =
                "none";

            return false;
        }


        try {

            console.log(
                "Verificando CPF:",
                cpfLimpo
            );


            const { data, error } =
                await db
                    .from("inscricoes")
                    .select("id")
                    .eq("cpf", cpfLimpo)
                    .limit(1);


            if (error) {

                console.error(
                    "Erro ao consultar CPF:",
                    error
                );

                return false;
            }


            // -------------------------------------------------
            // CPF ENCONTRADO
            // -------------------------------------------------

            if (data && data.length > 0) {

                mensagemCPF.textContent =
                    "⚠️ CPF já cadastrado! Já existe uma inscrição para este CPF.";

                mensagemCPF.style.display =
                    "block";

                cpf.style.borderColor =
                    "#d32f2f";

                return true;
            }


            // -------------------------------------------------
            // CPF NÃO ENCONTRADO
            // -------------------------------------------------

            mensagemCPF.textContent =
                "";

            mensagemCPF.style.display =
                "none";

            cpf.style.borderColor =
                "";

            return false;

        }

        catch (erro) {

            console.error(
                "Erro ao verificar CPF:",
                erro
            );

            return false;
        }

    }


    // ---------------------------------------------------------
    // VERIFICA AO SAIR DO CAMPO
    // ---------------------------------------------------------

    cpf.addEventListener(
        "blur",
        verificarCPF
    );


    // ---------------------------------------------------------
    // VERIFICA QUANDO TERMINAR DE DIGITAR
    // ---------------------------------------------------------

    cpf.addEventListener(
        "input",
        () => {

            const numero =
                limparCPF(cpf.value);


            if (numero.length === 11) {

                verificarCPF();

            } else {

                mensagemCPF.style.display =
                    "none";

                cpf.style.borderColor =
                    "";

            }

        }
    );


    // ---------------------------------------------------------
    // IMPEDE ENVIO SE CPF JÁ EXISTIR
    // ---------------------------------------------------------

    form.addEventListener(
        "submit",
        async (event) => {

            const numero =
                limparCPF(cpf.value);


            if (numero.length !== 11) {
                return;
            }


            const jaCadastrado =
                await verificarCPF();


            if (jaCadastrado) {

                event.preventDefault();

                event.stopImmediatePropagation();

                cpf.focus();

                console.warn(
                    "Envio bloqueado: CPF já cadastrado."
                );

            }

        },
        true
    );


    console.log(
        "Correção CPF cadastrado carregada."
    );

});