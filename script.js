let cardcontainer = document.querySelector("main"); // Vamos injetar direto no <main>
let dados = [];
let currentRenderData = []; // guarda os dados atualmente renderizados (para resize)
let pageSize = 16; // número de cards por página
let currentPage = 1;
// estado para ordenação alfabética (toggle)
let _alphaSorted = false;
let _originalOrderSnapshot = null;

async function carregarDados() {
    try {
        let resposta = await fetch("data.json");
        if (!resposta.ok) {
            throw new Error(`Erro ao carregar o JSON: ${resposta.statusText}`);
        }
        dados = await resposta.json();
        renderizarCards(dados);
    } catch (error) {
        console.error("Falha na requisição:", error);
        cardcontainer.innerHTML = `<p style="color: red; text-align: center;">Não foi possível carregar os dados. Verifique o console para mais detalhes.</p>`;
    }
}

function renderizarCards(dadosParam) {
    // Guarda os dados atualmente renderizados (útil no resize)
    currentRenderData = dadosParam.slice();
    currentPage = 1; // reset para primeira página ao novo conjunto
    renderPage(currentPage);
}

function renderPage(page) {
    const totalPages = Math.max(1, Math.ceil((currentRenderData || []).length / pageSize));
    // garante página válida
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;
    currentPage = page;

    // dados desta página
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const pageItems = (currentRenderData || []).slice(start, end);

    // limpa main e cria o wrapper de colunas
    cardcontainer.innerHTML = "";
    const columnsCount = getColumnCount();
    const wrapper = document.createElement('div');
    wrapper.className = 'columns';
    const columns = [];
    for (let i = 0; i < columnsCount; i++) {
        const col = document.createElement('div');
        col.className = 'column';
        wrapper.appendChild(col);
        columns.push(col);
    }
    cardcontainer.appendChild(wrapper);

    // helpers para criação de listas
    const criarListaComLinks = (titulo, itens, movimentoId) => {
        if (!itens || itens.length === 0) return '';

        let tituloHTML = `<p><strong>${titulo}:</strong></p>`;
        if (titulo === 'Influências') {
            tituloHTML = `<p><strong><button type="button" class="info-btn" data-href="influencias.html?id=${movimentoId}">${titulo}:</button></strong></p>`;
        } else if (titulo === 'Influenciou') {
            tituloHTML = `<p><strong><button type="button" class="info-btn" data-href="influenciados.html?id=${movimentoId}">${titulo}:</button></strong></p>`;
        } else if (titulo === 'Reação a') {
            tituloHTML = `<p><strong><button type="button" class="info-btn" data-href="reacao.html?id=${movimentoId}">${titulo}:</button></strong></p>`;
        }

        // Produz links inline, separados por vírgula
        const linksArr = itens.map(item => {
            if (!item) return '';
            // item pode ser objeto {nome, link} ou string
            if (typeof item === 'string') return item;
            if (item.link) return `<a href="${item.link}" target="_blank">${item.nome}</a>`;
            return item.nome;
        }).filter(Boolean);

        const linksHTML = linksArr.join(', ');
        return `
            <div class="info-section">
                ${tituloHTML}
                <p class="inline-links">${linksHTML}</p>
            </div>
        `;
    };

    const criarListaDeObras = (titulo, obras) => {
        if (!obras || obras.length === 0) return '';
        const obrasHTML = obras.map(obra => {
            const linkTitulo = obra.link ? `<a href="${obra.link}" target="_blank">${obra.titulo}</a>` : obra.titulo;
            // tenta criar um link para o artista via busca na Wikipédia (fallback quando não há link direto)
            const artistaNome = obra.artista || '';
            const artistaHref = artistaNome ? `https://pt.wikipedia.org/w/index.php?search=${encodeURIComponent(artistaNome)}` : '';
            const artistaHTML = artistaNome ? `<a href="${artistaHref}" target="_blank">${artistaNome}</a>` : '';
            return `<li>${linkTitulo} <span>(${obra.ano}) — ${artistaHTML}</span></li>`;
        }).join('');
        return `
            <div class="info-section">
                <p><strong>${titulo}:</strong></p>
                <ul>${obrasHTML}</ul>
            </div>
        `;
    };

    // distribui cada card para a coluna de menor altura (masonry)
    for (let movimento of pageItems) {
        let article = document.createElement('article');
        article.classList.add('card');
        // Marca visual: adiciona classes específicas para movimento/período/escola/gênero/tendência
        if (movimento.tipo === 'movimento') {
            article.classList.add('tipo-movimento');
        } else if (movimento.tipo === 'período') {
            article.classList.add('tipo-periodo');
        } else if (movimento.tipo === 'escola') {
            article.classList.add('tipo-escola');
        } else if (movimento.tipo === 'gênero' || movimento.tipo === 'genero') {
            article.classList.add('tipo-genero');
        } else if (movimento.tipo === 'tendência' || movimento.tipo === 'tendencia') {
            article.classList.add('tipo-tendencia');
        }

        article.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') return;
            const isExpanded = article.classList.contains('expandido');
            if (isExpanded) {
                article.classList.remove('expandido');
                // limpa estilo inline se houver
                article.style.maxHeight = '';
            } else {
                article.classList.add('expandido');
            }
        });

        const iconHTML = movimento.tipo === 'movimento'
            ? `<img class="card-icon" src="img/MOV.png" alt="Ícone movimento">`
            : movimento.tipo === 'período'
                ? `<img class="card-icon" src="img/PER.png" alt="Ícone período">`
                : movimento.tipo === 'escola'
                    ? `<img class="card-icon" src="img/ESC.png" alt="Ícone escola">`
                    : movimento.tipo === 'gênero' || movimento.tipo === 'genero'
                        ? `<img class="card-icon" src="img/GEN.png" alt="Ícone gênero">`
                        : movimento.tipo === 'tendência' || movimento.tipo === 'tendencia'
                            ? `<img class="card-icon" src="img/TEN.png" alt="Ícone tendência">`
                            : '';

        // Mapeia o tipo para um rótulo legível
        const tipoTexto = movimento.tipo === 'movimento' ? 'Movimento artístico'
            : movimento.tipo === 'período' ? 'Período artístico'
            : (movimento.tipo === 'gênero' || movimento.tipo === 'genero') ? 'Gênero artístico'
            : (movimento.tipo === 'tendência' || movimento.tipo === 'tendencia') ? 'Tendência artística'
            : movimento.tipo || '';

        article.innerHTML = `
            ${iconHTML}
            <div class="card-content-wrapper">
                <div class="conteudo-visivel">
                    <h2><a href="${movimento.link_wiki}" target="_blank">${movimento.nome}</a></h2>
                    <img src="${movimento.imagem}" alt="Imagem representativa do ${movimento.nome}">
                    <p class="legenda">${movimento.legenda}</p>
                    <p><strong>Período:</strong> ${movimento.período}</p>
                    <p><strong>Origem:</strong> ${movimento.origem}</p>
                    <p><strong>Tipo:</strong> ${tipoTexto}</p>
                </div>
                <div class="detalhes-colapsaveis">
                    ${criarListaComLinks('Influências', movimento.influencias, movimento.id)}
                    ${criarListaComLinks('Reação a', movimento.reação, movimento.id)}
                    ${criarListaComLinks('Vertentes', movimento.vertentes, movimento.id)}
                    ${criarListaComLinks('Influenciou', movimento.influenciou, movimento.id)}
                    ${criarListaComLinks('Características', movimento.características, movimento.id)}
                    ${criarListaComLinks('Pintores', movimento.artistas_e_obras.pintores, movimento.id)}
                    ${criarListaComLinks('Escultores', movimento.artistas_e_obras.escultores, movimento.id)}
                    ${criarListaComLinks('Arquitetos', movimento.artistas_e_obras.arquitetos, movimento.id)}
                    ${criarListaComLinks('Músicos', movimento.artistas_e_obras.musicos, movimento.id)}
                    ${criarListaComLinks('Escritores', movimento.artistas_e_obras.escritores, movimento.id)}
                    ${criarListaComLinks('Joalheiros', movimento.artistas_e_obras.joalheiros, movimento.id)}
                    ${criarListaComLinks('Designers', movimento.artistas_e_obras.designers, movimento.id)}
                    ${criarListaComLinks('Cineastas', movimento.artistas_e_obras.cineastas, movimento.id)}
                    ${criarListaComLinks('Fotógrafos', movimento.artistas_e_obras.fotografos, movimento.id)}
                    ${criarListaComLinks('Artistas de Moda', movimento.artistas_e_obras.artistas_de_moda, movimento.id)}
                    ${criarListaComLinks('Organizações', movimento.artistas_e_obras.organizações, movimento.id)}
                    ${criarListaDeObras('Obras', movimento.artistas_e_obras.obras)}
                </div>
            </div>
        `;

        // escolher a coluna com menor altura
        let targetCol = columns.reduce((prev, curr) => prev.offsetHeight <= curr.offsetHeight ? prev : curr, columns[0]);
        targetCol.appendChild(article);
    }

    // renderiza controles de paginação
    renderPagination(totalPages, page);
}

// recalcula o número de colunas baseando-se na largura da janela
function getColumnCount() {
    const containerWidth = cardcontainer.offsetWidth;
    const cardWidth = 300; // A largura fixa do seu card
    const cardGap = 20; // O 'gap' entre as colunas (1.25rem ≈ 20px)

    // Calcula quantas colunas de (largura do card + gap) cabem no contêiner
    const columnCount = Math.floor(containerWidth / (cardWidth + cardGap));

    return Math.max(1, columnCount); // Garante que sempre haverá pelo menos 1 coluna
}

// re-render quando a janela for redimensionada (debounced) mantendo os resultados atuais
let _resizeTimer = null;
window.addEventListener('resize', () => {
    clearTimeout(_resizeTimer);
    _resizeTimer = setTimeout(() => {
        // redimensiona mantendo a página atual
        renderPage(currentPage || 1);
    }, 200);
});

function buscarCard() {
    let termoBusca = document.getElementById("busca").value.toLowerCase();
    let resultados = dados.filter(movimento => movimento.nome.toLowerCase().includes(termoBusca));
    renderizarCards(resultados);
}

// Carrega os dados iniciais quando a página é carregada
carregarDados();

// Adiciona o evento de 'input' ao campo de busca para filtrar em tempo real
document.getElementById("busca").addEventListener("input", buscarCard);

// Delegação de clique para os botões gerados dinamicamente dentro das info-sections
cardcontainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.info-btn');
    if (btn && btn.dataset && btn.dataset.href) {
        // navega para a URL definida no atributo data-href
        window.location.href = btn.dataset.href;
    }
});

// Ordenação alfabética: botão no cabeçalho
const btnAlfa = document.getElementById('botao-alfabetico');
if (btnAlfa) {
    btnAlfa.addEventListener('click', () => {
        if (!currentRenderData || currentRenderData.length === 0) return;
        if (!_alphaSorted) {
            // guarda a ordem atual para possível restauração
            _originalOrderSnapshot = currentRenderData.slice();
            currentRenderData.sort((a, b) => (a.nome || '').localeCompare(b.nome || '', 'pt', { sensitivity: 'base' }));
            _alphaSorted = true;
            btnAlfa.textContent = 'Original';
        } else {
            // restaura a ordem anterior
            if (_originalOrderSnapshot) currentRenderData = _originalOrderSnapshot.slice();
            _alphaSorted = false;
            btnAlfa.textContent = 'A→Z';
        }
        // volta para a primeira página com a nova ordem
        renderPage(1);
    });
}

/**
 * Renderiza controles de paginação abaixo do conteúdo.
 */
function renderPagination(totalPages, current) {
    // remove paginação antiga
    const existing = document.querySelector('.pagination');
    if (existing) existing.remove();

    const pag = document.createElement('div');
    pag.className = 'pagination';

    const addButton = (text, disabled, onClick, extraClass='') => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = extraClass;
        btn.textContent = text;
        if (disabled) btn.disabled = true;
        if (onClick) btn.addEventListener('click', onClick);
        return btn;
    };

    pag.appendChild(addButton('« Anterior', current === 1, () => renderPage(current - 1), 'prev-btn'));

    // simples janela de páginas
    const maxButtons = 9;
    let start = Math.max(1, current - Math.floor(maxButtons/2));
    let end = Math.min(totalPages, start + maxButtons - 1);
    if (end - start < maxButtons - 1) start = Math.max(1, end - maxButtons + 1);

    if (start > 1) {
        pag.appendChild(addButton('1', false, () => renderPage(1)));
        if (start > 2) pag.appendChild(document.createTextNode('…'));
    }

    for (let i = start; i <= end; i++) {
        const btn = addButton(i.toString(), false, () => renderPage(i));
        if (i === current) btn.classList.add('active');
        pag.appendChild(btn);
    }

    if (end < totalPages) {
        if (end < totalPages - 1) pag.appendChild(document.createTextNode('…'));
        pag.appendChild(addButton(totalPages.toString(), false, () => renderPage(totalPages)));
    }

    pag.appendChild(addButton('Próxima »', current === totalPages, () => renderPage(current + 1), 'next-btn'));

    cardcontainer.appendChild(pag);
}
