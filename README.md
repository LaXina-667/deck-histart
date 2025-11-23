# Deck Interativo de História da Arte

## 📄 Resumo do Projeto (Project Summary)

-   **Nome do Projeto:** Deck Interativo de História da Arte
-   **Domínio:** História da Arte, Educação, Desenvolvimento Front-end, Visualização de Dados.
-   **Funcionalidade Principal:** Renderização de cards interativos sobre arte a partir de dados estruturados, com funcionalidades de busca, ordenação e navegação de influências.
-   **Público-Alvo:** Professores de arte, estudantes de arte, entusiastas, historiadores e desenvolvedores front-end.
-   **Status:** Versão 1.0 (Otimizado para Desktop).

Um deck interativo sobre História da Arte, apresentando movimentos, artistas e obras em cards dinâmicos. O projeto, construído com HTML, CSS e JavaScript puro, oferece funcionalidades de busca, ordenação e páginas dedicadas para explorar as influências entre os movimentos. Perfeito para estudantes e entusiastas da arte.

> **Nota:** Esta é a versão 1.0 do projeto, otimizada para visualização em computadores (desktop). A adaptação completa para dispositivos móveis (responsividade mobile) ainda está em desenvolvimento.

## ✨ Funcionalidades Implementadas

-   **Visualização em Cards:** Explora movimentos, períodos e gêneros artísticos em cards informativos.
-   **Busca Dinâmica:** Filtra cards em tempo real com base na entrada do usuário.
-   **Ordenação Alfabética:** Organiza o conteúdo em ordem crescente (A → Z).
-   **Paginação:** Sistema de navegação entre páginas para organizar o conteúdo.
-   **Navegação de Influências:** Páginas dedicadas que mostram as conexões (influenciou/foi influenciado por) entre diferentes cards.
-   **Design Responsivo (Desktop-first):** A interface se adapta a diferentes larguras de tela, com foco na experiência em desktop.

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído com tecnologias web fundamentais, sem o uso de frameworks ou bibliotecas externas, focando em performance e simplicidade.

| Categoria       | Tecnologia           | Descrição                                                              |
| :-------------- | :------------------- | :--------------------------------------------------------------------- |
| **Estrutura**   | HTML5                | Utilizado para a marcação semântica de todo o conteúdo.                |
| **Estilização** | CSS3                 | Flexbox, Grid, Variáveis e Media Queries para um layout moderno.       |
| **Lógica**      | JavaScript (Vanilla) | Manipulação do DOM, busca, ordenação e renderização de dados.          |
| **Dados**       | JSON                 | Armazenamento estruturado dos dados dos cards, consumido via `fetch()`. |

## ⚙️ Como Executar Localmente

Por ser um projeto de front-end puro, não há necessidade de um processo de build ou dependências.

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/seu-usuario/nome-do-repositorio.git
    ```

2.  **Navegue até a pasta do projeto:**
    ```bash
    cd nome-do-repositorio
    ```

3.  **Abra o arquivo `index.html`:**
    Abra o arquivo `index.html` diretamente no seu navegador de preferência. Para uma melhor experiência, recomenda-se o uso de um servidor local (como a extensão "Live Server" do VS Code) para evitar possíveis problemas com requisições de arquivos locais (CORS).

## 🔮 Desenvolvimentos Futuros (Roadmap)

O roadmap do projeto inclui a criação de novas formas de visualização de dados para enriquecer a experiência de aprendizado.

#### 1. Feature: Linha do Tempo (Infográfico)
-   **Objetivo:** Criar uma subpágina (`/timeline.html`) que funcione como um infográfico interativo.
-   **Visualização:** Os cards serão organizados cronologicamente em uma árvore visual. A estrutura destacará as conexões diretas, mostrando como cada movimento, tendência, período e gênero artístico influenciou a evolução dos outros ao longo da história.
-   **Tecnologia:** HTML, CSS e JavaScript para renderizar a árvore de forma dinâmica a partir do `data.json`.

#### 2. Feature: Mapa da Arte
-   **Objetivo:** Desenvolver uma seção interativa chamada **"Mapa da Arte"** (`/map.html`).
-   **Visualização:** Apresentará um mapa-múndi onde os cards serão posicionados geograficamente de acordo com sua origem. Uma linha do tempo integrada permitirá ao usuário visualizar onde cada movimento surgiu e para quais outras regiões ele se expandiu.
-   **Tecnologia:** JavaScript, possivelmente integrado a uma biblioteca de mapas como Leaflet.js, para criar a interatividade.

