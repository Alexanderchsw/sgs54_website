<?php
/*  ===  send-order.php
      Принимает JSON вида  { "cart": [ {name, article, quantity, price}, … ] }
      и отправляет письмо с содержимым корзины.                         ===  */

/* === НАСТРОЙКИ ======================================================= */
$to      = "sgs9537828146@gmail.com";            // получатель
$from    = "site@sgs54.ru";              // «от кого»
$subject = "Новый заказ с сайта СГС";

/* === ЧИТАЕМ JSON ===================================================== */
$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

if (!$data || !isset($data['cart']) || !is_array($data['cart'])) {
  http_response_code(400);
  echo "Bad JSON";
  exit;
}

/* === ФОРМИРУЕМ ТЕКСТ ПИСЬМА ========================================= */
$body = "Поступил новый заказ\n\n";
foreach ($data['cart'] as $item) {
  $name     = htmlspecialchars($item['name']     ?? '—', ENT_QUOTES, 'UTF-8');
  $article  = htmlspecialchars($item['article']  ?? '—', ENT_QUOTES, 'UTF-8');
  $qty      = (int)($item['quantity']            ?? 1);
  $priceStr = htmlspecialchars($item['price']    ?? '—', ENT_QUOTES, 'UTF-8');

  $body .= "Наименование : $name\n";
  $body .= "Артикул      : $article\n";
  $body .= "Количество   : $qty\n";
  $body .= "Цена за ед.  : $priceStr\n";
  $body .= "-------------------------------------\n";
}

/* === ОТПРАВКА ======================================================= */
$headers  = "From: {$from}\r\n";
$headers .= "Content-Type: text/plain; charset=utf-8";

if (mail($to, $subject, $body, $headers)) {
  echo "OK";
} else {
  http_response_code(500);
  echo "Mail error";
}
