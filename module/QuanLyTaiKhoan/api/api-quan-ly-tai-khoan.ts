export async function signUpApi(
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
}

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
