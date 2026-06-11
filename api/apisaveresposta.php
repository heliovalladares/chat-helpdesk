<?php
header('Content-Type: application/json');

if (!isset($_POST['perguntas']) || !isset($_POST['resposta'])) {
    echo json_encode(["status" => "erro", "mensagem" => "Dados incompletos."]);
    exit;
}

$novasPerguntas = $_POST['perguntas']; 
$novaResposta = $_POST['resposta'];

$caminhoJson = '../js/respostas.json';

if (file_exists($caminhoJson)) {
    $conteudoAtual = file_get_contents($caminhoJson);
    $catalogoAtual = json_decode($conteudoAtual, true);
    
    if (!is_array($catalogoAtual)) {
        $catalogoAtual = [];
    }
} else {
    $catalogoAtual = [];
}

// 🌟 ATUALIZADO: Força novas inserções manuais do admin a terem a propriedade categoria como "cima"
$novoBloco = [
    "categoria" => "cima",
    "perguntas" => $novasPerguntas, 
    "resposta" => $novaResposta     
];

$catalogoAtual[] = $novoBloco;

$jsonAtualizado = json_encode($catalogoAtual, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

if (file_put_contents($caminhoJson, $jsonAtualizado)) {
    echo json_encode(["status" => "sucesso", "mensagem" => "Catálogo atualizado com sucesso."]);
} else {
    echo json_encode(["status" => "erro", "mensagem" => "Não foi possível escrever no arquivo JSON."]);
}
?>