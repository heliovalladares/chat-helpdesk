$(document).ready(function () {

  const $messages = $(".messages");
  const $input = $("#msg_input");
  const $send = $("#send_button");

  const $adminToggle = $("#admin_toggle");
  const $adminLogout = $("#admin_logout");
  const $adminPanel = $("#admin_panel");

  const $adminQuestions = $("#admin_questions");
  const $adminAnswer = $("#admin_answer");
  const $adminSave = $("#admin_save");

  const ADMIN_PASSWORD = "1234";
  let isAdmin = false;
  
  // Armazena o catálogo vindo do arquivo JSON
  let respostas = []; 

// ===== CARREGAR RESPOSTAS DO ARQUIVO JSON =====
  // Tentamos ler o arquivo. Se falhar, criamos uma estrutura vazia para o chat não travar.
  fetch("js/respostas.json") 
    .then(res => {
      if (!res.ok) {
        throw new Error("Não foi possível encontrar o arquivo js/respostas.json (Erro " + res.status + ")");
      }
      return res.json();
    })
    .then(data => {
      respostas = data;
      console.log("Catálogo carregado com sucesso! Total de itens:", respostas.length);
    })
    .catch(err => {
      console.error("Atenção: O JSON não carregou, mas o chat foi protegido contra travamentos.", err);
      // Evita o colapso do sistema definindo um array vazio de segurança
      respostas = []; 
    });
  // ===== EVENTOS DO CHAT =====
  $send.on("click", sendMessage);
  $input.on("keypress", function (e) {
    if (e.which === 13) sendMessage();
  });

  function sendMessage() {
    const text = $input.val().trim();
    if (!text) return;

    addMessage(text, "right");
    $input.val("");

    setTimeout(() => botReply(text), 500);
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

    $messages.scrollTop($messages[0].scrollHeight);
  }

  function botReply(textoUsuario) {
    // CORREÇÃO: Agora passa exatamente os 2 parâmetros que o matcher.js espera
    let resposta = encontrarResposta(textoUsuario, respostas);

    if (resposta) {
      addMessage(resposta, "left");
    } else {
      addMessage("🤔 Ainda não sei responder isso. Vou registrar sua dúvida para o suporte técnico.", "left");

      $.post("api/save_unanswered.php", {
        pergunta: textoUsuario
      });
    }
  }

  // ===== EVENTOS DO ADMIN =====
  $adminToggle.on("click", function () {
    const senha = prompt("Digite a senha do admin:");
    if (senha === ADMIN_PASSWORD) {
      isAdmin = true;
      $adminPanel.show();
      $adminToggle.hide();
      $adminLogout.show();
    } else {
      alert("Senha incorreta");
    }
  });

  $adminLogout.on("click", function () {
    isAdmin = false;
    $adminPanel.hide();
    $adminLogout.hide();
    $adminToggle.show();
  });

  $adminSave.on("click", function () {
    if (!isAdmin) return alert("Acesso negado");

    const perguntasRaw = $adminQuestions.val().trim();
    const resposta = $adminAnswer.val().trim();

    if (!perguntasRaw || !resposta) {
      alert("Preencha perguntas e resposta");
      return;
    }

    const perguntasArray = perguntasRaw.split(",").map(p => p.trim()).filter(p => p !== "");

    $.post("api/save_resposta.php", {
      perguntas: perguntasArray,
      resposta: resposta
    }).done(() => {
      alert("Resposta salva com sucesso!");
      location.reload();
    });
  });

});