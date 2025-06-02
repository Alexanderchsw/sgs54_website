<?php
// Установи свою почту здесь:
$to = "your-email@example.com";

// Получаем сырые входные данные
$data = json_decode(file_get_contents("php://input"), true);

// Проверка данных
if (!isset($data['cart']) || !is_array($data['cart'])) {
    http_response_code(400);
    echo "Неверный формат данных.";
    exit;
}

// Собираем письмо
$subject = "Новый заказ с сайта СГС";
$message = "Поступил новый заказ:\n\n";

foreach ($data['cart'] as $item) {
    $name = htmlspecialchars($item['name']);
    $article = htmlspecialchars($item['article']);
    $quantity = intval($item['quantity']);
    $price = htmlspecialchars($item['price']);
    $priceDisplay = ($price && $price !== '—') ? $price . " ₽" : "Уточняется по телефону";

    $message .= "Название: $name\n";
    $message .= "Артикул: $article\n";
    $message .= "Количество: $quantity\n";
    $message .= "Цена за единицу: $priceDisplay\n";
    $message .= "----------------------\n";
}

$headers = "From: no-reply@sgs54.ru\r\nContent-Type: text/plain; charset=utf-8";

// Отправка письма
if (mail($to, $subject, $message, $headers)) {
    echo "Письмо отправлено.";
} else {
    http_response_code(500);
    echo "Ошибка при отправке письма.";
}
?>
