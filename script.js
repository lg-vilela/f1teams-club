document.addEventListener('DOMContentLoaded', () => {
    // Seleciona os elementos da página que serão manipulados
    const teamsGrid = document.querySelector('.teams-grid');
    const searchInput = document.querySelector('.barra-pesquisa input');
    const searchButton = document.getElementById('botao-busca');
    const clearButton = document.getElementById('botao-limpar');
    const bannerSection = document.querySelector('.banner');
    const containerH1 = document.querySelector('.container h1');
    const containerP = document.querySelector('.container p');
    const teamsLogosSection = document.querySelector('.teams-logos-section');

    // Variável para armazenar os dados de todas as equipes vindos do JSON
    let allTeamsData = [];

    /**
     * Função para renderizar (desenhar) os cards das equipes na tela.
     * @param {Array} teams - Um array de objetos de equipe para exibir.
     */
    function renderTeams(teams) {
        teamsGrid.innerHTML = ''; // Limpa o grid antes de adicionar novos cards
        if (teams.length === 0) {
            teamsGrid.innerHTML = '<p class="no-results">Nenhum resultado encontrado.</p>';
            return;
        }

        teams.forEach(team => {
            // Cria o HTML para os pilotos de cada equipe
            const driversHtml = team.drivers.map(driver =>
                `<p><a href="${driver.link}" target="_blank"><span>${driver.name}</span></a></p>`
            ).join('');

            // Cria o HTML completo para o card da equipe
            const teamCardHtml = `
                <div class="team-card ${team.teamClass}">
                    <div class="team-info">
                        <h2><a href="${team.teamLink}" target="_blank">${team.teamName}</a></h2>
                        <div class="drivers">${driversHtml}</div>
                        <span class="team-logo"></span>
                    </div>
                    <div class="car-image">
                        <img src="${team.carImage}" alt="Carro da ${team.teamName} F1">
                    </div>
                </div>
            `;
            // Insere o card no grid
            teamsGrid.insertAdjacentHTML('beforeend', teamCardHtml);
        });
    }

    /**
     * Função que executa a busca quando o botão "Buscar" é clicado.
     */
    function performSearch() {
        const searchTerm = searchInput.value.trim().toLowerCase();

        // Se o campo de busca estiver vazio, limpa a busca.
        if (!searchTerm) {
            clearSearch();
            return;
        }

        // Filtra as equipes com base no termo pesquisado (nome da equipe ou do piloto)
        const filteredTeams = allTeamsData.filter(team => {
            const teamNameMatch = team.teamName.toLowerCase().includes(searchTerm);
            const driverNameMatch = team.drivers.some(driver => driver.name.toLowerCase().includes(searchTerm));
            return teamNameMatch || driverNameMatch;
        });

        // Esconde os elementos que não devem aparecer na tela de resultado
        bannerSection.style.display = 'none';
        containerH1.style.display = 'none';
        containerP.style.display = 'none';
        teamsLogosSection.style.display = 'none';

        // Mostra o botão "Limpar"
        clearButton.style.display = 'inline-block';

        // Renderiza apenas os times que foram filtrados
        renderTeams(filteredTeams);
    }

    /**
     * Função que limpa a busca e restaura a página ao estado inicial.
     */
    function clearSearch() {
        searchInput.value = ''; // Limpa o campo de texto
        teamsGrid.innerHTML = ''; // Limpa os resultados da busca
        bannerSection.style.display = 'block'; // Mostra o vídeo
        containerH1.style.display = 'block'; // Mostra o título
        containerP.style.display = 'block'; // Mostra o parágrafo
        teamsLogosSection.style.display = 'block'; // Mostra a seção de logos
        clearButton.style.display = 'none'; // Esconde o botão "Limpar"
        searchInput.focus(); // Coloca o foco de volta na barra de pesquisa
    }

    // Função principal que inicializa a página
    function initializeApp() {
        fetch('dados.json')
            .then(response => response.json())
            .then(data => {
                allTeamsData = data; // Armazena os dados carregados
                // Não renderiza mais os times inicialmente
            })
            .catch(error => {
                console.error('Erro ao carregar os dados das equipes:', error);
                teamsGrid.innerHTML = '<p class="no-results">Erro ao carregar as equipes. Tente novamente mais tarde.</p>';
            });

        // Adiciona os eventos de clique aos botões
        searchButton.addEventListener('click', performSearch);
        clearButton.addEventListener('click', clearSearch);

        // Adiciona evento para buscar em tempo real enquanto o usuário digita
        searchInput.addEventListener('input', performSearch);
    }

    // Inicia a aplicação
    initializeApp();
});
