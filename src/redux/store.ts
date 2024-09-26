import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { combineReducers } from "redux"; // Import combineReducers
import eventReducer from '../features/event/eventSlice';
import authReducer from '../features/auth/authSlice';
import attendeeReducer from '../features/attendee/attendeeSlice';
import { useDispatch } from 'react-redux';


const authPersistConfig = {
    key: 'auth',
    storage,
    whitelist: ['token']
};

const rootReducer = combineReducers({
    events: eventReducer,
    auth: persistReducer(authPersistConfig, authReducer),
    attendee: attendeeReducer,
});

const store = configureStore({
    reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export const persistor = persistStore(store);

export default store;