// 1. Limpa o texto retirando acentos, símbolos e espaços extras
function normalizar(texto) {
  if (!texto) return "";
  return texto
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") 
    .replace(/[^\w\s]/g, "")         
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

// 3. Função principal chamada pelo chat para encontrar a resposta baseada na categoria
function encontrarResposta(textoUsuario, respostas, categoriaFiltro = null) {
  if (!textoUsuario || !respostas || respostas.length === 0) return null;

  const textoLimpo = normalizar(textoUsuario);
  const palavrasUsuario = textoLimpo.split(" ");
  
  let melhorResposta = null;
  let maiorScore = 0;
  const SCORE_MINIMO = 2; 

  respostas.forEach(item => {
    // Validação de categoria (Garante que "Gunnebo" e "gunnebo" deem match)
    if (categoriaFiltro && item.categoria && item.categoria.toLowerCase() !== categoriaFiltro.toLowerCase()) {
      return;
    }

    let perguntasBase = [];
    if (Array.isArray(item.perguntas)) {
      perguntasBase = item.perguntas;
    } else if (typeof item.perguntas === "string") {
      perguntasBase = item.perguntas.split(",").map(p => p.trim());
    }

    perguntasBase.forEach(p => {
      let scoreAtual = 0;
      const perguntaLimpaBanco = normalizar(p);

      if (perguntaLimpaBanco === textoLimpo) {
        scoreAtual = 100; // Prioridade máxima se a frase for idêntica
      } else {
        scoreAtual = calcularScore(p, palavrasUsuario);
      }

      if (scoreAtual > maiorScore) {
        maiorScore = scoreAtual;
        melhorResposta = item.resposta;
      }
    });
  });

  return maiorScore >= SCORE_MINIMO ? melhorResposta : null;
}