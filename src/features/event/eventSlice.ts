import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { fetchTotalEvents, fetchCurrentEvent, addEventApi, allEventAttendeeApi } from './eventApi';


type eventType = {
    id: number,
    uuid: string,
    user_id: number,
    slug: string,
    title: string,
    description: string,
    event_date: string,
    location: string,
    start_time: string,
    start_time_type: string,
    end_time: string,
    end_time_type: string,
    image: string,
    event_venue_name: string,
    event_venue_address_1: string,
    event_venue_address_2: string,
    city: string,
    state: string,
    country: string,
    pincode: string,
    google_map_link: string,
    created_at: string,
    updated_at: string,
    status: number,
    end_minute_time: string,
    start_minute_time: string,
    qr_code: string,
    start_time_format: string,
    feedback: number,
    event_start_date: string,
    event_end_date: string,
    why_attend_info: string,
    more_information: string,
    t_and_conditions: string,
    pdf_path: string,
    total_attendee: number,
    total_accepted: number,
    total_not_accepted: number,
    total_rejected: number,
    total_checkedin: number,
    total_checkedin_speaker: number,
    total_checkedin_sponsor: number,
    total_pending_delegate: number
}

interface AddEventResponse {
    data: eventType;
}

// Define the state
type eventState = {
    events: eventType[],  // Corrected to hold an array of eventType
    currentEvent: eventType | null,  // Changed to `eventType | null` for consistency
    currentEventUUID: string | null,
    eventAttendee: [],
    loading: boolean,
    error: string | null;
}

const initialState: eventState = {
    events: [],
    currentEvent: null,  // Initialize as null
    currentEventUUID: null,
    eventAttendee: [],
    loading: false,
    error: null
};

// Async thunks
export const fetchEvents = createAsyncThunk<{ data: eventType[], total_events: number }, string | null>(
    'events/fetchEvents', 
    async (token, { rejectWithValue }) => {
        try {
            const response = await fetchTotalEvents(token);
            return response;
        } catch (error) {
            return rejectWithValue('Failed to fetch events');
        }
    }
);

export const fetchExistingEvent = createAsyncThunk(
    'events/fetchExistingEvent', 
    async ({ token, eventuuid }: { token: string | null, eventuuid: string | null }, { rejectWithValue }) => {
        try {
            const response = await fetchCurrentEvent(token, eventuuid);
            return response;
        } catch (error) {
            return rejectWithValue('Failed to fetch Current Event');
        }
    }
);

export const addNewEvent = createAsyncThunk<AddEventResponse, { eventData: FormData, token: string | null }>(
    'events/addNewEvent',
    async ({ eventData, token }, { rejectWithValue }) => {
        try {
            return await addEventApi(eventData, token);
        } catch (error) {
            return rejectWithValue('Failed to add new event');
        }
    }
);

export const allEventAttendee = createAsyncThunk(
    'events/allEventAttendee', 
    async ({eventuuid, token} : { eventuuid: string | null, token: string | null }, { rejectWithValue }) => {
        try {
            const response = await allEventAttendeeApi(eventuuid, token);
            return response;
        } catch (error) {
            return rejectWithValue('Failed to fetch events');
        }
    }
);

// Create a slice
const eventSlice = createSlice({
    name: 'events',
    initialState,
    reducers: {
        eventUUID(state, action: PayloadAction<string>) {
            state.currentEventUUID = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchEvents.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchEvents.fulfilled, (state, action) => {
            state.loading = false;
            state.events = action.payload.data;
            state.error = null;
        })
        .addCase(fetchEvents.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })
        .addCase(fetchExistingEvent.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchExistingEvent.fulfilled, (state, action) => {
            state.loading = false;
            state.currentEvent = action.payload.data;
            state.error = null;
        })
        .addCase(fetchExistingEvent.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })
        .addCase(addNewEvent.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(addNewEvent.fulfilled, (state, action) => {
            state.loading = false;
            if (action.payload.data) {
                state.events.push(action.payload.data);
            }
            state.error = null;
        })
        .addCase(addNewEvent.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })
        .addCase(allEventAttendee.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(allEventAttendee.fulfilled, (state, action) => {
            state.loading = false;
            state.eventAttendee = action.payload.data;
            state.error = null;
        })
        .addCase(allEventAttendee.rejected, (state,action) => {
            state.loading = false;
            state.error = action.payload as string;
        })
    }
});

export const { eventUUID } = eventSlice.actions;

export default eventSlice.reducer;
