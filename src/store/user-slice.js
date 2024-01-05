import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    userToken: null,
    userTokenExpiry: '',
    loginTokenExpiry: '',
    userEmail: '',
    userId: '',
    userIsLoggedIn: false,
    userFavorites: []
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserToken(state, action) {
            state.userToken = action.payload.token;
            state.userTokenExpiry = action.payload.tokenExpiry;
        },
        setLoginToken(state, action) {
            state.userEmail = action.payload.email;
            state.userId = action.payload.userId;
            state.loginTokenExpiry = action.payload.tokenExpiry;
            const currentLoginState = state.userIsLoggedIn;
            state.userIsLoggedIn = !currentLoginState;
        },
        logout(state) {
            state.userEmail = '';
            state.loginTokenExpiry = '';
            state.userId = '';
            state.userIsLoggedIn = false;
            state.userFavorites = [];
        },
        setUserFavorites(state, action) {
            const currentFav = state.userFavorites;
            const newItems = action.payload;
            state.userFavorites = [...currentFav, ...newItems];
        },
        deleteUserFavourite(state, action) {
            const fbId = action.payload;
            console.log('pet Id to delete: ', fbId);
            const newFavorites = state.userFavorites.filter(favItem => {
                return favItem.fbId !== fbId;
            });
            state.userFavorites = newFavorites;
        }
    }
});


export const userActions = userSlice.actions;

export default userSlice;