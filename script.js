document.addEventListener('DOMContentLoaded', () => {
    const teamsGrid = document.querySelector('.teams-grid');
    const searchInput = document.querySelector('.barra-pesquisa input');
    const searchButton = document.getElementById('botao-busca');
    const clearButton = document.getElementById('botao-limpar');
    const bannerSection = document.querySelector('.banner');
    const containerH1 = document.querySelector('.container h1');
    const containerP = document.querySelector('.container p');
    const teamsLogosSection = document.querySelector('.teams-logos-section');

    let allTeamsData = [];

    function renderTeams(teams) {
        teamsGrid.innerHTML = '';
        if (teams.length === 0) {
            teamsGrid.innerHTML = '<p class="no-results">Nenhum resultado encontrado.</p>';
            return;
        }

        teams.forEach(team => {
            const driversHtml = team.drivers.map(driver =>
                `<p><a href="${driver.link}" target="_blank"><span>${driver.name}</span></a></p>`
            ).join('');

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
            teamsGrid.insertAdjacentHTML('beforeend', teamCardHtml);
        });
    }

    function performSearch() {
        const searchTerm = searchInput.value.trim().toLowerCase();

        if (!searchTerm) {
            clearSearch();
            return;
        }

        const filteredTeams = allTeamsData.filter(team => {
            const teamNameMatch = team.teamName.toLowerCase().includes(searchTerm);
            const driverNameMatch = team.drivers.some(driver => driver.name.toLowerCase().includes(searchTerm));
            return teamNameMatch || driverNameMatch;
        });

        bannerSection.style.display = 'none';
        containerH1.style.display = 'none';
        containerP.style.display = 'none';
        teamsLogosSection.style.display = 'none';

        clearButton.style.display = 'inline-block';

        renderTeams(filteredTeams);
    }

    function clearSearch() {
        searchInput.value = '';
        teamsGrid.innerHTML = '';
        bannerSection.style.display = 'block';
        containerH1.style.display = 'block';
        containerP.style.display = 'block';
        teamsLogosSection.style.display = 'block';
        clearButton.style.display = 'none';
        searchInput.focus();
    }

    function initializeApp() {
        fetch('dados.json')
            .then(response => response.json())
            .then(data => {
                allTeamsData = data;
            })
            .catch(error => {
                console.error('Erro ao carregar os dados das equipes:', error);
                teamsGrid.innerHTML = '<p class="no-results">Erro ao carregar as equipes. Tente novamente mais tarde.</p>';
            });
    }

    searchButton.addEventListener('click', performSearch);
    clearButton.addEventListener('click', clearSearch);
    searchInput.addEventListener('input', performSearch);

    initializeApp();
});
