import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { fetchTotalEvents, fetchCurrentEvent, addEventApi, allEventAttendeeApi, allAgendasApi, allPendingRequest } from './eventApi';
// import state from "sweetalert/typings/modules/state";


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

type AgendaType = {
    id: number;
    uuid: string;
    event_id: number;
    title: string;
    description: string;
    event_date: string;
    start_time: string;
    start_time_type: string;
    end_time: string;
    end_time_type: string;
    image_path: string;
    created_at: string;
    updated_at: string;
    start_minute_time: string;
    end_minute_time: string;
    position: number;
};

type PendingRequestType = {
    id: number;                              // Unique identifier for the event
    uuid: string;                            // A universally unique identifier
    user_id: number;                         // ID of the user associated with the event
    slug: string;                            // URL-friendly identifier (slug) for the event
    title: string;                           // The title of the event
    description: string;                     // A detailed description of the event
    event_date: string;                      // Date of the event in YYYY-MM-DD format
    location: string;                        // Location ID, which might refer to a specific location in a database
    start_time: string;                      // Start time (hour) in 24-hour format
    start_time_type: "AM" | "PM";            // Time of the day (AM/PM)
    end_time: string;                        // End time (hour) in 24-hour format
    end_time_type: "AM" | "PM";              // Time of the day (AM/PM)
    image: string;                           // URL or path to the event image
    event_venue_name: string;                // The name of the event venue
    event_venue_address_1: string;           // Address line 1 of the event venue
    event_venue_address_2: string;           // Address line 2 of the event venue
    city: string;                            // City of the event
    state: string;                           // State of the event
    country: string;                         // Country of the event
    pincode: string;                         // Pincode for the event location
    google_map_link: string;                 // Google Maps link for the event venue location
    created_at: string;                      // Timestamp when the event was created (ISO 8601 format)
    updated_at: string;                      // Timestamp when the event was last updated (ISO 8601 format)
    status: number;                          // Event status, where 1 typically means active and 0 means inactive
    pdf_path: string;                        // Path to an associated PDF (event brochure, agenda, etc.)
    end_minute_time: string;                 // Minutes part of the event end time
    start_minute_time: string;               // Minutes part of the event start time
    qr_code: string;                         // Path to the event's QR code image
    start_time_format: string;               // Start time in "HH:MM:SS" format (24-hour)
    feedback: number;                        // Feedback status (whether feedback is enabled)
    event_start_date: string;                // The start date of the event (same as `event_date`)
    event_end_date: string;                  // The end date of the event (same as `event_date`)
    why_attend_info: string | null;          // Optional information on why someone should attend
    more_information: string | null;         // Additional information about the event (optional)
    t_and_conditions: string | null;         // Optional terms and conditions for the event
    video_url: string | null;                // Optional video URL related to the event (e.g., promotional video)
};

interface AddEventResponse {
    data: eventType;
}

// Define the state
type eventState = {
    events: eventType[],  // Corrected to hold an array of eventType
    currentEvent: eventType | null,  // Changed to `eventType | null` for consistency
    currentEventUUID: string | null,
    eventAttendee: [],
    agendas: [],
    pendingRequests: PendingRequestType[],
    // pendingRequests: string | null,
    loading: boolean,
    error: string | null;
}

const initialState: eventState = {
    events: [],
    currentEvent: null,  // Initialize as null
    currentEventUUID: null,
    eventAttendee: [],
    agendas: [],
    pendingRequests: [],
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
    async ({ eventuuid, token }: { eventuuid: string | null, token: string | null }, { rejectWithValue }) => {
        try {
            const response = await allEventAttendeeApi(eventuuid, token);
            return response;
        } catch (error) {
            return rejectWithValue('Failed to fetch events');
        }
    }
);

export const fetchAllAgendas = createAsyncThunk(
    'events/allAgendas',
    async ({ id, token }: { id: number, token: string | null }, { rejectWithValue }) => {
        try {
            if (!token) {
                return rejectWithValue('No token provided');
            }
            const response = await allAgendasApi(id, token);
            return response.data;
        } catch (error) {
            return rejectWithValue('Failed to fetch agendas');
        }
    }
);

export const fetchAllPendingUserRequests = createAsyncThunk(
    'events/fetchAllPendingUserRequests',
    async ({ eventuuid, token, user_id }: { eventuuid: string | null, token: string | null, user_id: string | null | number }, { rejectWithValue }) => {
        try {
            const response = await allPendingRequest(eventuuid, token, user_id);
            return response.data;
        } catch (error) {
            return rejectWithValue('Failed to fetch pending requests');
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
            .addCase(allEventAttendee.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            //Adding all cases
            .addCase(fetchAllAgendas.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllAgendas.fulfilled, (state, action) => {
                state.loading = false;
                state.agendas = action.payload.data;
                state.error = null;
            })
            .addCase(fetchAllAgendas.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            //Adding all cases
            .addCase(fetchAllPendingUserRequests.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllPendingUserRequests.fulfilled, (state, action) => {
                state.loading = false;
                state.pendingRequests = action.payload;
                state.error = null;
            })
            .addCase(fetchAllPendingUserRequests.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    }
});

export const { eventUUID } = eventSlice.actions;
// export const selectAgendas = (state: { events: eventState }) => state.events.agendas;

export default eventSlice.reducer;
