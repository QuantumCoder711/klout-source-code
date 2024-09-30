import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { fetchTotalEvents, fetchCurrentEvent } from './eventApi';


type eventState = {
    events: [],
    currentEvent: {},
    currentEventUUID: string | null,
    loading: boolean,
    error: string | null;
}

const initialState: eventState = {
    events : [],
    currentEvent: {},
    currentEventUUID: null,
    loading: false,
    error: null
};

export const fetchEvents = createAsyncThunk(
    'events/fetchEvents', async(token: string | null, { rejectWithValue }) => {
        try{
            const response = await fetchTotalEvents(token);
            return response;

        }catch(error){
            return rejectWithValue('Failed to fetch events')
        }
    }
);

// export const fetchAllUpcomingEvents = createAsyncThunk(
//     'events/fetchAllUpcomingEvents', async(token: string | null, { rejectWithValue }) => {
//         try{
//             const response = await fetchUpcomingEvents(token);
//             return response;

//         }catch(error){
//             return rejectWithValue('Failed to fetch upcoming events')
//         }
//     }
// );

export const fetchExistingEvent = createAsyncThunk(
    'events/fetchExistingEvent', async({token, eventuuid}: {token: string | null, eventuuid: string | null}, { rejectWithValue }) => {
        try{
            const response = await fetchCurrentEvent(token, eventuuid);
            return response
        }catch(error){
            return rejectWithValue('Failed to fetch Current Event');
        }
    }
) 


const eventSlice = createSlice({
    name: 'events',
    initialState,
    reducers: {
        // handles the current event uuid
        eventUUID(state, action: PayloadAction<string>){
            state.currentEventUUID = action.payload;
        }
    },
    extraReducers: (builder) => {
        // ------------------ for fetchEvents ---------------------
        // fetchEvents pending state
        builder.addCase(fetchEvents.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        // fetchEvents fullfilled state
        builder.addCase(fetchEvents.fulfilled, (state, action: PayloadAction<{data: [], total_events: number}>) => {
            state.loading = false;
            state.events = action.payload.data;
            state.error = null;
        });
        // fetchEvents rejected state
        builder.addCase(fetchEvents.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        
        // -------------------- for fetchExistingEvent -------------------------
        // fetchExistingEvent pending state
        builder.addCase(fetchExistingEvent.pending, (state) =>{
            state.loading = true;
            state.error = null;
        });
        // fetchExistingEvent fulfilled
        builder.addCase(fetchExistingEvent.fulfilled, (state, action: PayloadAction<{data: {}}>) =>{
            state.loading = false;
            state.currentEvent = action.payload.data;
            state.error = null;
        });
        // currentEvent rejected
        builder.addCase(fetchExistingEvent.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })

    }
});

export const { eventUUID } = eventSlice.actions;

export default eventSlice.reducer;
