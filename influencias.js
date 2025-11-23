document.addEventListener('DOMContentLoaded', async () => {
    const caixaInfluenciadores = document.getElementById('influenciadores');
    const caixaInfluenciado = document.getElementById('influenciado');

    const params = new URLSearchParams(window.location.search);
    const movimentoId = params.get('id');

    if (!movimentoId) {
        caixaInfluenciadores.innerHTML = '<p>ID do movimento não fornecido.</p>';
        return;
    }

    try {
        const response = await fetch('data.json');
        const todosMovimentos = await response.json();

        // Encontra o movimento principal (o que foi clicado)
        const movimentoPrincipal = todosMovimentos.find(m => m.id === movimentoId);

        if (!movimentoPrincipal) {
            caixaInfluenciado.innerHTML = '<p>Movimento não encontrado.</p>';
            return;
        }

        // Atualiza o título da página
        document.title = `Influências de ${movimentoPrincipal.nome}`;

        // Cria e adiciona o card do movimento principal na caixa da direita
        caixaInfluenciado.innerHTML = criarCardSimples(movimentoPrincipal);

        // Encontra os movimentos que o influenciaram
        const nomesInfluenciadores = movimentoPrincipal.influencias.map(inf => inf.nome);
        const movimentosInfluenciadores = todosMovimentos.filter(m => nomesInfluenciadores.includes(m.nome));

        // Cria e adiciona os cards dos influenciadores na caixa da esquerda
        if (movimentosInfluenciadores.length > 0) {
            caixaInfluenciadores.innerHTML = movimentosInfluenciadores.map(criarCardSimples).join('');
        } else {
            caixaInfluenciadores.innerHTML = '<p>Nenhuma influência encontrada neste acervo.</p>';
        }

        // Atualiza o divisor entre as caixas com a imagem apropriada:
        // - nenhum card à esquerda: sem imagem
        // - 1 card à esquerda: 'influenciou.png'
        // - 2 ou mais: 'influenciaram.png'
        const divisor = document.querySelector('.influencias-container .divisor');
        if (divisor) {
            if (movimentosInfluenciadores.length === 0) {
                divisor.innerHTML = '';
            } else if (movimentosInfluenciadores.length === 1) {
                divisor.innerHTML = '<img src="img/influenciou.png" alt="Influenciou">';
            } else {
                divisor.innerHTML = '<img src="img/influenciaram.png" alt="Influenciaram">';
            }
        }

        // Aguarda um instante para o navegador renderizar e depois ajusta as alturas
        setTimeout(ajustarAlturas, 100);

    } catch (error) {
        console.error('Erro ao carregar ou processar dados:', error);
        caixaInfluenciadores.innerHTML = '<p>Ocorreu um erro ao carregar as informações.</p>';
    }
});

/**
 * Ajusta a altura dos cards na caixa da esquerda para ser igual à altura do card da direita.
 */
function ajustarAlturas() {
    const cardDireita = document.querySelector('#influenciado .card');
    if (!cardDireita) return;

    const alturaReferencia = cardDireita.offsetHeight;
    const cardsEsquerda = document.querySelectorAll('#influenciadores .card');

    cardsEsquerda.forEach(card => {
        // Define a altura do card
        card.style.height = `${alturaReferencia}px`;
    });
}

/**
 * Cria uma versão simplificada do card, sem a parte de detalhes colapsáveis.
 * Reutiliza as classes do style.css para manter a consistência.
 */
function criarCardSimples(movimento) {
    if (!movimento) return '';

    // determina a classe de tipo
    const tipoClasse = movimento.tipo === 'movimento' ? ' tipo-movimento'
        : movimento.tipo === 'período' ? ' tipo-periodo'
        : movimento.tipo === 'escola' ? ' tipo-escola'
        : (movimento.tipo === 'gênero' || movimento.tipo === 'genero') ? ' tipo-genero'
        : (movimento.tipo === 'tendência' || movimento.tipo === 'tendencia') ? ' tipo-tendencia'
        : '';

    // determina o ícone apropriado
    const iconHTML = movimento.tipo === 'movimento' ? `<img class="card-icon" src="img/MOV.png" alt="Ícone movimento">`
        : movimento.tipo === 'período' ? `<img class="card-icon" src="img/PER.png" alt="Ícone período">`
        : movimento.tipo === 'escola' ? `<img class="card-icon" src="img/ESC.png" alt="Ícone escola">`
        : (movimento.tipo === 'gênero' || movimento.tipo === 'genero') ? `<img class="card-icon" src="img/GEN.png" alt="Ícone gênero">`
        : (movimento.tipo === 'tendência' || movimento.tipo === 'tendencia') ? `<img class="card-icon" src="img/TEN.png" alt="Ícone tendência">`
        : '';

    return `
        <article class="card${tipoClasse}" style="max-height: none; transform: none; cursor: default;">
            ${iconHTML}
            <div class="card-content-wrapper">
                <div class="conteudo-visivel">
                    <h2><a href="${movimento.link_wiki}" target="_blank">${movimento.nome}</a></h2>
                    <img src="${movimento.imagem}" alt="Imagem representativa do ${movimento.nome}">
                    <p class="legenda">${movimento.legenda}</p>
                    <p><strong>Período:</strong> ${movimento.período}</p>
                    <p><strong>Origem:</strong> ${movimento.origem}</p>
                    <p><strong>Tipo:</strong> ${movimento.tipo}</p>
                </div>
            </div>
        </article>
    `;
}