<?php
require "../db/config.php";

$result = $conn->query("SELECT * FROM respostas");
$respostas = [];

while ($row = $result->fetch_assoc()) {
  $respostas[] = [
    "perguntas" => array_map('trim', explode(",", $row['perguntas'])),
    "resposta" => $row['resposta']
  ];
}

header("Content-Type: application/json");
echo json_encode($respostas);
