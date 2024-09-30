import axios from 'axios';

export const fetchAllSponsors = async (token: string | null) => {
    try{
        const response = await axios.post('/api/totalsponsors', {}, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        return response.data;
    }catch(error){
        throw error;
    }
}