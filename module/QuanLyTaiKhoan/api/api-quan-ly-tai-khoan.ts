/*export async function signUpApi(
    email: string,
    cccdCode: string,
    password: string,
    hoTen: string,
    dienThoai: string,
    thuongTru: string,
    ngaySinh: Date,
    trangThai: 'hoatDong'
):Promise<{status: string; message: string, user?: TaiKhoan | null}> {
    try {
        const response = await fetch('http://localhost:8080/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                cccdCode: cccdCode,
                password: password,
                hoTen: hoTen,
                dienThoai: dienThoai,
                thuongTru: thuongTru,
                ngaySinh: ngaySinh,
                trangThai: trangThai
            })
        });

        const data = await response.json();

        return {
            status: data.status === 200 ? 'success' : 'error',
            message: data.message || 'User registered successfully',
            user: data.data || null
        };

    } catch (error) {
        return {
            status: 'error',
            message: error instanceof Error ? error.message : 'Network error occurred',
            user: null
        };
    }
}/*

/*
export async function signInApi(email: string, password: string): Promise<{status: string; message: string, user?: TaiKhoan | null}> {
    try {
        const response = await fetch('http://localhost:8080/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const data = await response.json();

       if (data.status === 200 && data.data && data.data.maTaiKhoan) {
            return {
                status: 'success',
                message: data.message,
                user: {
                    maCanCuoc: data.data.maCanCuoc,
                    email: data.data.email,
                    hoTen: data.data.hoTen,
                    dienThoai: data.data.dienThoai,
                    thuongTru: data.data.thuongTru,
                    ngaySinh: data.data.ngaySinh,
                    ngayTao: data.data.ngayTao,
                    trangThai: data.data.trangThai
                }
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
*/

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
                cccdCode: cccdCode,
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
        //console.log('🔐 Attempting login for email:', email);
        
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        //console.log('🔐 Login response from backend:', data);
        
        // Store tokens in localStorage - check for backend response structure
        if (data.status === 200 && data.data && data.data.accessToken) {
            //console.log('🔐 Storing tokens in localStorage');
            localStorage.setItem('accessToken', data.data.accessToken);
            localStorage.setItem('refreshToken', data.data.refreshToken);
            localStorage.setItem('user', JSON.stringify(data.data.taiKhoanDTO));
            console.log('✅ Tokens stored successfully');
        } else {
            console.warn('⚠️ No tokens to store. Response data:', data);
        }
        
        return {
            status: data.status === 200 ? 'success' : 'error',
            message: data.message,
            data: data.data
        }
    } catch (error) {
        //console.error('💥 Error during login:', error);
        throw error;
    }
};

// Logout
export const logout = async (): Promise<void> => {
    try {
        //console.log('🚪 Logging out user...');
        
        // Clear tokens from storage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        
        // Clear Zustand store
        if (typeof window !== 'undefined') {
            // Clear the persisted Zustand store
            localStorage.removeItem('taikhoan-storage');
        }
        
        //console.log('✅ Logout completed, all data cleared');
        
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
        const user = localStorage.getItem('user');
        const isValid = token !== null && user !== null;
        
        /*console.log('🔍 Authentication check:', {
            hasToken: !!token,
            hasUser: !!user,
            isValid
        });*/
        
        return isValid;
    }
    return false;
};

// Get current user from storage with validation
export const getCurrentUser = () => {
    if (typeof window !== 'undefined' && isAuthenticated()) {
        const userStr = localStorage.getItem('user');
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
        //console.error('Error refreshing token:', error);
        // Clear invalid tokens
        logout();
        return null;
    }
};
