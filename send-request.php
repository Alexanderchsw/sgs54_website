<?php
$to = "sgs9537828146@gmail.com";        // ваша почта

$name  = trim($_POST['name']  ?? '');
$email = trim($_POST['email'] ?? '');
$msg   = trim($_POST['message'] ?? '');

if(!$name || !$email || !$msg){
  http_response_code(400); exit("Заполните все поля.");
}

$subj = "Заявка с сайта от $name";
$body = "Имя: $name\nE-mail: $email\n\n$msg";
$hdr  = "From: site@sgs54.ru\r\nContent-Type: text/plain; charset=utf-8";

echo mail($to,$subj,$body,$hdr) ? "OK" : "ERR";
