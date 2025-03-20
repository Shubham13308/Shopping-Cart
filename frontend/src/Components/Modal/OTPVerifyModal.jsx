import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import "../../css/products/OTPModal.css";
import { useSelector, useDispatch } from "react-redux";
import { BASEURL } from "../../Auth/Matcher";
import { setOtpVerified } from "../../redux/actions/customerAction";

const OTPVerifyModal = ({ show, handleClose, customerPhone }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const { customerdata } = useSelector((state) => state.customerdata);

  const handleInputChange = (e, index) => {
    const value = e.target.value;

    if (/^\d{0,1}$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      setError(""); 

      if (value && index < otp.length - 1) {
        document.getElementById(`otp-input-${index + 1}`).focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && otp[index] === "") {
      if (index > 0) {
        document.getElementById(`otp-input-${index - 1}`).focus();
      }
    }
  };

  const handleVerifyOTP = async () => {
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      setError("OTP must be exactly 6 digits.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${BASEURL}/otp/verifyOTP`, {
        email: customerdata.customer_email,
        otp: otpValue,
      });

      if (response.status === 200) {
        alert("OTP verified successfully!");
        console.log(response.data.message);
        dispatch(setOtpVerified(response.data.message));
        setOtp(["", "", "", "", "", ""]);  // Clear OTP fields after success
        handleClose();
      } else {
        setError(response.data.message || "Failed to verify OTP.");
      }
    } catch (err) {
      console.error("Error verifying OTP:", err);
      setError("An error occurred while verifying OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Verify OTP</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Enter the OTP sent to {customerPhone}</Form.Label>
            <div className="otp-inputs">
              {otp.map((digit, index) => (
                <Form.Control
                  key={index}
                  type="text"
                  id={`otp-input-${index}`}
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleInputChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="otp-input"
                  autoFocus={index === 0}
                />
              ))}
            </div>
            {error && <div className="invalid-feedback">{error}</div>}
          </Form.Group>
          <Button
            variant="primary"
            onClick={handleVerifyOTP}
            disabled={loading}
            className="verify-btn"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default OTPVerifyModal;
