$(document).ready(function () {

  const $messages = $(".messages");
  const $input = $("#msg_input");
  const $send = $("#send_button");

  // Armazena as respostas carregadas na memória
  let respostas = []; 

  // ===== CARREGAR RESPOSTAS DO ARQUIVO JSON =====
  // Tentativa A: Carrega do caminho padrão relativo ao index.html
  fetch("js/respostas.json")
    .then(res => {
      if (!res.ok) throw new Error("Caminho padrão não encontrado, tentando raiz.");
      return res.json();
    })
    .then(data => {
      respostas = data;
      console.log("Catálogo carregado com sucesso via rota pública! Itens:", respostas.length);
    })
    .catch(() => {
      // Tentativa B: Fallback de segurança caso esteja na raiz devido às chamadas PHP
      fetch("respostas.json")
        .then(res => res.json())
        .then(data => {
          respostas = data;
          console.log("Catálogo carregado via rota de fallback! Itens:", respostas.length);
        })
        .catch(err => console.error("Erro crítico ao localizar o ficheiro respostas.json:", err));
    });

  // ===== EVENTOS DO CHAT =====
  $send.on("click", sendMessage);
  $input.on("keypress", function (e) {
    if (e.which === 13) sendMessage();
  });

  // 🌟 ESCUTA DE CLIQUE CORRIGIDA PARA OS BOTÕES RÁPIDOS
  $(document).on("click", ".quick_btn", function (e) {
    e.preventDefault();
    
    const termoMapeado = $(this).attr("data-search"); // Ex: "configurar simulador cashlogy"
    const textoExibido = $(this).text();             // Ex: "⚙️ Instalar maquina virtual"

    if (!termoMapeado) return;

    // 1. Imprime imediatamente o balão do utilizador no chat com o nome do botão
    addMessage(textoExibido, "right"); 
    
    // 2. Dispara o robô para ler a string exata no matcher
    botReply(termoMapeado); 
  });

  function sendMessage() {
    const text = $input.val().trim();
    if (!text) return;

    addMessage(text, "right");
    $input.val("");

    setTimeout(() => botReply(text), 200);
  }

  function addMessage(text, side) {
    const avatar = side === "left"
      ? '<div class="avatar bot"></div>'
      : '<div class="avatar user"></div>';

    $messages.append(`
      <li class="message ${side}">
        ${avatar}
        <div class="text_wrapper">${text}</div>
      </li>
    `);

    // Rolagem automática para o fim da conversa
    $messages.animate({ scrollTop: $messages[0].scrollHeight }, 200);
  }

  function botReply(textoUsuario) {
    if (typeof encontrarResposta === "function") {
      let resposta = encontrarResposta(textoUsuario, respostas);

      if (resposta) {
        addMessage(resposta, "left");
      } else {
        addMessage("🤔 Não encontrei uma instrução exata para esse caso no sistema.", "left");
      }
    } else {
      console.error("Erro: A função 'encontrarResposta' não está disponível no escopo do matcher.js");
    }
  }
});