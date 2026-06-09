let respostas = [
  {
    perguntas: ["login", "acessar sistema"],
    resposta: "Para acessar o sistema, utilize seu usuário e senha corporativos."
  },
  {
    perguntas: ["horário", "atendimento"],
    resposta: "Atendimento de segunda a sexta, das 8h às 18h."
  }
];

// carregar do localStorage
const saved = localStorage.getItem("helpdesk_respostas");
if (saved) {
  respostas = JSON.parse(saved);
}

// salvar
function salvarRespostas() {
  localStorage.setItem("helpdesk_respostas", JSON.stringify(respostas));
}
