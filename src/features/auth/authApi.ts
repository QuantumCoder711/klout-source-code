import axios from "axios";
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

type loginParams = {
    email: string,
    password: string
}

export const fetchLogin = async ({ email, password }: loginParams) => {
    try {
        const response = await axios.post(`${apiBaseUrl}/api/login`, { email, password }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        // console.log(response.data);
        return response.data;
    } catch (error) {
        // console.log(error);
        throw error;
    }
}

export const fetchUserApi = async (token: string | null) => {
    try {
        const response = await axios.post(`${apiBaseUrl}/api/profile`, {}, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        console.log("API Profile Response:", response.data);

        // Check if wallet_balance exists in the response
        if (response.data && response.data.wallet_balance !== undefined) {
            // If wallet_balance is directly in the response, add it to the user object
            if (!response.data.user.wallet_balance) {
                response.data.user.wallet_balance = response.data.wallet_balance;
            }
        }

        return response.data;
    } catch (error) {
        throw error;
    }
}