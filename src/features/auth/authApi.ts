import axios from "axios";

type loginParams = {
    email: string,
    password: string
}


export const fetchLogin = async ({ email, password }: loginParams) => {
    try {
        const response = await axios.post('/api/login', { email, password }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const fetchUserApi = async (token: string | null) => {
    try {
        const response = await axios.post('/api/profile', {}, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}