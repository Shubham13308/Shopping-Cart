import { createReducer } from "@reduxjs/toolkit";
import { setOrderCart, setSearchResult } from "../actions/productAction";

const initialOrderState = {
  orderCart: [],
};

const initialSearchState = {
  searchResult: [],
};

const productOrderReducer = createReducer(initialOrderState, (builder) => {
  builder.addCase(setOrderCart, (state, action) => {
    state.orderCart = action.payload;
  });
});

const productSearchReducer = createReducer(initialSearchState, (builder) => {
  builder.addCase(setSearchResult, (state, action) => {
    state.searchResult = action.payload;
  });
});

export { productOrderReducer, productSearchReducer };
