import React, { useEffect, useMemo, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { Navbar, Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faBars, faShoppingCart } from '@fortawesome/free-solid-svg-icons'; 
import { useDispatch, useSelector } from 'react-redux'; 
import { fetchUserData  } from '../../redux/actions/userAction';
import ProfileAvatar from './ProfileAvatar';
import { setSlideBar } from '../../redux/actions/slideAction';
import CartModal from '../Modal/CartModal'; 
import CustomerVerifyModal from '../Modal/CustomerVerifyModal';

const Header = ({ cartlength = 0 }) => {
  const token = useMemo(() => localStorage.getItem('token'), []);  
  const dispatch = useDispatch();
  const { loading, data, error } = useSelector(state => state.user);
  const { sidebarState } = useSelector((state) => state.sidebar);
  const {orderCart}=useSelector((state)=>state.orderCart)
  
  const [showCartModal, setShowCartModal] = useState(false); 
  const [showCustomerModal, setShowCustomerModal] = useState(false);

  const handleOpenCustomerModal = () => setShowCustomerModal(true);
  const handleCloseCustomerModal = () => setShowCustomerModal(false);
  const handleSidebarToggle = () => {
    dispatch(setSlideBar(!sidebarState));
  };
  
  const handleCart = () => {
    setShowCartModal(true);  
  };

  const handleCloseModal = () => {
    setShowCartModal(false);  
  };


  useEffect(() => {
    if (token) {
      dispatch(fetchUserData(token));  
    }
  }, [dispatch, token]); 

  return (
    <>
 
      <Navbar className="bg-body-tertiary fixed-top">
        <Container>
          <Button variant="secondary" onClick={handleSidebarToggle}>
            <FontAwesomeIcon icon={faBars} aria-label="Toggle navigation" />
          </Button>
          <Navbar.Toggle />
          
          <Navbar.Collapse className="justify-content-end">
            <Button variant="info" onClick={handleCart}>
              <a className="nav-link" href="#" aria-label="Shopping cart">
                <FontAwesomeIcon icon={faShoppingCart} />
                <span className="badge bg-danger ms-1">{orderCart.length}</span>
              </a>
            </Button>
          
            <Navbar.Text>
              {loading ? (
                <span>Loading...</span>
              ) : error ? (
                <span>Error: {error}</span>
              ) : (
                <>
                  Signed in as: <a href="#login">{data ? data?.data?.admin_username : ''}</a>
                </>
              )}
            </Navbar.Text>
            &nbsp;&nbsp;&nbsp;
            <ProfileAvatar photoUrl={data?.data?.profileImage} />
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <CustomerVerifyModal
        show={showCustomerModal}
        handleClose={handleCloseCustomerModal}
      />
      
      <CartModal showModal={showCartModal} handleClose={handleCloseModal} orderCart={orderCart} />
    </>
  );
};

export default Header;
