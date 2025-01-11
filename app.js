/**
 * Валидатор ИИН (Индивидуальный Идентификационный Номер) Казахстана
 * @param {string} iin - строка из 12 цифр
 * @returns {object} - результат валидации с информацией о владельце ИИН
 */
function calculateChecksum(iin) {
    const w1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    const w2 = [3, 4, 5, 6, 7, 8, 9, 10, 11, 1, 2];
    
    // First try with w1
    let checksum = 0;
    for (let i = 0; i < 11; i++) {
        checksum += parseInt(iin[i]) * w1[i];
    }
    checksum = checksum % 11;
    
    // If checksum is 10, try with w2
    if (checksum === 10) {
        checksum = 0;
        for (let i = 0; i < 11; i++) {
            checksum += parseInt(iin[i]) * w2[i];
        }
        checksum = checksum % 11;
    }
    
    return checksum;
}

function validateIIN(iin) {
    // Проверка на корректную длину и наличие только цифр
    if (!/^\d{12}$/.test(iin)) {
        return {
            isValid: false,
            error: 'ИИН должен состоять из 12 цифр'
        };
    }

    // Разбор даты рождения
    const century = parseInt(iin[6]);
    if (![0, 1, 2, 3, 4, 5].includes(century)) {
        return {
            isValid: false,
            error: 'Некорректный век рождения'
        };
    }

    let year = parseInt(iin.substr(0, 2));
    const month = parseInt(iin.substr(2, 2));
    const day = parseInt(iin.substr(4, 2));

    // Определение полного года рождения
    switch (century) {
        case 1:
        case 2:
            year += 1800;
            break;
        case 3:
        case 4:
            year += 1900;
            break;
        case 5:
        case 6:
            year += 2000;
            break;
    }

    // Проверка корректности даты
    const birthDate = new Date(year, month - 1, day);
    if (birthDate.getFullYear() !== year ||
        birthDate.getMonth() !== month - 1 ||
        birthDate.getDate() !== day) {
        return {
            isValid: false,
            error: 'Некорректная дата рождения'
        };
    }

    // Проверка контрольной суммы
    const checksum = calculateChecksum(iin);
    if (checksum !== parseInt(iin[11])) {
        return {
            isValid: false,
            error: 'Некорректная контрольная сумма'
        };
    }

    // Определение пола
    const gender = parseInt(iin[6]) % 2 === 0 ? 'женский' : 'мужской';

    return {
        isValid: true,
        info: {
            birthDate: birthDate,
            gender: gender,
            century: Math.floor(year / 100) * 100
        }
    };
}

// Примеры использования:
console.log(validateIIN('941205300125')); // Валидный ИИН
console.log(validateIIN('941205300129')); // Неверная контрольная сумма
console.log(validateIIN('9412053001')); // Неверная длина
console.log(validateIIN('94120530012a')); // Содержит не только цифры

module.exports = { validateIIN };