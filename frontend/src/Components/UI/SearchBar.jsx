import React, { useState, useEffect, useRef } from "react";
import { Form, FormControl, Button } from "react-bootstrap";
import CustomerVerifyModal from "../Modal/CustomerVerifyModal";
import { BASEURL } from "../../Auth/Matcher";
import { useDispatch  } from "react-redux";
import { setSearchResult } from "../../redux/actions/productAction"; 

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const debounceRef = useRef(null);
  const dispatch = useDispatch();
  

  const fetchSearchResults = async (searchQuery) => {
    if (!searchQuery.trim()) {
      dispatch(setSearchResult([])); 
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${BASEURL}/product/search?query=${searchQuery}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      dispatch(setSearchResult(data));
    } catch (err) {
      setError(err.message);
      dispatch(setSearchResult([]));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      fetchSearchResults(query);
    }, 1000);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  const handleInputChange = (e) => setQuery(e.target.value);

  return (
    <>
      <CustomerVerifyModal show={showCustomerModal} handleClose={() => setShowCustomerModal(false)} />

      <Form className="d-flex" style={{ marginTop: "65px", alignItems: "center" }}>
        <FormControl
          type="search"
          placeholder="Search for products..."
          className="me-2"
          aria-label="Search"
          value={query}
          onChange={handleInputChange}
        />
        <Button variant="outline-success" type="button" className="me-3" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </Button>
        <Button style={{ width: "98px" }} onClick={() => setShowCustomerModal(true)}>
          Customer
        </Button>
      </Form>
    </>
  );
};

export default SearchBar;
