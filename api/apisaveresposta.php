<?php
// 1. Configura o cabeçalho para responder em formato JSON (padrão de APIs)
header('Content-Type: application/json');

// 2. Verifica se os dados necessários foram enviados pelo front-end
if (!isset($_POST['perguntas']) || !isset($_POST['resposta'])) {
    echo json_encode(["status" => "erro", "mensagem" => "Dados incompletos."]);
    exit;
}

// 3. Recebe os dados do formulário do Admin
// O Front-end envia 'perguntas' como um Array e 'resposta' como uma String
$novasPerguntas = $_POST['perguntas']; 
$novaResposta = $_POST['resposta'];

// 4. Caminho do seu arquivo onde o catálogo fica guardado
$caminhoJson = '../js/respostas.json';

// 5. Se o arquivo já existir, lê o conteúdo atual. Se não existir, cria um array vazio.
if (file_exists($caminhoJson)) {
    $conteudoAtual = file_get_contents($caminhoJson);
    $catalogoAtual = json_decode($conteudoAtual, true);
    
    // Se o arquivo estiver corrompido ou vazio, reinicia como um array
    if (!is_array($catalogoAtual)) {
        $catalogoAtual = [];
    }
} else {
    $catalogoAtual = [];
}

// 6. Cria o novo bloco de conhecimento estruturado
$novoBloco = [
    "perguntas" => $novasPerguntas, // Array com todas as variações de perguntas
    "resposta" => $novaResposta     // Texto da solução técnica
];

// 7. Adiciona o novo bloco ao final do catálogo existente (Carga incremental)
$catalogoAtual[] = $novoBloco;

// 8. Salva o catálogo atualizado de volta no arquivo JSON com formatação limpa
$jsonAtualizado = json_encode($catalogoAtual, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

if (file_put_contents($caminhoJson, $jsonAtualizado)) {
    // Retorna sucesso para o Javascript (chat.js) recarregar a página
    echo json_encode(["status" => "sucesso", "mensagem" => "Catálogo atualizado com sucesso."]);
} else {
    echo json_encode(["status" => "erro", "mensagem" => "Não foi possível escrever no arquivo JSON."]);
}
?>