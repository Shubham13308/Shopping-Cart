import React, { useState, useEffect } from "react";
import {
  Button,
  Card as BootstrapCard,
  Row,
  Col,
  Container,
} from "react-bootstrap";
import "../../css/ui/Card.css";
import { BASEURL } from "../../Auth/Matcher";
import { useDispatch,useSelector } from "react-redux";
import { setOrderCart } from "../../redux/actions/productAction";

const ShimmerCard = () => (
  <div className="shimmer-wrapper">
    <div className="shimmer-card"></div>
    <div className="shimmer"></div>
  </div>
);

const Card = ({ products, loading }) => {
  const [quantities, setQuantities] = useState([]);
  const [orderPlaced, setOrderPlaced] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  

  const dispatch = useDispatch();

  useEffect(() => {
    setQuantities(products.map(() => 0));
    setOrderPlaced(products.map(() => false));
  }, [products]);

  const handleIncrement = (index) => {
    const newQuantities = [...quantities];
    newQuantities[index]++;
    setQuantities(newQuantities);
  };

  const handleDecrement = (index) => {
    const newQuantities = [...quantities];
    if (newQuantities[index] > 0) {
      newQuantities[index]--;
    }
    setQuantities(newQuantities);
  };

  const handleOrderPlaced = (index) => {
    const product = products[index];
    const quantity = quantities[index];

    if (quantity > 0) {
      const newOrderDetails = {
        product_name: product.product_name,
        quantity: quantity,
        price: product.product_price,
      };

      const updatedCartItems = [...cartItems, newOrderDetails];
      setCartItems(updatedCartItems);

      dispatch(setOrderCart(updatedCartItems));
    }

    const newOrderPlaced = [...orderPlaced];
    newOrderPlaced[index] = true;
    setOrderPlaced(newOrderPlaced);
  };


  return (
    <>
      <Container className="pt-4">
        <Row>
          {loading
            ? Array.from({ length: 6 }).map((_, index) => (
                <Col key={index} xs={12} sm={4} md={4} lg={4} xl={4}>
                  <ShimmerCard />
                </Col>
              ))
            : products.map((product, index) => (
                <Col key={index} xs={12} sm={4} md={4} lg={4} xl={4}>
                  <BootstrapCard className="custom-card">
                    <BootstrapCard.Img
                      variant="top"
                      src={`${BASEURL}/uploads/products/${product.product_image}`}
                      alt={product.product_name}
                      style={{
                        width: "200px",
                        height: "200px",
                        objectFit: "cover",
                      }}
                    />
                    <BootstrapCard.Body>
                      <BootstrapCard.Title>
                        {product.product_name}
                      </BootstrapCard.Title>
                      <BootstrapCard.Text>
                        <b>Price</b>: {product.product_price}
                        <br />
                        <span
                          style={{
                            color: product.product_stock < 8 ? "red" : "green",
                          }}
                        >
                          Stock: {product.product_stock}
                        </span>
                      </BootstrapCard.Text>

                      <BootstrapCard.Text>
                        <b>Description</b>: {product.product_description}
                      </BootstrapCard.Text>

                      <div>
                        <Button
                          variant="danger"
                          style={{ width: "49px" }}
                          onClick={() => handleDecrement(index)}
                        >
                          -
                        </Button>
                        <input
                          type="text"
                          value={quantities[index]}
                          readOnly
                          style={{
                            width: "50px",
                            textAlign: "center",
                            height: "38px",
                          }}
                        />
                        <Button
                          variant="info"
                          style={{ width: "49px" }}
                          onClick={() => handleIncrement(index)}
                        >
                          +
                        </Button>
                      </div>

                      <Button
                        variant="success"
                        onClick={() => handleOrderPlaced(index)}
                        disabled={orderPlaced[index]}
                      >
                        {orderPlaced[index] ? "Stock Added" : "Add Stock"}
                      </Button>
                    </BootstrapCard.Body>
                  </BootstrapCard>
                  
                </Col>
              ))}
        </Row>
      </Container>
    </>
  );
};

export default Card;
