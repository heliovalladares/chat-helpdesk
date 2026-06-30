$(document).ready(function () {
  const $messages = $(".messages");
  const $input = $("#msg_input");
  const $send = $("#send_button");

  let respostas = []; 
  let categoriaAtiva = null; 

  // ===== CARREGAR RESPOSTAS DO ARQUIVO JSON =====
  function carregarRespostas() {
    fetch("js/respostas.json")
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => {
        respostas = data;
        console.log("👉 Banco unificado carregado! Itens salvos:", respostas.length);
      })
      .catch(() => {
        fetch("respostas.json")
          .then(res => res.json())
          .then(data => {
            respostas = data;
            console.log("👉 Banco unificado carregado da raiz!");
          })
          .catch(err => console.error("❌ ERRO: O arquivo respostas.json não foi encontrado.", err));
      });
  }

  carregarRespostas();

  // ===== FUNÇÃO: REINICIAR CONVERSA =====
  function reiniciarConversa() {
    $messages.empty();
    categoriaAtiva = null;
    $(".quick_btn").css({ "border": "none", "opacity": "1" });
    $input.val("");
    
    addMessage("Conversa reiniciada! Por favor, <b>selecione uma nova categoria nos botões abaixo</b> para começarmos.", "left");
  }

  // Atribui o clique do botão de reset de forma segura
  $(document).off("click", "#reset_chat_btn").on("click", "#reset_chat_btn", function(e) {
    e.preventDefault();
    reiniciarConversa();
  });

  // ===== EVENTOS DE ENVIO DE TEXTO (INPUT) =====
  $send.off("click").on("click", function() {
    sendMessage();
  });

  $input.off("keypress").on("keypress", function (e) {
    if (e.which === 13) {
      sendMessage();
    }
  });

  // ===== EVENTO DE CLIQUE NOS BOTÕES DE CATEGORIA =====
  $(document).off("click", ".quick_btn").on("click", ".quick_btn", function (e) {
    e.preventDefault();
    
    const textoExibido = $(this).text();             
    const categoriaBotao = $(this).attr("data-categoria"); 

    if (!categoriaBotao) return;

    // Atualiza a categoria na memória (permite trocar de uma para outra direto)
    categoriaAtiva = categoriaBotao;

    // Aplica o destaque visual
    $(".quick_btn").css({ "border": "none", "opacity": "0.5" });
    $(this).css({ "border": "2px solid #00ff00", "opacity": "1" });

    // Envia o balão de escolha do usuário
    addMessage(`Escolhi a categoria: ${textoExibido}`, "right"); 
    
    // O robô responde confirmando a mudança de sistema
    setTimeout(() => {
      addMessage(`Ótimo! Você selecionou o sistema <b>${categoriaAtiva.toUpperCase()}</b>. Qual seria sua dúvida sobre ele hoje?`, "left");
    }, 200);
  });

  // Função para processar o envio do campo de texto
  function sendMessage() {
    const text = $input.val().trim();
    if (!text) return;

    addMessage(text, "right");
    $input.val("");

    // Dispara a pesquisa no banco
    setTimeout(() => botReply(text), 200);
  }

  function addMessage(text, side) {
    const avatar = side === "left" ? '<div class="avatar bot"></div>' : '<div class="avatar user\"></div>';
    
    // Criamos o elemento da mensagem como um objeto HTML do jQuery
    const $msgElement = $(`
      <li class="message ${side}">
        ${avatar}
        <div class="text_wrapper"></div>
      </li>
    `);
    
    // Usamos .html() para renderizar as tags de imagem <img> e formatações <b> <br> corretamente
    $msgElement.find(".text_wrapper").html(text);
    
    // Adiciona na lista de mensagens
    $messages.append($msgElement);
    
    if ($messages[0]) {
      $messages.animate({ scrollTop: $messages[0].scrollHeight }, 200);
    }
  }
  // Busca e exibe a resposta técnica correspondente
  function botReply(textoUsuario) {
    if (!categoriaAtiva) {
      addMessage("⚠️ Por favor, escolha primeiro uma das categorias nos botões acima (como o botão <b>⚙️ CIMA</b>) antes de digitar.", "left");
      return;
    }

    if (typeof encontrarResposta === "function") {
      let resposta = encontrarResposta(textoUsuario, respostas, categoriaAtiva);

      if (resposta) {
        addMessage(resposta, "left");
      } else {
        addMessage(`🤔 Não encontrei uma instrução exata para a dúvida <i>"${textoUsuario}"</i> na categoria <b>${categoriaAtiva.toUpperCase()}</b>.`, "left");
      }
    } else {
      console.error("Erro: A função 'encontrarResposta' não foi encontrada no matcher.js.js");
    }
  }
});