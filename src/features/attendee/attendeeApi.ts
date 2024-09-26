import axios from "axios";

export const fetchTotalAttendee = async (token:string | null) => {
    try{
        const response = await axios.post('/api/totalattendeesOrganizer', {}, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    }catch(error){
        throw error;
    }
}