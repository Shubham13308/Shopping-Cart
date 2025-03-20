import React, { useEffect, useState } from "react";
import Header from "../Components/UI/Header";
import { useSelector } from "react-redux";
import Sidebar from "../Components/UI/Sidebar";
import Card from "../Components/Product/Card";
import SearchBar from "../Components/UI/SearchBar";
import AddProduct from "../Components/Product/AddProduct";
import CustomerAdd from "../Components/SideBarOption/CustomerAdd";
import axios from "axios";
import { BASEURL } from "../Auth/Matcher";

const MainPage = () => {
  const { sidebarState } = useSelector((state) => state.sidebar);
  const sidebarOptionState = useSelector(
    (state) => state.sidebarOption.sidebarOptionState
  );
  const { searchResult } = useSelector((state) => state.productsearch);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Search Result:", searchResult);
    console.log("Search Type:", searchResult.type);

    if (searchResult.type === "Search") {
      console.log("Using Redux Data:", searchResult);
      setProducts(Array.isArray(searchResult.data) ? searchResult.data : []);
    } else {
      const fetchAllProducts = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`${BASEURL}/product/fetch-product`);
          console.log("API Response:", response.data);
          setProducts(response.data.products || []);
        } catch (error) {
          console.error("Error fetching products:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchAllProducts();
      console.log("Fetching from API...");
    }
  }, [searchResult]);

  return (
    <>
      <Header className="header" />
      {sidebarState && <Sidebar className="sidebar" />}
      <div className="main-content">
        {sidebarOptionState === "" || sidebarOptionState === "Sale" ? (
          <>
            <SearchBar />
            <Card products={Array.isArray(products) ? products : []} loading={loading} />
            {/* Displaying raw products data for debugging */}
            <pre>{JSON.stringify(products, null, 2)}</pre>
          </>
        ) : sidebarOptionState === "Add" ? (
          <AddProduct />
        ) : sidebarOptionState === "AddCustomer" ? (
          <CustomerAdd />
        ) : null}
      </div>
    </>
  );
};

export default MainPage;
