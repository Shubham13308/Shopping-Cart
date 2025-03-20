import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "../../css/products/CartModal.css";
import axios from "axios";
import { useSelector } from "react-redux";
import OTPVerifyModal from "./OTPVerifyModal";
import { BASEURL } from "../../Auth/Matcher";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CartModal = ({
  showModal = false,
  handleClose = () => {},
  orderCart = [],
}) => {
  const { customerdata = {} } = useSelector(
    (state) => state.customerdata || {}
  );
  const { customerverify = "" } = useSelector(
    (state) => state.customerverify || {}
  );

  const [isRedeemPointsActive, setIsRedeemPointsActive] = useState(false);
  const [showOtpverifyModal, setShowOtpVerifyModal] = useState(false);
  const [loader, setLoader] = useState(false);

  if (!Array.isArray(orderCart)) {
    console.error("Error: orderCart is not an array!");
    return null; 
  }

  const totalPrice = orderCart.reduce(
    (total, item) => total + (item.price || 0) * (item.quantity || 1),
    0
  );

  const redeemPoints = customerdata?.customer_points || 0;
  const finalTotalPrice =
    customerverify === "OTP Verified Successfully"
      ? Math.max(totalPrice - redeemPoints, 0)
      : totalPrice;

  const handleOrderProduct = async () => {
    setLoader(true);
    const points =
      customerverify === "OTP Verified Successfully" ? "Redeemed" : "Add";

    try {
      const response = await axios.post(`${BASEURL}/order/order`, {
        customer_id: customerdata?.customer_id,
        totalprice: finalTotalPrice,
        points: points,
        orderCart: orderCart,
      });

      if (response.status === 200) {
        toast.success("Order placed successfully!");
      }
    } catch (err) {
      console.error("Error submitting order:", err);
      toast.error("Error in submitting order");
    } finally {
      setLoader(false);
    }
  };

  const handleRedeemSwitchChange = async (e) => {
    const isChecked = e?.target?.checked ?? false;
    setIsRedeemPointsActive(isChecked);

    if (isChecked) {
      try {
        const response = await axios.post(`${BASEURL}/otp/sendOtp`, {
          email: customerdata?.customer_email,
        });

        if (response.status === 200) {
          setShowOtpVerifyModal(true);
          toast.success("OTP Sent Successfully");
        } else {
          alert("Failed to send OTP");
        }
      } catch (error) {
        setShowOtpVerifyModal(true);
        console.error("Error in sending OTP:", error);
        alert("Error in sending OTP.");
      }
    }
  };

  const handleShowOtpModal = () => setShowOtpVerifyModal(true);
  const handleCloseOtpModal = () => setShowOtpVerifyModal(false);

  return (
    <>
      <OTPVerifyModal
        show={showOtpverifyModal}
        handleClose={handleCloseOtpModal}
        customerPhone={customerdata?.customer_phn || "N/A"}
      />

      {showModal && (
        <Modal
          show={showModal}
          onHide={handleClose}
          size="lg"
          centered
          scrollable>
          <Modal.Header closeButton className="cart-modal-header">
            <Modal.Title className="cart-modal-title">
              Shopping Cart
            </Modal.Title>
          </Modal.Header>

          <Modal.Body className="cart-modal-body">
            <h5 className="customer-name">
              Customer Name: {customerdata?.customer_name || "N/A"}
            </h5>

            {orderCart.length === 0 ? (
              <p className="empty-cart">Your cart is empty.</p>
            ) : (
              <div>
                <ul className="cart-items">
                  {orderCart.map((item, index) => (
                    <li key={index} className="cart-item">
                      <span className="cart-item-name">
                        {item.product_name} (x{item.quantity})
                      </span>
                      <span className="cart-item-price">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
                <hr />

                {/* Redeem Points Switch */}
                <h5 className="redeem-points">
                  Redeem Points: {redeemPoints}
                  <Form.Check
                    type="switch"
                    id="redeem-switch"
                    label="Use Redeem Points"
                    className="redeem-switch"
                    checked={isRedeemPointsActive}
                    onChange={handleRedeemSwitchChange}
                  />
                </h5>
                <hr />

                <h5 className="total-price">
                  Total:{" "}
                  {customerverify === "OTP Verified Successfully" ? (
                    <>
                      <span
                        style={{
                          textDecoration: "line-through",
                          marginRight: "8px",
                          color: "red",
                        }}>
                        ₹{totalPrice.toFixed(2)}
                      </span>
                      <span>₹{finalTotalPrice.toFixed(2)}</span>
                    </>
                  ) : (
                    <span>₹{totalPrice.toFixed(2)}</span>
                  )}
                </h5>
              </div>
            )}
          </Modal.Body>

          {/* Modal Footer */}
          <Modal.Footer className="cart-modal-footer">
            <Button
              variant="primary"
              onClick={handleOrderProduct}
              className="cart-modal-btn"
              disabled={loader}>
              {loader ? "Processing..." : "Proceed to Checkout"}
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default CartModal;
