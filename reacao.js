document.addEventListener('DOMContentLoaded', async () => {
    const caixaReagente = document.getElementById('reagente');
    const caixaReacoes = document.getElementById('reacoes');

    const params = new URLSearchParams(window.location.search);
    const movimentoId = params.get('id');

    if (!movimentoId) {
        caixaReagente.innerHTML = '<p>ID do movimento não fornecido.</p>';
        return;
    }

    try {
        const response = await fetch('data.json');
        const todosMovimentos = await response.json();

        // Encontra o movimento principal (o que foi clicado)
        const movimentoPrincipal = todosMovimentos.find(m => m.id === movimentoId);

        if (!movimentoPrincipal) {
            caixaReagente.innerHTML = '<p>Movimento não encontrado.</p>';
            return;
        }

        // Atualiza o título da página
        document.title = `Reação a ${movimentoPrincipal.nome}`;

        // Cria e adiciona o card do movimento principal na caixa da esquerda
        caixaReagente.innerHTML = criarCardSimples(movimentoPrincipal);

        // Encontra os movimentos aos quais o movimentoPrincipal foi reação/oposição
        const nomesReacoes = (movimentoPrincipal.reação || []).map(r => r.nome);
        const movimentosReagidos = todosMovimentos.filter(m => nomesReacoes.includes(m.nome));

        // Cria e adiciona os cards dos movimentos relacionados na caixa da direita
        if (movimentosReagidos.length > 0) {
            caixaReacoes.innerHTML = movimentosReagidos.map(criarCardSimples).join('');
        } else {
            caixaReacoes.innerHTML = '<p>Nenhuma reação/oposição encontrada neste acervo.</p>';
        }

        // Atualiza o divisor entre as caixas: mostra a imagem de reação somente
        // se houver um ou mais cards na caixa da direita
        const divisor = document.querySelector('.influenciados-container .divisor');
        if (divisor) {
            if (movimentosReagidos.length > 0) {
                divisor.innerHTML = '<img src="img/reacao.png" alt="Reação" style="width:260px;max-width:100%;height:auto;display:block;margin:0 auto;">';
            } else {
                divisor.innerHTML = '';
            }
        }

    } catch (error) {
        console.error('Erro ao carregar ou processar dados:', error);
        caixaReagente.innerHTML = '<p>Ocorreu um erro ao carregar as informações.</p>';
    }
});

/**
 * Cria uma versão simplificada do card.
 * Reutiliza as classes do style.css para manter a consistência.
 */
function criarCardSimples(movimento) {
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
