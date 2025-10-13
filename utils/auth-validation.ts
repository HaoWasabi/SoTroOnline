export function validateName(name: string): boolean {
    const nameRegex = /^[a-zA-Z\s]+$/;
    return nameRegex.test(name);
}

export function validateEmail(email: string): boolean {
    const trimmedEmail = email.trim();
    if (trimmedEmail.length === 0) {
        return false;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return emailRegex.test(trimmedEmail);
}

export function validateCccd(cccd: string): boolean {

    const trimmedCccd = cccd.trim();
    if (trimmedCccd.length === 0) {
        return false;
    }

    const cccdRegex = /^\d{12}$/;
    return cccdRegex.test(trimmedCccd);
}

export function validatePhone(phone: string): boolean {
    const trimmedPhone = phone.trim();
    
    if (trimmedPhone.length === 0) {
        return false;
    }
    
    const phoneRegex = /^0\d{9}$/;
    return phoneRegex.test(trimmedPhone);
}

export function validateAddress(address: string): boolean {
    return address.trim().length > 0;
}

export function validateDateOfBirth(dateOfBirth: Date | undefined): boolean {
    if (!dateOfBirth) return false;
    const today = new Date();
    return today.getFullYear() - dateOfBirth.getFullYear() < 0 || (today.getFullYear() - dateOfBirth.getFullYear() === 0 && today.getMonth() < dateOfBirth.getMonth()) || (today.getFullYear() - dateOfBirth.getFullYear() === 0 && today.getMonth() === dateOfBirth.getMonth() && today.getDate() < dateOfBirth.getDate());
}

export function validatePassword(password: string): boolean {
    const trimmedPassword = password.trim();
    
    // Check minimum length of 10 characters
    if (trimmedPassword.length < 10) {
        return false;
    }
    
    // Check for at least one letter (a-z or A-Z)
    const hasLetter = /[a-zA-Z]/.test(trimmedPassword);
    
    // Check for at least one number (0-9)
    const hasNumber = /\d/.test(trimmedPassword);
    
    return hasLetter && hasNumber;
}
