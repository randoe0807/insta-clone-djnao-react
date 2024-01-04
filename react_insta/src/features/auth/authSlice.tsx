// Slice of state for authentication

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import axios from "axios";
import { PROPS_AUTHEN, PROPS_PROFILE, PROPS_NICKNAME } from "../types";

const apiUrl = process.env.REACT_APP_API_URL;

// when user access to the site, fetchAsyncGetMyProf is called. retun jwt token.
export const fetchAsyncLogin = createAsyncThunk(
    "auth/post",
    // async , await is used to handle asynchronous(非同期) functions.
    async (authen: PROPS_AUTHEN) => {
        const res = await axios.post(`${apiUrl}authen/jwt/create`, authen, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        // res.data is jwt token.
        return res.data;
    }
);

// when user resist to the site, fetchAsyncGetMyProf is called. return new userinformation.
export const fetchAsyncRegister = createAsyncThunk(
    "auth/register",
    // email, password in PROPS_AUTHEN 
    async (auth: PROPS_AUTHEN) => {
        const res = await axios.post(`${apiUrl}api/register/`, auth, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return res.data;
    }
);

export const fetchAsyncCreateProf = createAsyncThunk(
    "profile/post",
    // profile in PROPS_PROFILE 
    async (nickName: PROPS_NICKNAME) => {
        // new profile model , nickname is not null, img is blank = true.
        const res = await axios.post(`${apiUrl}api/profile/`, nickName, {
            headers: {
                "Content-Type": "application/json",
                // get token from localstorage.
                Authorization: `JWT ${localStorage.localJWT}`,
            },
        });
        return res.data;
    }
);

export const fetchAsyncUpdateProf = createAsyncThunk(
    "profile/put",
    // profile in PROPS_PROFILE 
    async (profile: PROPS_PROFILE) => {
        const uploadData = new FormData();
        // append is add new data to FormData.
        uploadData.append("nickName", profile.nickName);
        profile.img && uploadData.append("img", profile.img, profile.img.name);
        const res = await axios.put(
            `${apiUrl}api/profile/${profile.id}/`,
            uploadData,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `JWT ${localStorage.localJWT}`,
                },
            }
        );
        return res.data;
    }
);

export const fetchAsyncGetProfs = createAsyncThunk("profiles/get", async () => {
    const res = await axios.get(`${apiUrl}api/profile/`, {
        headers: {
            Authorization: `JWT ${localStorage.localJWT}`,
        },
    });
    return res.data;
});

export const fetchAsyncGetMyProf = createAsyncThunk(
    "profile/get",
    async () => {
        const res = await axios.get(`${apiUrl}api/myprofile/`, {
            headers: {
                Authorization: `JWT ${localStorage.localJWT}`,
            },
        });
        return res.data[0];
    });


export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        // openSignIn is login modal control. when user access to the site, login modal is opened.
        openSignIn: true,
        // openSignUp is signup(register) modal control.
        openSignUp: false,
        // openProfile is profile modal control.
        openProfile: false,
        // isLoadingAuth is loading control.
        isLoadingAuth: false,
        // myprofile is Django Profile model data. login user's profile. 
        myprofile: {
            id: 0,
            nickName: "",
            userProfile: 0,
            created_on: "",
            img: "",
        },
        // profiles is list of Django Profile model data 
        profiles: [
            {
                id: 0,
                nickName: "",
                userProfile: 0,
                created_on: "",
                img: "",
            },
        ],
    },
    //   state is the initial state of the slice.
    reducers: {
        fetchCredStart(state) {
            state.isLoadingAuth = true;
        },
        fetchCredEnd(state) {
            state.isLoadingAuth = false;
        },
        setOpenSignIn(state) {
            state.openSignIn = true;
        },
        resetOpenSignIn(state) {
            state.openSignIn = false;
        },
        setOpenSignUp(state) {
            state.openSignUp = true;
        },
        resetOpenSignUp(state) {
            state.openSignUp = false;
        },
        setOpenProfile(state) {
            state.openProfile = true;
        },
        resetOpenProfile(state) {
            state.openProfile = false;
        },
        editNickname(state, action) {
            // action is an object with a payload property
            state.myprofile.nickName = action.payload;
        },
    },

    extraReducers: (builder) => {
        builder.addCase(fetchAsyncLogin.fulfilled, (state, action) => {
            // action.payload is jwt token.
            // GWT's propaty is access and refresh.
            localStorage.setItem("localJWT", action.payload.access);
            });
        builder.addCase(fetchAsyncCreateProf.fulfilled, (state, action) => {
            // action.payload is new user information.
            state.myprofile = action.payload;
            });
        builder.addCase(fetchAsyncGetMyProf.fulfilled, (state, action) => {
            // action.payload is user information.
            state.myprofile = action.payload;
            });
        builder.addCase(fetchAsyncGetProfs.fulfilled, (state, action) => {
            // action.payload is list of user information.
            state.profiles = action.payload;
            });
        builder.addCase(fetchAsyncUpdateProf.fulfilled, (state, action) => {
            // action.payload is new user information.
            state.myprofile = action.payload;
            state.profiles = state.profiles.map((prof) =>
                prof.id === action.payload.id ? action.payload : prof)
            });
        },
    });
export const {
    fetchCredStart,
    fetchCredEnd,
    setOpenSignIn,
    resetOpenSignIn,
    setOpenSignUp,
    resetOpenSignUp,
    setOpenProfile,
    resetOpenProfile,
    editNickname,
} = authSlice.actions;

// ここを定義することでuseSelectorで呼び出せるようになる。
export const selectIsLoadingAuth = (state: RootState) => 
// auth is store.ts, configurestore name.
    state.auth.isLoadingAuth;
export const selectOpenSignIn = (state: RootState) => state.auth.openSignIn;
export const selectOpenSignUp = (state: RootState) => state.auth.openSignUp;
export const selectOpenProfile = (state: RootState) => state.auth.openProfile;
export const selectProfile = (state: RootState) => state.auth.myprofile;
export const selectProfiles = (state: RootState) => state.auth.profiles;

export default authSlice.reducer;
