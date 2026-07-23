/* =========================================================
   CLÍNICA SORRISO
   SCRIPT.JS
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    console.log("🚀 Clínica Sorriso iniciada");


    /* =====================================================
       ELEMENTOS
    ===================================================== */

    const header = document.querySelector(".header");

    const menuToggle =
        document.querySelector(".menu-toggle");

    const nav =
        document.querySelector(".nav");

    const navLinks =
        document.querySelectorAll(".nav a");

    const appointmentForm =
        document.querySelector(".appointment-form");

    const formMessage =
        document.querySelector(".form-message");

    const phoneInput =
        document.querySelector("#phone");


    /* =====================================================
       MENU MOBILE
    ===================================================== */

    if (menuToggle && nav) {

        menuToggle.addEventListener("click", () => {

            menuToggle.classList.toggle("active");

            nav.classList.toggle("active");

            document.body.classList.toggle("menu-open");

        });

    }


    /* =====================================================
       FECHAR MENU AO CLICAR NOS LINKS
    ===================================================== */

    navLinks.forEach(link => {

        link.addEventListener("click", () => {

            if (menuToggle && nav) {

                menuToggle.classList.remove("active");

                nav.classList.remove("active");

                document.body.classList.remove("menu-open");

            }

        });

    });


    /* =====================================================
       HEADER AO ROLAR
    ===================================================== */

    function handleHeaderScroll() {

        if (!header) {
            return;
        }

        if (window.scrollY > 50) {

            header.classList.add("scrolled");

        } else {

            header.classList.remove("scrolled");

        }

    }

    window.addEventListener(
        "scroll",
        handleHeaderScroll
    );

    handleHeaderScroll();


    /* =====================================================
       MÁSCARA DE WHATSAPP
    ===================================================== */

    if (phoneInput) {

        phoneInput.addEventListener("input", (event) => {

            let value =
                event.target.value.replace(/\D/g, "");


            if (value.length > 11) {

                value =
                    value.substring(0, 11);

            }


            if (value.length <= 10) {

                value =
                    value.replace(
                        /^(\d{2})(\d)/,
                        "($1) $2"
                    );

                value =
                    value.replace(
                        /(\d{4})(\d)/,
                        "$1-$2"
                    );

            } else {

                value =
                    value.replace(
                        /^(\d{2})(\d)/,
                        "($1) $2"
                    );

                value =
                    value.replace(
                        /(\d{5})(\d)/,
                        "$1-$2"
                    );

            }


            event.target.value = value;

        });

    }


    /* =====================================================
       FORMULÁRIO DE AGENDAMENTO
    ===================================================== */

    if (appointmentForm) {

        appointmentForm.addEventListener(
            "submit",
            async (event) => {

                event.preventDefault();


                /* =========================================
                   PEGAR O FORMULÁRIO COMPLETO
                ========================================= */

                const formData =
                    new FormData(
                        appointmentForm
                    );


                /* =========================================
                   PEGAR VALORES
                   
                   Aqui usamos os NAME dos campos.
                   Isso evita o problema de IDs diferentes.
                ========================================= */

                const name =
                    (
                        formData.get("name") ||
                        ""
                    ).trim();


                const email =
                    (
                        formData.get("email") ||
                        ""
                    ).trim();


                const phone =
                    (
                        formData.get("phone") ||
                        ""
                    ).trim();


                const treatment =
                    (
                        formData.get("treatment") ||
                        ""
                    ).trim();


                const date =
                    (
                        formData.get("date") ||
                        ""
                    ).trim();


                console.log(
                    "Dados do formulário:",
                    {
                        name,
                        email,
                        phone,
                        treatment,
                        date
                    }
                );


                /* =========================================
                   VALIDAÇÃO
                ========================================= */

                if (
                    !name ||
                    !email ||
                    !phone ||
                    !treatment ||
                    !date
                ) {

                    showFormMessage(
                        "Por favor, preencha todos os campos.",
                        "error"
                    );

                    return;

                }


                /* =========================================
                   VALIDAR EMAIL
                ========================================= */

                const emailRegex =
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


                if (
                    !emailRegex.test(email)
                ) {

                    showFormMessage(
                        "Digite um e-mail válido.",
                        "error"
                    );

                    return;

                }


                /* =========================================
                   BOTÃO DE ENVIO
                ========================================= */

                const submitButton =
                    appointmentForm.querySelector(
                        "button[type='submit']"
                    );


                const originalText =
                    submitButton
                        ? submitButton.innerHTML
                        : "";


                if (submitButton) {

                    submitButton.disabled = true;

                    submitButton.innerHTML =
                        "Enviando solicitação...";

                }


                /* =========================================
                   OBJETO DO AGENDAMENTO
                ========================================= */

                const appointmentData = {

                    name: name,

                    email: email,

                    phone: phone,

                    treatment: treatment,

                    date: date

                };


                try {

                    /* =====================================
                       ENVIAR PARA O BACKEND
                    ===================================== */

                    const response =
                        await fetch(
                            "http://localhost:3001/api/agendamento",
                            {

                                method: "POST",

                                headers: {

                                    "Content-Type":
                                        "application/json"

                                },

                                body:
                                    JSON.stringify(
                                        appointmentData
                                    )

                            }
                        );


                    const data =
                        await response.json();


                    /* =====================================
                       SUCESSO
                    ===================================== */

                    if (
                        response.ok &&
                        data.success
                    ) {

                        showFormMessage(
                            "Solicitação enviada com sucesso! Nossa equipe entrará em contato para confirmar seu horário.",
                            "success"
                        );


                        appointmentForm.reset();


                    } else {

                        showFormMessage(
                            data.message ||
                            "Não foi possível enviar sua solicitação.",
                            "error"
                        );

                    }


                } catch (error) {

                    console.error(
                        "Erro ao enviar agendamento:",
                        error
                    );


                    showFormMessage(
                        "Não foi possível conectar ao servidor. Verifique se o backend está funcionando.",
                        "error"
                    );


                } finally {

                    if (submitButton) {

                        submitButton.disabled = false;

                        submitButton.innerHTML =
                            originalText;

                    }

                }

            }
        );

    }


    /* =====================================================
       MENSAGEM DO FORMULÁRIO
    ===================================================== */

    function showFormMessage(
        message,
        type
    ) {

        if (!formMessage) {
            return;
        }


        formMessage.textContent =
            message;


        formMessage.className =
            "form-message";


        formMessage.classList.add(
            type
        );


        formMessage.scrollIntoView({

            behavior: "smooth",

            block: "nearest"

        });


        setTimeout(() => {

            formMessage.textContent =
                "";

            formMessage.className =
                "form-message";

        }, 7000);

    }


    /* =====================================================
       ANIMAÇÃO AO ENTRAR NA TELA
    ===================================================== */

    const animatedElements =
        document.querySelectorAll(
            ".benefit-card, " +
            ".treatment-card, " +
            ".about-image, " +
            ".about-content, " +
            ".appointment-info, " +
            ".appointment-form, " +
            ".team-card, " +
            ".testimonial-card"
        );


    if (
        "IntersectionObserver" in window
    ) {

        const observer =
            new IntersectionObserver(
                (
                    entries,
                    observer
                ) => {

                    entries.forEach(entry => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.classList.add(
                                "visible"
                            );

                            observer.unobserve(
                                entry.target
                            );

                        }

                    });

                },
                {

                    threshold: 0.12

                }
            );


        animatedElements.forEach(
            element => {

                element.classList.add(
                    "animate-on-scroll"
                );

                observer.observe(
                    element
                );

            }
        );

    }


    /* =====================================================
       ANO AUTOMÁTICO
    ===================================================== */

    const currentYear =
        document.querySelector(
            "#current-year"
        );


    if (currentYear) {

        currentYear.textContent =
            new Date().getFullYear();

    }


    /* =====================================================
       IMPEDIR DATA PASSADA
    ===================================================== */

    const dateInput =
        document.querySelector(
            "#date"
        );


    if (dateInput) {

        const today =
            new Date();


        const year =
            today.getFullYear();


        const month =
            String(
                today.getMonth() + 1
            ).padStart(
                2,
                "0"
            );


        const day =
            String(
                today.getDate()
            ).padStart(
                2,
                "0"
            );


        dateInput.min =
            `${year}-${month}-${day}`;

    }


});
