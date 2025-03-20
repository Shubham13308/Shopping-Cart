import { combineReducers } from 'redux';
import userReducer from './userReducer';
import { slideReducer, slideOptionReducer } from './slideReducer'; 
import { productOrderReducer,productSearchReducer } from './productReducer';
import {customerReducer,customerverifyReducer} from './customerReducer';

const rootReducer = combineReducers({
  user: userReducer,
  sidebar: slideReducer, 
  sidebarOption: slideOptionReducer,
  orderCart:productOrderReducer,
  customerdata:customerReducer,
  customerverify:customerverifyReducer,
  productsearch: productSearchReducer,
});

export default rootReducer;
