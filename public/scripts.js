// Seleciona o elemento do card de conteúdo
const contentCard = document.getElementById('content');

// Função para alterar o conteúdo do card
function loadContent(title, text) {
    contentCard.innerHTML = `
        <h2>${title}</h2>
        <p>${text}</p>
    `;
}

// Adiciona event listeners para os links do menu
document.getElementById('home-link').addEventListener('click', function() {
    loadContent('Home', 'Bem-vindo à Home! Aqui você encontra as últimas atualizações.');
});

document.getElementById('caderno-link').addEventListener('click', function() {
    loadContent('Caderno de Exercício', 'Aqui você pode acessar e resolver seus exercícios.');
});

document.getElementById('material-link').addEventListener('click', function() {
    loadContent('Material Didático', 'Encontre todo o material didático necessário para o seu aprendizado.');
});

document.getElementById('chat-link').addEventListener('click', function() {
    loadContent('Chat', 'Converse com outros alunos e professores em tempo real.');
});

document.getElementById('help-link').addEventListener('click', function() {
    loadContent('Help', 'Precisa de ajuda? Consulte as perguntas frequentes ou entre em contato com o suporte.');
});
