import { createAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASEURL } from '../../Auth/Matcher';


export const fetchUserDataRequest = createAction('FETCH_USER_DATA_REQUEST');
export const fetchUserDataSuccess = createAction('FETCH_USER_DATA_SUCCESS');
export const fetchUserDataFailure = createAction('FETCH_USER_DATA_FAILURE');
export const fetchUserData = (token) => {
  return async (dispatch) => {
    dispatch(fetchUserDataRequest());
    try {
      const response = await axios.get(`${BASEURL}/admin/admin-dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(fetchUserDataSuccess(response.data));
    } catch (error) {
      dispatch(fetchUserDataFailure(error.message));
    }
  };
};
