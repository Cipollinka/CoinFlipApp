import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
  gameHeadsCount: 0,
  gameTailsCount: 0,
};

export const saveUserData = createAsyncThunk('user/saveUserData', async (userData) => {
  try {
    await AsyncStorage.setItem('currentUser', JSON.stringify(userData));
  } catch (error) {
    console.error('Error saving user data:', error);
  }
});

export const loadUserData = createAsyncThunk('user/loadUserData', async () => {
  try {
    const storedUser = await AsyncStorage.getItem('currentUser');
    return storedUser ? JSON.parse(storedUser) : initialState;
  } catch (error) {
    console.error('Error loading user data:', error);
    return initialState;
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: (state, action) => {
      return { ...state, ...action.payload };
    },
    updateUserData: (state, action) => {
      return { ...state, ...action.payload };
    },
    resetUserData: () => initialState,
    incrementHeads: (state) => {
      state.gameHeadsCount += 1;
    },
    incrementTails: (state) => {
      state.gameTailsCount += 1;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadUserData.fulfilled, (state, action) => {
      return { ...state, ...action.payload };
    });
  },
});

export const { setUserData, updateUserData, resetUserData, incrementHeads, incrementTails } = userSlice.actions;
export default userSlice.reducer;
