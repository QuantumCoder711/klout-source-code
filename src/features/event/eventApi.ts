import axios from "axios";

export const fetchTotalEvents = async (token:string | null) => {
    try{
        const response = await axios.post('/api/eventslist', {}, {
            headers: {
                // 'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    }catch(error){
        throw error;
    }
}

export const fetchCurrentEvent = async (token:string | null, eventuuid: string | null) => {
    try{
        const response = await axios.post('/api/display/'+eventuuid, {}, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
        
    }catch(error){
        throw error;
    }
} 

