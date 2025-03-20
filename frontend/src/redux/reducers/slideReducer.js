import { createReducer } from "@reduxjs/toolkit";
import { setSlideBar, setSlideBarOption } from "../actions/slideAction";

const initialSlideState = {
  sidebarState: false,
  sidebarOptionState: "",  
};

const slideReducer = createReducer(initialSlideState, (builder) => {
  builder.addCase(setSlideBar, (state, action) => {
    state.sidebarState = action.payload; 
  });
});

const slideOptionReducer = createReducer(initialSlideState, (builder) => {
  builder.addCase(setSlideBarOption, (state, action) => {
    state.sidebarOptionState = action.payload;
  });
});

export { slideReducer, slideOptionReducer };  
