// 1. Limpa o texto retirando acentos, símbolos e espaços extras
function normalizar(texto) {
  if (!texto) return "";
  return texto
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove acentos
    .replace(/[^\w\s]/g, "")         // Remove símbolos extras
    .trim();
}

// Palavras genéricas ignoradas na busca manual digitada
const palavrasIgnoradas = ["o", "a", "os", "as", "um", "uma", "de", "da", "do", "para", "com", "em", "como", "eu", "que"];

// 2. Calcula correspondência de termos para o texto livre digitado
function calcularScore(perguntaBaseOriginal, palavrasUsuario) {
  let score = 0;
  const perguntaNormalizada = normalizar(perguntaBaseOriginal);
  const palavrasBanco = perguntaNormalizada.split(" ");

  palavrasUsuario.forEach(u => {
    if (palavrasIgnoradas.includes(u) || u.length < 2) return;
    if (palavrasBanco.includes(u)) {
      score += 2;
    }
  });
  return score;
}

// 3. Função principal chamada internamente pelo chat.js
function encontrarResposta(textoUsuario, respostas) {
  if (!textoUsuario || !respostas || respostas.length === 0) return null;

  const textoLimpo = normalizar(textoUsuario);
  const palavrasUsuario = textoLimpo.split(" ");
  
  let melhorResposta = null;
  let maiorScore = 0;
  const SCORE_MINIMO = 2; 

  respostas.forEach(item => {
    let perguntasBase = [];
    
    // Tratamento de segurança caso venha array puro ou string por vírgula
    if (Array.isArray(item.perguntas)) {
      perguntasBase = item.perguntas;
    } else if (typeof item.perguntas === "string") {
      perguntasBase = item.perguntas.split(",").map(p => p.trim());
    }

    perguntasBase.forEach(p => {
      let scoreAtual = 0;
      const perguntaLimpaBanco = normalizar(p);

      // CASO DO BOTÃO QUICK REPLY: Se o data-search coincidir exatamente com o item do JSON
      if (perguntaLimpaBanco === textoLimpo) {
        scoreAtual = 100; // Prioridade total absoluta
      } else {
        // Caso o utilizador tenha digitado livremente na caixa de texto
        scoreAtual = calcularScore(p, palavrasUsuario);
      }

      if (scoreAtual > maiorScore) {
        maiorScore = scoreAtual;
        melhorResposta = item.resposta;
      }
    });
  });

  console.log(`[HelpDesk Matcher] Busca: "${textoUsuario}" | Score Alcançado: ${maiorScore}`);
  return maiorScore >= SCORE_MINIMO ? melhorResposta : null;
}