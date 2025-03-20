import React from "react";
import { Routes, Route } from "react-router-dom";
import Adminloginpage from "../pages/Admin/Adminloginpage";
import Adminregisterpage from "../pages/Admin/Adminregisterpage";
import MainPage from "../pages/MainPage";
import CustomerAdd from "../Components/SideBarOption/CustomerAdd";
import CartModal from "../Components/Modal/CartModal";
// import Loader from "../Components/ui/Loader";
// import Dashboard from "../Pages/MainPage/Dashboard";
// import NotFound from "../Components/ui/NotFound";
// import ProtectedRoutes from "../Auth/ProtectedRoutes";

const RoutesConfig = () => {
  return (
    <Routes>
      
      <Route path="/" element={<Adminloginpage />} />
      <Route path="/register" element={<Adminregisterpage />} />
      <Route path="/dashboard" element={<MainPage />} />
      <Route path="/add-customer" element={<CustomerAdd/>}/>
      <Route path="/cartModal" element={<CartModal/>}/>
      {/* <Route path="/loader" element={<Loader />} />
      <Route path="/not-found" element={<NotFound />} />
       */}
      
      {/* <Route path="/" element={<ProtectedRoutes />}>
        
      </Route> */}

      
      {/* <Route path="/not-found" element={<NotFound />} /> */}
    </Routes>
  );
};

export default RoutesConfig;
