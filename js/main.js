document.addEventListener('DOMContentLoaded', () => {
    
    // =========================================================================
    // 1. ANIMAÇÃO DE SURGIMENTO (FADE-IN)
    // =========================================================================
    function initFadeIn() {
        const fadeElements = document.querySelectorAll('.fade-in');
        if (!fadeElements.length) return;

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });

            fadeElements.forEach(el => observer.observe(el));
        } else {
            // Fallback para navegadores sem suporte ao IntersectionObserver
            fadeElements.forEach(el => el.classList.add('visible'));
        }
    }

    // =========================================================================
    // 2. MENU MOBILE TOGGLE
    // =========================================================================
    function initMobileMenu() {
        const menuToggle = document.querySelector('.menu-toggle');
        const navLinks = document.querySelector('.nav-links');

        if (menuToggle && navLinks) {
            menuToggle.addEventListener('click', () => {
                navLinks.classList.toggle('active');
            });

            document.querySelectorAll('.nav-links a').forEach(link => {
                link.addEventListener('click', () => {
                    navLinks.classList.remove('active');
                });
            });
        }
    }

    // =========================================================================
    // 3. HEADER SCROLL (MUDAR ESTILO AO ROLAR)
    // =========================================================================
    function initHeaderScroll() {
        const header = document.getElementById('header');
        if (!header) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // =========================================================================
    // 4. GALERIA (FILTROS + CARREGAR MAIS / VER MENOS + INTERCALAÇÃO)
    // =========================================================================
    function initGaleria() {
        const ITENS_POR_PAGINA = 4;
        let itensVisiveis = ITENS_POR_PAGINA;
        let filtroAtual = 'todos';

        const galeriaItems = Array.from(document.querySelectorAll('.galeria-item'));
        const filterBtns = document.querySelectorAll('.btn-filtro');
        const btnCarregarMais = document.getElementById('btn-carregar-mais');
        const btnVerMenos = document.getElementById('btn-ver-menos');

        if (!galeriaItems.length) return;

        // Agrupa e intercala 1 foto de cada categoria (ex: Eventos 1, Salão 1, Chalé 1, Lazer 1, Eventos 2...)
        function obterItensIntercalados() {
            const categorias = {};

            galeriaItems.forEach(item => {
                const cat = item.getAttribute('data-category');
                if (!categorias[cat]) categorias[cat] = [];
                categorias[cat].push(item);
            });

            const listaIntercalada = [];
            const chaves = Object.keys(categorias);
            let indice = 0;
            let temMais = true;

            while (temMais) {
                temMais = false;
                chaves.forEach(cat => {
                    if (categorias[cat][indice]) {
                        listaIntercalada.push(categorias[cat][indice]);
                        temMais = true;
                    }
                });
                indice++;
            }

            return listaIntercalada;
        }

        // Atualiza a exibição dos cards e dos botões de ação
        function atualizarGaleria() {
            let itensFiltrados = [];

            if (filtroAtual === 'todos') {
                itensFiltrados = obterItensIntercalados();
            } else {
                itensFiltrados = galeriaItems.filter(item => 
                    item.getAttribute('data-category') === filtroAtual
                );
            }

            // Oculta todos os itens e reseta a ordem
            galeriaItems.forEach(item => {
                item.style.display = 'none';
                item.style.order = '0';
            });

            // Exibe e ordena visualmente os itens permitidos no CSS Grid/Flexbox
            itensFiltrados.forEach((item, index) => {
                if (index < itensVisiveis) {
                    item.style.display = 'block';
                    item.style.order = index; // Ajusta a sequência visual na tela
                    item.classList.add('fade-in', 'visible');
                }
            });

            // Controle do botão "Carregar Mais"
            if (btnCarregarMais) {
                btnCarregarMais.style.display = (itensVisiveis >= itensFiltrados.length) ? 'none' : 'inline-block';
            }

            // Controle do botão "Ver Menos"
            if (btnVerMenos) {
                btnVerMenos.style.display = (itensVisiveis > ITENS_POR_PAGINA) ? 'inline-block' : 'none';
            }
        }

        // Filtros por Categoria
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                filtroAtual = btn.getAttribute('data-filter');
                itensVisiveis = ITENS_POR_PAGINA; // Reseta para 4 fotos
                atualizarGaleria();
            });
        });

        // Botão Carregar Mais (+4 itens)
        if (btnCarregarMais) {
            btnCarregarMais.addEventListener('click', () => {
                itensVisiveis += ITENS_POR_PAGINA;
                atualizarGaleria();
            });
        }

        // Botão Ver Menos (Reseta para as 4 primeiras)
        if (btnVerMenos) {
            btnVerMenos.addEventListener('click', () => {
                itensVisiveis = ITENS_POR_PAGINA;
                atualizarGaleria();

                const galeriaSection = document.getElementById('galeria');
                if (galeriaSection) {
                    galeriaSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }

        // Inicialização
        atualizarGaleria();
    }

    // =========================================================================
    // 5. MODAL / LIGHTBOX DA GALERIA
    // =========================================================================
    function initModalGaleria() {
        const modal = document.getElementById('galeria-modal');
        const modalImg = document.getElementById('img-ampliada');
        const modalCaption = document.getElementById('modal-caption');
        const modalClose = document.querySelector('.modal-close');
        const galleryItems = document.querySelectorAll('.galeria-item');

        if (!modal || !modalImg) return;

        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                const img = item.querySelector('img');
                const captionSpan = item.querySelector('.galeria-overlay span');

                if (img) {
                    modalImg.src = img.src;
                    modalCaption.textContent = captionSpan ? captionSpan.textContent : img.alt;
                    modal.classList.add('active');
                }
            });
        });

        if (modalClose) {
            modalClose.addEventListener('click', () => {
                modal.classList.remove('active');
            });
        }

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }

    // =========================================================================
    // 6. ENVIO DO FORMULÁRIO DE AGENDAMENTO (WHATSAPP)
    // =========================================================================
    function initFormWhatsApp() {
        const form = document.getElementById('form-agendamento');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const nome = document.getElementById('nome')?.value.trim() || '';
            const telefone = document.getElementById('telefone')?.value.trim() || '';
            const dataEvento = document.getElementById('data-evento')?.value || 'Não informada';
            const convidados = document.getElementById('convidados')?.value || 'Não informado';
            const tipoEvento = document.getElementById('tipo-evento')?.value || '';
            const mensagem = document.getElementById('mensagem')?.value.trim() || 'Nenhuma';

            // Formatação de data (AAAA-MM-DD -> DD/MM/AAAA)
            let dataFormatada = dataEvento;
            if (dataEvento !== 'Não informada' && dataEvento.includes('-')) {
                const [ano, mes, dia] = dataEvento.split('-');
                dataFormatada = `${dia}/${mes}/${ano}`;
            }

            const textoWhatsApp = 
                `*Novo Agendamento/Orçamento - Casa Vert*\n\n` +
                `*Nome:* ${nome}\n` +
                `*Telefone:* ${telefone}\n` +
                `*Tipo de Evento:* ${tipoEvento}\n` +
                `*Data Prevista:* ${dataFormatada}\n` +
                `*Nº Estimado de Convidados:* ${convidados}\n` +
                `*Mensagem:* ${mensagem}`;

            const numeroWhatsApp = '5527992434580';
            const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(textoWhatsApp)}`;

            window.open(url, '_blank');
        });
    }

    // =========================================================================
    // INICIALIZAÇÃO DOS MÓDULOS
    // =========================================================================
    initFadeIn();
    initMobileMenu();
    initHeaderScroll();
    initGaleria();
    initModalGaleria();
    initFormWhatsApp();

});

const avaliacoes = [
    { nome: "Mariana Souza", tipo: "Festa de 15 Anos", texto: "Realizamos a festa de 15 anos da minha filha na Casa Vert e foi simplesmente impecável!", estrelas: 5 },
    { nome: "Carlos Eduardo", tipo: "Hospedagem", texto: "Lugar incrível para passar o fim de semana com a família. Muito conforto e privacidade.", estrelas: 5 },
    { nome: "Fernanda & Rafael", tipo: "Casamento", texto: "Nosso casamento ao ar livre foi um sonho! Fotos espetaculares no jardim e no lago.", estrelas: 5 },
    { nome: "Beatriz Lima", tipo: "Evento Corporativo", texto: "Espaço excelente para nossa confraternização. Estrutura impecável e fácil acesso.", estrelas: 5 },
    { nome: "Lucas Mendes", tipo: "Aniversário", texto: "Atendimento maravilhoso do início ao fim. O espaço é ainda mais bonito pessoalmente.", estrelas: 5 },
    { nome: "Camila Rocha", tipo: "Casamento", texto: "Lugar mágico! Nossos convidados elogiaram muito toda a estrutura da casa.", estrelas: 5 },
    { nome: "Rodrigo Alves", tipo: "Hospedagem", texto: "Lugar reservado e acolhedor. Perfeito para relaxar com a família no fim de semana.", estrelas: 5 },
    { nome: "Patricia Costa", tipo: "Festa Infantil", texto: "Amamos a experiência. A área externa com gramado foi perfeita para as crianças.", estrelas: 5 },
    { nome: "Gabriel & Vanessa", tipo: "Bodas de Prata", texto: "Celebração inesquecível! A iluminação noturna no jardim dá um charme especial.", estrelas: 5 },
    { nome: "Juliana Martins", tipo: "Ensaio Fotográfico", texto: "Cenários lindos para fotos. O ambiente transmite muita paz e beleza natural.", estrelas: 5 }
];

function inicializarCarrossel() {
    const wrapper = document.getElementById('avaliacoes-wrapper');
    if (!wrapper) return;

    // Renderiza as 10 avaliações
    wrapper.innerHTML = avaliacoes.map(item => `
        <div class="swiper-slide">
            <div class="avaliacao-card">
                <div class="stars">
                    ${'<i class="fa-solid fa-star"></i>'.repeat(item.estrelas)}
                </div>
                <p class="depoimento-texto">"${item.texto}"</p>
                <div class="cliente-info">
                    <strong>${item.nome}</strong>
                    <span>${item.tipo}</span>
                </div>
            </div>
        </div>
    `).join('');

    // Configura o Swiper
    new Swiper('.avaliacoes-slider', {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 }
        }
    });
}

document.addEventListener('DOMContentLoaded', inicializarCarrossel);

// Controle do Banner de Cookies (LGPD)
function gerenciarCookies() {
    const banner = document.getElementById('cookie-banner');
    const btnAceitar = document.getElementById('aceitar-cookies');

    if (!banner || !btnAceitar) return;

    // Verifica se o usuário já aceitou os cookies anteriormente
    const cookiesAceitos = localStorage.getItem('casavert_cookies_aceitos');

    if (!cookiesAceitos) {
        // Exibe o banner após 1.5 segundos da entrada no site
        setTimeout(() => {
            banner.style.display = 'block';
        }, 1500);
    }

    // Ao clicar em "Aceitar todos"
    btnAceitar.addEventListener('click', () => {
        localStorage.setItem('casavert_cookies_aceitos', 'true');
        banner.style.opacity = '0';
        banner.style.transition = 'opacity 0.4s ease';
        setTimeout(() => {
            banner.style.display = 'none';
        }, 400);
    });
}

document.addEventListener('DOMContentLoaded', gerenciarCookies);