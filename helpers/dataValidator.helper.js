const isValidPhone = phoneNbr => {
    const regexPattern = /^62\d{9,13}$/;
    return regexPattern.test(phoneNbr);
};

module.exports = {
    isValidPhone,
};
