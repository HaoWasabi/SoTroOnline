/**
 * Room form validation utilities
 */

export interface RoomValidationErrors {
    room_name?: string;
    room_type?: string;
    address?: string;
    length?: string;
    width?: string;
    rent_price?: string;
    room_status?: string;
}

/**
 * Validates room form data
 * @param formData - The form data to validate
 * @param roomStatus - The selected room status
 * @param language - The current language ('vi' | 'en')
 * @returns Object containing validation errors
 */
export const validateRoomForm = (
    formData: FormData, 
    roomStatus: string, 
    language: 'vi' | 'en'
): RoomValidationErrors => {
    const errors: RoomValidationErrors = {};
    
    const roomName = formData.get('room_name') as string;
    const address = formData.get('address') as string;
    const length = formData.get('length') as string;
    const width = formData.get('width') as string;
    const rentPrice = formData.get('rent_price') as string;

    // Room name validation
    if (!roomName?.trim()) {
        errors.room_name = language === 'vi' ? 'Tên phòng là bắt buộc' : 'Room name is required';
    } else if (roomName.trim().length < 2) {
        errors.room_name = language === 'vi' ? 'Tên phòng phải có ít nhất 2 ký tự' : 'Room name must be at least 2 characters';
    }

    // Address validation
    if (!address?.trim()) {
        errors.address = language === 'vi' ? 'Địa chỉ là bắt buộc' : 'Address is required';
    }

    // Length validation
    if (!length?.trim()) {
        errors.length = language === 'vi' ? 'Chiều dài là bắt buộc' : 'Length is required';
    } else {
        const lengthNum = parseFloat(length);
        if (isNaN(lengthNum) || lengthNum <= 0) {
        errors.length = language === 'vi' ? 'Chiều dài phải là số dương' : 'Length must be a positive number';
        } else if (lengthNum > 1000) {
        errors.length = language === 'vi' ? 'Chiều dài không được vượt quá 1000m' : 'Length cannot exceed 1000m';
        }
    }

        // Width validation
        if (!width?.trim()) {
            errors.width = language === 'vi' ? 'Chiều rộng là bắt buộc' : 'Width is required';
        } else {
            const widthNum = parseFloat(width);
            if (isNaN(widthNum) || widthNum <= 0) {
            errors.width = language === 'vi' ? 'Chiều rộng phải là số dương' : 'Width must be a positive number';
            } else if (widthNum > 1000) {
            errors.width = language === 'vi' ? 'Chiều rộng không được vượt quá 1000m' : 'Width cannot exceed 1000m';
            }
        }

    // Rent price validation
    if (!rentPrice?.trim()) {
        errors.rent_price = language === 'vi' ? 'Giá thuê là bắt buộc' : 'Rent price is required';
    } else {
        const priceNum = parseFloat(rentPrice);
        if (isNaN(priceNum) || priceNum <= 0) {
        errors.rent_price = language === 'vi' ? 'Giá thuê phải là số dương' : 'Rent price must be a positive number';
        } else if (priceNum > 9999999) {
        errors.rent_price = language === 'vi' ? 'Giá thuê không được vượt quá 9,999,999' : 'Rent price cannot exceed 9,999,999';
        }
    }

    // Room status validation
    if (!roomStatus || !['phongTrong', 'hoatDong', 'baoTri'].includes(roomStatus)) {
        errors.room_status = language === 'vi' ? 'Vui lòng chọn trạng thái phòng' : 'Please select a room status';
    }

    return errors;
    };

/**
 * Valid room status values
 */
export const VALID_ROOM_STATUSES = ['phongTrong', 'hoatDong', 'baoTri'] as const;

/**
 * Maximum values for room properties
 */
export const ROOM_VALIDATION_LIMITS = {
    MAX_DIMENSION: 1000, // meters
    MAX_RENT_PRICE: 9999999, // currency units
    MIN_NAME_LENGTH: 2,
} as const;