    // Função para formatar o texto no editor
function formatText(command, value = null) {
    // Aplica o comando de formatação
    document.execCommand(command, false, value);

    // Seleciona todos os botões da barra de ferramentas
    const buttons = document.querySelectorAll('.toolbar button');

    // Remove a classe 'selected' de todos os botões
    buttons.forEach(button => {
        button.classList.remove('selected');
    });

    // Adiciona a classe 'selected' ao botão clicado
    const activeButton = document.querySelector(`button[onclick="formatText('${command}', '${value}')"]`);
    if (activeButton) {
        activeButton.classList.add('selected');
    }
    updateToolbarState();

}

function updateToolbarState() {
    // Seleciona todos os botões da toolbar
    const buttons = document.querySelectorAll('.toolbar button');

    // Verifica o estado de cada comando e ajusta os botões
    buttons.forEach(button => {
        const command = button.getAttribute('onclick').match(/'([^']+)'/)[1]; // Extrai o comando

        // Verifica se o comando está ativo no texto
        const isActive = document.queryCommandState(command);

        // Adiciona ou remove a classe 'selected' com base no estado do comando
        if (isActive) {
            button.classList.add('selected');
        } else {
            button.classList.remove('selected');
        }
    });
}

function undoAction() {
    document.execCommand('undo');
}

function redoAction() {
    document.execCommand('redo');
}

function changeTextColor(color) {
    document.execCommand('foreColor', false, color);//comando forecolor abre a aba de cores 
}

// Função para salvar o conteúdo como .txt ou .html
function saveAsFile(fileType) {
    const editorContent = document.getElementById("editor").innerHTML;  // Obtém o conteúdo do editor
    const documentName = document.getElementById("document-name").value || "Untitled";  // Nome do documento
    let blob;

    if (fileType === 'txt') {
        // Para .txt, vamos extrair apenas o texto simples
        const textContent = document.getElementById("editor").innerText;
        blob = new Blob([textContent], { type: 'text/plain' });
    } else if (fileType === 'html') {
        // Para .html, vamos salvar o conteúdo HTML
        blob = new Blob([editorContent], { type: 'text/html' });
    }

    // Criar um link de download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${documentName}.${fileType}`;
    link.click();
}

document.addEventListener('keydown', function(event) {
    if (event.ctrlKey) {
        if (event.key === 'z') {
            event.preventDefault();
            undoAction();
        }
        if (event.key === 'y') {
            event.preventDefault();
            redoAction();
        }
    }
});

function changeFontSize(amount) {
    const editor = document.getElementById("editor");
    let currentFontSize = window.getComputedStyle(editor, null).getPropertyValue('font-size');
    currentFontSize = parseFloat(currentFontSize);
    editor.style.fontSize = (currentFontSize + amount) + 'px';//aumenta o tamanho de todo o texto
}
// Armazena o conteúdo do editor no localStorage
function saveEditorContent() {
    const editorContent = document.getElementById("editor").innerHTML;
    localStorage.setItem("editorContent", editorContent); // Salva o conteúdo no localStorage
}

// Recupera o conteúdo do editor do localStorage
function loadEditorContent() {
    const savedContent = localStorage.getItem("editorContent");
    if (savedContent) {
        document.getElementById("editor").innerHTML = savedContent;
    }
}

// Chama a função de salvar sempre que o conteúdo é alterado
document.getElementById("editor").addEventListener("input", saveEditorContent);

window.onload = function() {
    // Carrega o conteúdo do localStorage ao carregar a página
    loadEditorContent();
    // Chama a função de atualização do estado quando a página carregar para garantir que o estado inicial esteja correto
    updateToolbarState();
};




