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
        caixaInfluenciador.innerHTML = criarCardSimples(movimentoPrincipal);

        // CORREÇÃO: Encontra os movimentos que o movimentoPrincipal influenciou.
        // 1. Pega a lista de nomes do campo 'influenciou' do movimento principal.
        const nomesInfluenciados = movimentoPrincipal.influenciou.map(inf => inf.nome);

        // 2. Filtra a lista completa de movimentos para encontrar os objetos correspondentes a esses nomes.
        const movimentosInfluenciados = todosMovimentos.filter(m => nomesInfluenciados.includes(m.nome));

        // Cria e adiciona os cards dos influenciados na caixa da direita
        if (movimentosInfluenciados.length > 0) {
            caixaInfluenciados.innerHTML = movimentosInfluenciados.map(criarCardSimples).join('');
        } else {
            caixaInfluenciados.innerHTML = '<p>Nenhum movimento influenciado encontrado neste acervo.</p>';
        }

    } catch (error) {
        console.error('Erro ao carregar ou processar dados:', error);
        caixaInfluenciador.innerHTML = '<p>Ocorreu um erro ao carregar as informações.</p>';
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