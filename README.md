```js
// Примеры использования:
console.log(validateIIN('941205300125')); // Валидный ИИН
console.log(validateIIN('941205300129')); // Неверная контрольная сумма
console.log(validateIIN('9412053001')); // Неверная длина
console.log(validateIIN('94120530012a')); // Содержит не только цифры
```