document.addEventListener("DOMContentLoaded", function () {

    console.log("Run & Samba - script.js carregado");


    /* =========================================================
       MENU MOBILE
    ========================================================= */

    const menuButton = document.getElementById("menuMobile");
    const mobileMenu = document.getElementById("mobileMenu");
    const menuOverlay = document.getElementById("mobileMenuOverlay");
    const menuClose = document.getElementById("mobileMenuClose");


    function abrirMenu() {

        if (!menuButton || !mobileMenu || !menuOverlay) {
            console.warn("Elementos do menu mobile não encontrados.");
            return;
        }

        mobileMenu.classList.add("ativo");
        menuOverlay.classList.add("ativo");
        menuButton.classList.add("ativo");

        mobileMenu.setAttribute("aria-hidden", "false");
        menuOverlay.setAttribute("aria-hidden", "false");
        menuButton.setAttribute("aria-expanded", "true");
        menuButton.setAttribute("aria-label", "Fechar menu");

        document.body.classList.add("menu-mobile-aberto");
    }


    function fecharMenu() {

        if (!menuButton || !mobileMenu || !menuOverlay) {
            return;
        }

        mobileMenu.classList.remove("ativo");
        menuOverlay.classList.remove("ativo");
        menuButton.classList.remove("ativo");

        mobileMenu.setAttribute("aria-hidden", "true");
        menuOverlay.setAttribute("aria-hidden", "true");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Abrir menu");

        document.body.classList.remove("menu-mobile-aberto");
    }


    /* =========================================================
       ABRIR / FECHAR PELO BOTÃO
    ========================================================= */

    if (menuButton) {

        menuButton.addEventListener("click", function (event) {

            event.preventDefault();
            event.stopPropagation();

            if (
                mobileMenu &&
                mobileMenu.classList.contains("ativo")
            ) {
                fecharMenu();
            } else {
                abrirMenu();
            }

        });

    }


    /* =========================================================
       BOTÃO FECHAR
    ========================================================= */

    if (menuClose) {

        menuClose.addEventListener("click", function (event) {

            event.preventDefault();

            fecharMenu();

        });

    }


    /* =========================================================
       OVERLAY
    ========================================================= */

    if (menuOverlay) {

        menuOverlay.addEventListener("click", function () {

            fecharMenu();

        });

    }


    /* =========================================================
       FECHAR AO CLICAR NOS LINKS DO MENU MOBILE
    ========================================================= */

    document
        .querySelectorAll(".mobile-menu-nav a, .mobile-menu-cta")
        .forEach(function (link) {

            link.addEventListener("click", function () {

                fecharMenu();

            });

        });


    /* =========================================================
       FECHAR COM ESC
    ========================================================= */

    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape") {

            fecharMenu();

        }

    });


    /* =========================================================
       PÁGINA ATUAL
    ========================================================= */

    const paginaAtual =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase();


    document
        .querySelectorAll(".menu a, .mobile-menu-nav a")
        .forEach(function (link) {

            const href = link.getAttribute("href");

            if (!href) {
                return;
            }

            const paginaLink =
                href
                    .split("/")
                    .pop()
                    .toLowerCase();

            if (
                paginaAtual === paginaLink ||
                (
                    paginaAtual === "" &&
                    paginaLink === "index.html"
                )
            ) {

                link.classList.add("active");

            }

        });


    /* =========================================================
       GALERIA AUTOMÁTICA
    ========================================================= */

    const galeria =
        document.querySelector(".stories-track");


    if (galeria) {

        let velocidade = 0.5;
        let pausado = false;


        function animarGaleria() {

            if (!pausado) {

                galeria.scrollLeft += velocidade;


                if (
                    galeria.scrollLeft >=
                    galeria.scrollWidth -
                    galeria.clientWidth -
                    2
                ) {

                    galeria.scrollLeft = 0;

                }

            }

            requestAnimationFrame(animarGaleria);

        }


        /* Pausa com mouse */

        galeria.addEventListener(
            "mouseenter",
            function () {

                pausado = true;

            }
        );


        galeria.addEventListener(
            "mouseleave",
            function () {

                pausado = false;

            }
        );


        /* Pausa durante toque */

        galeria.addEventListener(
            "touchstart",
            function () {

                pausado = true;

            },
            { passive: true }
        );


        galeria.addEventListener(
            "touchend",
            function () {

                pausado = false;

            },
            { passive: true }
        );


        animarGaleria();

    }

});
