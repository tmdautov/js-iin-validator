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

export function validateIIN(iin) {
    // Basic validation
    if (!iin || typeof iin !== 'string') {
        return { isValid: false, error: 'ИИН должен быть строкой' };
    }

    if (!/^\d{12}$/.test(iin)) {
        return { isValid: false, error: 'ИИН должен состоять из 12 цифр' };
    }

    // Extract components
    const year = parseInt(iin.substring(0, 2));
    const month = parseInt(iin.substring(2, 4));
    const day = parseInt(iin.substring(4, 6));
    const century = parseInt(iin[6]);
    const gender = parseInt(iin[7]);
    const region = parseInt(iin.substring(8, 10));
    const checkDigit = parseInt(iin[11]);

    // Validate century code (1-6)
    if (![1, 2, 3, 4, 5, 6].includes(century)) {
        return { isValid: false, error: 'Неверный код столетия' };
    }

    // Calculate full year
    const fullYear = (century <= 2 ? 18 : century <= 4 ? 19 : 20) * 100 + year;

    // Validate month (1-12)
    if (month < 1 || month > 12) {
        return { isValid: false, error: 'Неверный месяц' };
    }

    // Validate day based on month and year
    const daysInMonth = new Date(fullYear, month, 0).getDate();
    if (day < 1 || day > daysInMonth) {
        return { isValid: false, error: 'Неверный день' };
    }

    // Validate gender code (1-6)
    if (gender < 1 || gender > 6) {
        return { isValid: false, error: 'Неверный код пола' };
    }

    // Validate region code
    const validRegions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
    if (!validRegions.includes(region)) {
        return { isValid: false, error: 'Неверный код региона' };
    }

    // Validate checksum
    const calculatedChecksum = calculateChecksum(iin);
    if (calculatedChecksum === 10 || calculatedChecksum !== checkDigit) {
        return { isValid: false, error: 'Неверная контрольная сумма' };
    }

    // All validations passed
    return {
        isValid: true,
        birthDate: `${fullYear}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        gender: gender % 2 === 0 ? 'female' : 'male',
        region: region
    };
}
