import React, { useState } from 'react';
import { BASEURL } from '../../Auth/Matcher';
import { Offcanvas, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
 import {setCustomerData} from '../../redux/actions/customerAction';
const CustomerVerifyModal = ({ show, handleClose }) => {
  const [customerPhoneNumber, setCustomerPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false); 
  
  const dispatch = useDispatch();

  const handleInputChange = (e) => {
    setCustomerPhoneNumber(e.target.value);
  };

  const handleVerify = async () => {
    if (customerPhoneNumber.length !== 10 || isNaN(customerPhoneNumber)) {
      toast.error('Phone number must be exactly 10 digits.');
      return;
    }

    setLoading(true); 

    try {
      const response = await axios.post(`${BASEURL}/customer/verify-customer`, {
        customer_phn: customerPhoneNumber,
      });

      if (response.status === 200) {
        toast.success('Customer verified successfully.');
        dispatch(setCustomerData(response.data.customer)); 
       
        handleClose(); 
      } else {
        toast.error('Customer does not exist.');
      }
    } catch (err) {
      toast.error('An error occurred while verifying the customer.');
    } finally {
      setLoading(false); 
    }
  };

  return (
    <>
      <ToastContainer />
      <Offcanvas show={show} onHide={handleClose} placement="top">
        <Offcanvas.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label style={{ color: 'black' }}>Enter Customer Phone Number</Form.Label>
              <Form.Control
                type="text" 
                placeholder="Enter customer phone number"
                value={customerPhoneNumber}
                onChange={handleInputChange}
                maxLength="10" 
              />
            </Form.Group>
            <Button variant="primary" onClick={handleVerify} disabled={loading}>
              {loading ? 'Verifying...' : 'Verify'}
            </Button>
          </Form>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default CustomerVerifyModal;
