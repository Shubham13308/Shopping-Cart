
import { createReducer } from "@reduxjs/toolkit";
import { setCustomerData,setOtpVerified } from '../actions/customerAction';

const initialCustomerState = {
  customerdata: "",
  customerverify:"" 
};
const initialCustomerVerifyState = {
  customerverify: ""
};


const customerReducer = createReducer(initialCustomerState, (builder) => {
  builder.addCase(setCustomerData, (state, action) => {
    state.customerdata = action.payload; 
  });
});

const customerverifyReducer = createReducer(initialCustomerVerifyState, (builder) => {
  builder.addCase(setOtpVerified, (state, action) => {
    state.customerverify = action.payload;
  });
});

export  {customerReducer,customerverifyReducer}; 
