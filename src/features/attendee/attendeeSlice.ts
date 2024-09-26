import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchTotalAttendee } from './attendeeApi';

type attendeeState = {
    allAttendees: [],
    loading: boolean,
    error: string | null
};

const initialState: attendeeState = {
    allAttendees: [],
    loading: false,
    error: null
};

export const fetchAllAttendees = createAsyncThunk(
    'attendee/fetchAllAttendees', async (token: string | null, { rejectWithValue }) => {
        try{

            const response = await fetchTotalAttendee(token);
            return response;

        }catch(error){
            return rejectWithValue('please try again')
        }
    }
);

const attendeeSlice = createSlice({
    name: 'attendee',
    initialState,
    reducers: {
        
    },
    extraReducers: (builder) => {
        // pending State
        builder.addCase(fetchAllAttendees.pending, (state) => {
            state.loading = true;
            state.error = null;
        });

        // fulfilled state
        builder.addCase(fetchAllAttendees.fulfilled, (state, action: PayloadAction<{total_attendees:[]}>) => {
            state.loading = false;
            state.allAttendees = action.payload.total_attendees;
            state.error = null;
        });

        // rejected state
        builder.addCase(fetchAllAttendees.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })
}});


export default attendeeSlice.reducer;


