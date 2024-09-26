import axios from "axios";

type loginParams = { 
    email: string,
    password: string
}


export const fetchLogin = async ({ email, password }: loginParams) => {
    try{
        const response = await axios.post('/api/login',{ email, password }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    }catch(error){
        throw error;
    }
}

