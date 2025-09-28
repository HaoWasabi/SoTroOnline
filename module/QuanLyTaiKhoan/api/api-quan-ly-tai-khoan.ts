export async function signUpApi(
    email: string,
    cccdCode: string,
    password: string,
    hoTen: string,
    dienThoai: string,
    thuongTru: string,
    ngaySinh: Date,
    trangThai: 'hoatDong'
):Promise<{status: string; message: string}> {
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

        if(!response.ok) {
            return {
                status: 'error',
                message: data.message || 'User registration failed'
            };
        }

        return {
            status: data.status === '200' ? 'success' : 'error',
            message: data.message || 'User registered successfully'
        };

    } catch (error) {
        return {
            status: 'error',
            message: error instanceof Error ? error.message : 'Network error occurred'
        };
    }
}

export async function signInApi(email: string, password: string): Promise<{status: string; message: string}> {
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
        console.log(data);

        return {
            status: data.status === '200' ? 'success' : 'error',
            message: data.message
        };

    } catch (error) {
        return {
            status: 'error',
            message: error instanceof Error ? error.message : 'Network error occurred'
        };
    }
}
