// 1. Limpa o texto tirando acentos e símbolos
function normalizar(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") 
    .replace(/[^\w\s]/g, "")         
    .trim();
}

// Palavras comuns que ignoramos para não dar falso positivo
const palavrasIgnoradas = ["o", "a", "os", "as", "um", "uma", "de", "da", "do", "para", "com", "em", "como", "eu", "que"];

// 2. Calcula quantos termos bateram com o catálogo
function calcularScore(perguntasBase, palavrasUsuario) {
  let score = 0;

  perguntasBase.forEach(p => {
    if (palavrasIgnoradas.includes(p)) return;

    palavrasUsuario.forEach(u => {
      if (palavrasIgnoradas.includes(u)) return;
      
      // Se a palavra bater igualzinho, ganha ponto
      if (u === p) {
        score += 2;
      }
    });
  });

  return score;
}

// 3. Função principal chamada pelo chat.js
function encontrarResposta(textoUsuario, respostas) {
  const palavrasUsuario = normalizar(textoUsuario).split(" ");
  let melhorResposta = null;
  let maiorScore = 0;
  
  // Se o usuário digitar algo que combine pelo menos 1 palavra importante, já aceita
  const SCORE_MINIMO = 2; 

  respostas.forEach(item => {
    const perguntasBase = item.perguntas
      .map(p => normalizar(p))
      .join(" ")
      .split(" ");

    const score = calcularScore(perguntasBase, palavrasUsuario);

    if (score > maiorScore) {
      maiorScore = score;
      melhorResposta = item.resposta;
    }
  });

  return maiorScore >= SCORE_MINIMO ? melhorResposta : null;
}