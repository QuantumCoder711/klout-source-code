import axios from "axios";

export const fetchTotalEvents = async (token:string | null) => {
    try{
        const response = await axios.post('/api/totalevents', {}, {
            headers: {
                // 'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        console.log(response)
        return response.data;
    }catch(error){
        throw error;
    }
}

