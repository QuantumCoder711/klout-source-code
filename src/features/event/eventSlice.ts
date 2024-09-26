import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { fetchTotalEvents } from './eventApi';


type eventState = {
    events: [],
    totalEvents: number,
    loading: boolean,
    error: string | null;
}

const initialState: eventState = {
    events : [],
    totalEvents: 0,
    loading: false  ,
    error: null
};

export const fetchEvents = createAsyncThunk(
    'events/fetchEvents',
    async(token: string | null, { rejectWithValue }) => {
        try{
            const response = await fetchTotalEvents(token);
            return response;

        }catch(error){
            return rejectWithValue('Failed to fetch event')
        }
    }
)


const eventSlice = createSlice({
    name: 'events',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // pending state
        builder.addCase(fetchEvents.pending, (state) => {
            state.loading = true;
            state.error = null;
        });

        // fullfilled state
        builder.addCase(fetchEvents.fulfilled, (state, action: PayloadAction<{data: [], total_events: number}>) => {
            state.loading = false;
            state.events = action.payload.data;
            state.totalEvents = action.payload.total_events;
            state.error = null;
        });

        // rejected state
        builder.addCase(fetchEvents.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

    }
});

export default eventSlice.reducer;
