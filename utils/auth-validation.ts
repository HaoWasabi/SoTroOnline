export function validateName(name: string): boolean {
    const nameRegex = /^[a-zA-Z\s]+$/;
    return nameRegex.test(name);
}

export function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export function validateCccd(cccd: string): boolean {
    const cccdRegex = /^\d{12}$/;
    return cccdRegex.test(cccd);
}

export function validatePhone(phone: string): boolean {
    const phoneRegex = /^\+?\d{1,4}?\s?\(?\d{1,4}?\)?[\s.-]?\d{1,4}[\s.-]?\d{1,9}$/;
    return phoneRegex.test(phone);
}

export function validateAddress(address: string): boolean {
    return address.trim().length > 0;
}

export function validateDateOfBirth(dateOfBirth: Date | undefined): boolean {
    if (!dateOfBirth) return false;
    const today = new Date();
    return today.getFullYear() - dateOfBirth.getFullYear() >= 18;
}
