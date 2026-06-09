<?php
require "../db/config.php";

$perguntas = $_POST['perguntas'] ?? '';
$resposta  = $_POST['resposta'] ?? '';

if (!$perguntas || !$resposta) {
  http_response_code(400);
  exit;
}

$stmt = $conn->prepare(
  "INSERT INTO respostas (perguntas, resposta) VALUES (?, ?)"
);
$stmt->bind_param("ss", $perguntas, $resposta);
$stmt->execute();

echo "ok";
