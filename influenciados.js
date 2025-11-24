document.addEventListener('DOMContentLoaded', async () => {
    const caixaInfluenciador = document.getElementById('influenciador');
    const caixaInfluenciados = document.getElementById('influenciados');

    const params = new URLSearchParams(window.location.search);
    const movimentoId = params.get('id');

    if (!movimentoId) {
        caixaInfluenciador.innerHTML = '<p>ID do movimento não fornecido.</p>';
        return;
    }

    try {
        const response = await fetch('data.json');
        const todosMovimentos = await response.json();

        // Encontra o movimento principal (o que foi clicado)
        const movimentoPrincipal = todosMovimentos.find(m => m.id === movimentoId);

        if (!movimentoPrincipal) {
            caixaInfluenciador.innerHTML = '<p>Movimento não encontrado.</p>';
            return;
        }

        // Atualiza o título da página
        document.title = `Influenciados por ${movimentoPrincipal.nome}`;

        // Cria e adiciona o card do movimento principal na caixa da esquerda
        caixaInfluenciador.innerHTML = criarCardCompleto(movimentoPrincipal);

        // CORREÇÃO: Encontra os movimentos que o movimentoPrincipal influenciou.
        // 1. Pega a lista de nomes do campo 'influenciou' do movimento principal.
        const nomesInfluenciados = movimentoPrincipal.influenciou.map(inf => inf.nome);

        // 2. Filtra a lista completa de movimentos para encontrar os objetos correspondentes a esses nomes.
        const movimentosInfluenciados = todosMovimentos.filter(m => nomesInfluenciados.includes(m.nome));

        // Cria e adiciona os cards dos influenciados na caixa da direita
        if (movimentosInfluenciados.length > 0) {
            caixaInfluenciados.innerHTML = movimentosInfluenciados.map(criarCardCompleto).join('');
        } else {
            caixaInfluenciados.innerHTML = '<p>Nenhum movimento influenciado encontrado neste acervo.</p>';
        }

        // Adiciona os listeners para permitir a expansão dos cards
        adicionarListenersDeExpansao();

    } catch (error) {
        console.error('Erro ao carregar ou processar dados:', error);
        caixaInfluenciador.innerHTML = '<p>Ocorreu um erro ao carregar as informações.</p>';
    }
});

// Adiciona um listener de clique no corpo do documento para capturar cliques nos botões de navegação.
// Isso usa a delegação de eventos para funcionar com cards adicionados dinamicamente.
document.body.addEventListener('click', (e) => {
    const btn = e.target.closest('.info-btn');
    if (btn && btn.dataset && btn.dataset.href) {
        window.location.href = btn.dataset.href;
    }
});

/**
 * Adiciona o evento de clique a todos os cards da página para expandir/recolher.
 */
function adicionarListenersDeExpansao() {
    const cards = document.querySelectorAll('article.card');
    cards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Impede que o card expanda se o clique for num link ou botão
            if (e.target.tagName === 'A' || e.target.closest('button')) {
                return;
            }
            card.classList.toggle('expandido');
        });
    });
}

/**
 * Cria a estrutura HTML completa de um card.
 * Reutiliza as classes do style.css para manter a consistência.
 */
function criarCardCompleto(movimento) {
    if (!movimento) return '';

    const tipoClasse = movimento.tipo === 'movimento' ? ' tipo-movimento'
        : movimento.tipo === 'período' ? ' tipo-periodo'
        : movimento.tipo === 'escola' ? ' tipo-escola'
        : (movimento.tipo === 'gênero' || movimento.tipo === 'genero') ? ' tipo-genero'
        : (movimento.tipo === 'tendência' || movimento.tipo === 'tendencia') ? ' tipo-tendencia'
        : '';

    const iconHTML = movimento.tipo === 'movimento' ? `<img class="card-icon" src="img/MOV.png" alt="Ícone movimento">`
        : movimento.tipo === 'período' ? `<img class="card-icon" src="img/PER.png" alt="Ícone período">`
        : movimento.tipo === 'escola' ? `<img class="card-icon" src="img/ESC.png" alt="Ícone escola">`
        : (movimento.tipo === 'gênero' || movimento.tipo === 'genero') ? `<img class="card-icon" src="img/GEN.png" alt="Ícone gênero">`
        : (movimento.tipo === 'tendência' || movimento.tipo === 'tendencia') ? `<img class="card-icon" src="img/TEN.png" alt="Ícone tendência">`
        : '';

    // Mapeia o tipo para um rótulo legível
    const tipoTexto = movimento.tipo === 'movimento' ? 'Movimento artístico'
        : movimento.tipo === 'período' ? 'Período artístico'
        : (movimento.tipo === 'gênero' || movimento.tipo === 'genero') ? 'Gênero artístico'
        : (movimento.tipo === 'tendência' || movimento.tipo === 'tendencia') ? 'Tendência artística'
        : movimento.tipo || '';

    // Funções auxiliares para criar listas
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
        const linksArr = itens.map(item => {
            if (!item) return '';
            if (typeof item === 'string') return item;
            if (item.link) return `<a href="${item.link}" target="_blank">${item.nome}</a>`;
            return item.nome;
        }).filter(Boolean);
        const linksHTML = linksArr.join(', ');
        return `<div class="info-section">${tituloHTML}<p class="inline-links">${linksHTML}</p></div>`;
    };

    const criarListaDeObras = (titulo, obras) => {
        if (!obras || obras.length === 0) return '';
        const obrasHTML = obras.map(obra => {
            const linkTitulo = obra.link ? `<a href="${obra.link}" target="_blank">${obra.titulo}</a>` : obra.titulo;
            const artistaNome = obra.artista || '';
            const artistaHref = artistaNome ? `https://pt.wikipedia.org/w/index.php?search=${encodeURIComponent(artistaNome)}` : '';
            const artistaHTML = artistaNome ? `<a href="${artistaHref}" target="_blank">${artistaNome}</a>` : '';
            return `<li>${linkTitulo} <span>(${obra.ano}) — ${artistaHTML}</span></li>`;
        }).join('');
        return `<div class="info-section"><p><strong>${titulo}:</strong></p><ul>${obrasHTML}</ul></div>`;
    };

    return `
        <article class="card${tipoClasse}">
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
                    ${criarListaDeObras('Obras', movimento.artistas_e_obras.obras)}
                </div>
            </div>
        </article>
    `;
}