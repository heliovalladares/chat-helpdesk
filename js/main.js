$(document).ready(function () {
  const $messages = $('.messages');
  const $input = $('#msg_input');
  const $sendBtn = $('#send_button');

  const $adminQuestions = $('#admin_questions');
  const $adminAnswer = $('#admin_answer');
  const $adminVideo = $('#admin_video');
  const $adminSave = $('#admin_save');
  const $adminClear = $('#admin_clear');

  let respostas = loadRespostas();

  $sendBtn.on('click', sendMessage);
  $input.on('keypress', function (e) {
    if (e.which === 13) sendMessage();
  });

  $adminSave.on('click', saveAdmin);
  $adminClear.on('click', clearAdmin);

  function loadRespostas() {
    const stored = localStorage.getItem('respostas_chat');
    if (stored) return JSON.parse(stored);
    return [];
  }

  function saveRespostas(data) {
    localStorage.setItem('respostas_chat', JSON.stringify(data));
  }

  function saveAdmin() {
    const perguntasText = $adminQuestions.val().trim();
    const respostaText = $adminAnswer.val().trim();
    const videoText = $adminVideo.val().trim();

    if (!perguntasText || !respostaText) {
      alert("Preencha perguntas e resposta!");
      return;
    }

    const perguntas = perguntasText.split(',').map(p => p.trim()).filter(Boolean);

    let respostaFinal = respostaText;

    if (videoText) {
      respostaFinal += `<br><video width="320" height="180" controls>
        <source src="${videoText}" type="video/mp4">
        Seu navegador não suporta vídeo.
      </video>`;
    }

    respostas.push({
      perguntas: perguntas,
      resposta: respostaFinal
    });

    saveRespostas(respostas);

    alert("Resposta salva com sucesso!");
    clearAdmin();
  }

  function clearAdmin() {
    $adminQuestions.val('');
    $adminAnswer.val('');
    $adminVideo.val('');
  }

  function sendMessage() {
    const text = $input.val().trim();
    if (!text) return;

    addMessage(text, 'right');
    $input.val('');

    showTyping();

    setTimeout(() => {
      removeTyping();
      botReply(text);
    }, 800);
  }

  function addMessage(text, side) {
    const messageHtml = `
      <li class="message ${side}">
        <div class="avatar"></div>
        <div>
          <div class="text_wrapper">${text}</div>
        </div>
      </li>
    `;
    $messages.append(messageHtml);
    scrollBottom();
  }

  function showTyping() {
    const typingHtml = `
      <li class="message left typing">
        <div class="avatar"></div>
        <div>
          <div class="text_wrapper">Llama está digitando...</div>
        </div>
      </li>
    `;
    $messages.append(typingHtml);
    scrollBottom();
  }

  function removeTyping() {
    $('.typing').remove();
  }

  function botReply(userText) {
    const text = userText.toLowerCase();
    let respostaFinal = "Desculpe, ainda não tenho resposta para isso. Pode perguntar outra coisa?";

    for (let item of respostas) {
      for (let pergunta of item.perguntas) {
        if (text.includes(pergunta)) {
          respostaFinal = item.resposta;
          break;
        }
      }
    }

    addMessage(respostaFinal, 'left');
  }

  function scrollBottom() {
    $messages.scrollTop($messages[0].scrollHeight);
  }
});
