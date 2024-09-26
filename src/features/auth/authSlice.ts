import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchLogin } from './authApi';

type authState = {
    token: string | null,
    loading: boolean,
    error: string | null
};

const initialState: authState = {
    token: null,
    loading: false,
    error: null
};

export const login = createAsyncThunk(
    'auth/login', async (credentials: { email: string, password: string }, { rejectWithValue }) => {
        try{

            const response = await fetchLogin(credentials);
            return response.access_token;

        }catch(error: any){
            return rejectWithValue(error.response?.data || 'Login Failed')
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout(state) {
            state.token = null;
        }
    },
    extraReducers: (builder) => {
        // pending state
        builder.addCase(login.pending, (state) => {
            state.loading = true;
            state.error = null;
        });

        // fullfilled state
        builder.addCase(login.fulfilled, (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.token = action.payload;
            state.error = null;
        });

        // reject state
        builder.addCase(login.rejected, (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.error = action.payload;
        })
    }
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;


