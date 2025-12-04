
export async function resetPasswordApi(email: string): Promise<{status: string; message: string}> {
    try {
        const response = await fetch('http://localhost:8080/api/auth/reset-password', {
             method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
            })
        });

        const data = await response.json();

        return {
            status: data.status === 200 ? 'success' : 'error',
            message: data.message
        };

    }catch (error) {
        return {
            status: 'error',
            message: error instanceof Error ? error.message : 'Network error occurred'
        };
    }
}

export async function updateUserInformationApi(
    maTaiKhoan: number,
    email: string,
    hoTen: string,
    cccdCode: string,
    dienThoai: string,
    thuongTru: string,
    ngaySinh: string
): Promise<{status: string; message: string}> {
    try {
        const response = await fetch('http://localhost:8080/api/auth/update-user-information', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                maTaiKhoan: maTaiKhoan,
                email: email,
                hoTen: hoTen,
                maCanCuoc: cccdCode,
                dienThoai: dienThoai,
                thuongTru: thuongTru,
                ngaySinh: ngaySinh
            })
        });

        const data = await response.json();

        return {
            status: data.status === 200 ? 'success' : 'error',
            message: data.message
        };

    }catch (error) {
        return {
            status: 'error',
            message: error instanceof Error ? error.message : 'Network error occurred'
        };
    }
}

export async function updatePasswordApi(
    maTaiKhoan: number,
    matKhauMoi: string
) : Promise<{status: string; message: string}> {
    try {
        const response = await fetch('http://localhost:8080/api/auth/change-password', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                maTaiKhoan: maTaiKhoan,
                matKhauMoi: matKhauMoi
            })
        });

        const data = await response.json();

        return {
            status: data.status === 200 ? 'success' : 'error',
            message: data.message
        };

    }catch (error) {
         return {
            status: 'error',
            message: error instanceof Error ? error.message : 'Network error occurred'
        };
    }
}

export async function sendGoogleTokenToBackend(token: string): Promise<{status: string; message: string, user?: TaiKhoan | null}> {
    try {
        const response = await fetch('http://localhost:8080/api/auth/login/google', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token })
        });

        const data = await response.json();

        if (data.status === 201) {
            return {
                status: 'success',
                message: 'Login successful',
                user: data.user || null
            };
        } else {
            return {
                status: 'error',
                message: data.message || 'Invalid response from server',
                user: null
            };
        }

    } catch (error) {
        return {
            status: 'error',
            message: error instanceof Error ? error.message : 'Network error occurred'
        };
    }
}

// Authentication API service
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export interface LoginResponse {
    status: 'success' | 'error';
    message: string;
    data: {
        accessToken: string;
        refreshToken: string;
        tokenType: string;
        expiresIn: number;
        taiKhoanDTO: {
            maTaiKhoan: number;
            maCanCuoc: string;
            email: string;
            hoTen: string;
            dienThoai: string;
            thuongTru: string;
            ngaySinh: string;
            trangThai: 'hoatDong' | 'biKhoa';
            token?: string;
        };
    };
}

// Login with email and password
export const login = async (email: string, password: string): Promise<LoginResponse> => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        
        // Store tokens in localStorage - check for backend response structure
        if (data.status === 200 && data.data && data.data.accessToken) {
            localStorage.setItem('accessToken', data.data.accessToken);
            localStorage.setItem('refreshToken', data.data.refreshToken);
            sessionStorage.setItem('user', JSON.stringify(data.data.taiKhoanDTO));
            
            console.log('✅ Login successful - tokens stored:', {
                hasAccessToken: !!localStorage.getItem('accessToken'),
                hasUser: !!sessionStorage.getItem('user'),
                userData: data.data.taiKhoanDTO
            });
        }
        
        return {
            status: data.status === 200 ? 'success' : 'error',
            message: data.message,
            data: data.data
        }
    } catch (error) {
        throw error;
    }
};

// Logout
export const logout = async (): Promise<void> => {
    try {
        
        // Clear tokens from localStorage and user from sessionStorage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        sessionStorage.removeItem('user');
        
        // Clean up any old user data from localStorage (migration)
        localStorage.removeItem('user');
        
        // Clear Zustand store (no longer using persistence)
        if (typeof window !== 'undefined') {
            // Clear any old persisted Zustand store data
            localStorage.removeItem('taikhoan-storage');
        }
        
        // Optionally call backend logout endpoint
        // await fetch(`${API_BASE_URL}/api/auth/logout`, { method: 'POST' });
    } catch (error) {
        console.error('Error during logout:', error);
    }
};

// Check if user is authenticated (both token and user data exist)
export const isAuthenticated = (): boolean => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('accessToken');
        const user = sessionStorage.getItem('user');
        const isValid = token !== null && user !== null;
        
        return isValid;
    }
    return false;
};

// Get current user from sessionStorage with validation
export const getCurrentUser = () => {
    if (typeof window !== 'undefined' && isAuthenticated()) {
        const userStr = sessionStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }
    return null;
};

// Refresh token
export const refreshToken = async (): Promise<string | null> => {
    try {
        const refreshTokenValue = localStorage.getItem('refreshToken');
        if (!refreshTokenValue) {
            throw new Error('No refresh token available');
        }

        const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${refreshTokenValue}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to refresh token');
        }

        const data = await response.json();
        
        if (data.success && data.data.accessToken) {
            localStorage.setItem('accessToken', data.data.accessToken);
            return data.data.accessToken;
        }
        
        throw new Error('Invalid refresh response');
    } catch (error) {
        logout();
        return null;
    }
};

// New API functions for password reset with token
export async function requestPasswordResetApi(email: string): Promise<{status: string; message: string}> {
    try {
        const response = await fetch('http://localhost:8080/api/auth/request-password-reset', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
            })
        });

        const data = await response.json();

        return {
            status: data.status === 200 ? 'success' : 'error',
            message: data.message
        };

    } catch (error) {
        return {
            status: 'error',
            message: error instanceof Error ? error.message : 'Network error occurred'
        };
    }
}

export async function validateResetTokenApi(token: string): Promise<{status: string; message: string}> {
    try {
        const response = await fetch(`http://localhost:8080/api/auth/validate-reset-token?token=${encodeURIComponent(token)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const data = await response.json();

        return {
            status: data.status === 200 ? 'success' : 'error',
            message: data.message
        };

    } catch (error) {
        return {
            status: 'error',
            message: error instanceof Error ? error.message : 'Network error occurred'
        };
    }
}

export async function resetPasswordWithTokenApi(token: string, newPassword: string): Promise<{status: string; message: string}> {
    try {
        const response = await fetch('http://localhost:8080/api/auth/reset-password-with-token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: token,
                newPassword: newPassword
            })
        });

        const data = await response.json();

        return {
            status: data.status === 200 ? 'success' : 'error',
            message: data.message
        };

    } catch (error) {
        return {
            status: 'error',
            message: error instanceof Error ? error.message : 'Network error occurred'
        };
    }
}

// Sign up API function
export async function signUpApi(
    email: string,
    cccdCode: string,
    password: string,
    hoTen: string,
    dienThoai: string,
    thuongTru: string,
    ngaySinh: Date,
    trangThai: string
): Promise<{status: string; message: string; user?: any}> {
    try {
        const response = await fetch('http://localhost:8080/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                maCanCuoc: cccdCode,
                matKhau: password,
                hoTen: hoTen,
                dienThoai: dienThoai,
                thuongTru: thuongTru,
                ngaySinh: ngaySinh.toISOString().split('T')[0], // Format as YYYY-MM-DD
                trangThai: trangThai
            })
        });

        const data = await response.json();

        if (data.status === 201 || data.status === 200) {
            return {
                status: 'success',
                message: data.message || 'Registration successful',
                user: data.data || data.user || null
            };
        } else {
            return {
                status: 'error',
                message: data.message || 'Registration failed'
            };
        }

    } catch (error) {
        return {
            status: 'error',
            message: error instanceof Error ? error.message : 'Network error occurred'
        };
    }
}
