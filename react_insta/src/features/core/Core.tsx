import React, { useEffect } from 'react';
import Auth from '../auth/Auth';

import styles from "./Core.module.css";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";


// material-ui
import { withStyles } from "@material-ui/core/styles";
import {
  Button,
  Grid,
  Avatar,
  Badge,
  CircularProgress,
  Divider,
} from "@material-ui/core";

// camera icon
import { MdAddAPhoto } from "react-icons/md";

// authSlice import
import {
  editNickname,
  selectProfile,
  selectIsLoadingAuth,
  setOpenSignIn,
  resetOpenSignIn,
  setOpenSignUp,
  setOpenProfile,
  resetOpenProfile,
  fetchAsyncGetMyProf,
  fetchAsyncGetProfs,
} from "../auth/authSlice";

// postSlice import
import {
  selectPosts,
  selectIsLoadingPost,
  setOpenNewPost,
  resetOpenNewPost,
  fetchAsyncGetPosts,
} from "../post/postSlice";

// material-ui badge
const StyledBadge = withStyles((theme) => ({
  badge: {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "6::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "$ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}))(Badge);

const Core: React.FC = () => {
  // dispatch instance
  const dispatch: AppDispatch = useDispatch();
  const profile = useSelector(selectProfile);
  const posts = useSelector(selectPosts);
  const isLoadingPost = useSelector(selectIsLoadingPost);
  const isLoadingAuth = useSelector(selectIsLoadingAuth);

  // browser start
  useEffect(() => {
    const fetchBootLoader = async () => {
      // if user is login, get user information.
      if (localStorage.localJWT) {
        dispatch(resetOpenSignIn());
        const result = await dispatch(fetchAsyncGetMyProf());
        if (fetchAsyncGetMyProf.rejected.match(result)) {
          dispatch(setOpenSignIn());
          return null;
        }
        // get all user information.
        await dispatch(fetchAsyncGetProfs());
        await dispatch(fetchAsyncGetPosts());
      }
    };
    fetchBootLoader();
  }, [dispatch]);

  return (
    <div>
      <Auth />
      <div className={styles.core_header}>
        <h1 className={styles.core_title}>SNS clone</h1>
        {profile?.nickName ? (
          <>
            <button
              className={styles.core_btnModal}
              onClick={() => {
                dispatch(setOpenNewPost());
                dispatch(resetOpenProfile());
              }}
            >
              <MdAddAPhoto />
            </button>
            <div className={styles.core_logout}>
              {(isLoadingPost || isLoadingAuth) && <CircularProgress />}
              <Button
                onClick={() => {
                  localStorage.removeItem("localJWT");
                  dispatch(editNickname(""));
                  dispatch(resetOpenProfile());
                  dispatch(resetOpenNewPost());
                  dispatch(setOpenSignIn());
                }}>
                Logout
              </Button>
            </div>
          </>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};

export default Core