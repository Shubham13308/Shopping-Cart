import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { setSlideBar,setSlideBarOption } from '../../redux/actions/slideAction';
import ProfileAvatar from './ProfileAvatar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStore, faTag, faArrowTrendUp, faChartSimple, faPerson ,faList,faArrowAltCircleLeft , faUserTie} from '@fortawesome/free-solid-svg-icons';

import { Link, useNavigate } from 'react-router-dom'; 
import '../../css/ui/SideBar.css'

const Sidebar = () => {
  const [show, setShow] = useState(true);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [category] = useState(['Electronics', 'Clothing', 'Books']); 
  const navigate=useNavigate()
  
  const { loading, data, error } = useSelector(state => state.user);
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(setSlideBar(false));
    setShow(false);
  };

  const handleShow = () => {
    setShow(true);
    dispatch(setSlideBar(true));
  };

  const toggleCategory = () => setIsCategoryOpen(!isCategoryOpen);

  const handleCategoryClick = (cat) => {
   
   
  };

  const handleLogout = () => {
    
    localStorage.removeItem('token')
    navigate('/')
  };

  const setPage = (page) => {

    dispatch(setSlideBarOption(page))
    console.log(`Navigating to: ${page}`);
  };

  return (
    <>  
      <Offcanvas
        show={show}
        onHide={handleClose}
        style={{
          width: '300px',  
          maxWidth: '90%', 
        }}
        className="responsive-sidebar"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <ProfileAvatar photoUrl={data?.data?.profileImage} />
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <nav className="sidebar-nav">
            <Link onClick={() => setPage('Sale')}>
              Sale Store <FontAwesomeIcon icon={faStore} />
            </Link>
            <Link  onClick={() => setPage('Add')}>Add Product <FontAwesomeIcon icon={faTag} /></Link>
            <Link  onClick={() => setPage('AddCustomer')}>Add Customer <FontAwesomeIcon icon={faUserTie} />   </Link>
            <Link  onClick={() => setPage('Stock')}> Add Stock <FontAwesomeIcon icon={faArrowTrendUp} /> </Link>
            <Link  onClick={() => setPage('Analytics')}>Analytics <FontAwesomeIcon icon={faChartSimple} /></Link>
            <Link  onClick={() => setPage('Admin')}>Admin <FontAwesomeIcon icon={faPerson} /></Link>
            
            <div className="category-toggle" onClick={toggleCategory}>
              Category <FontAwesomeIcon icon={faList} />
              <i className={`fas ${isCategoryOpen ? 'fa-caret-up' : 'fa-caret-down'} ms-auto`}></i>
            </div>
            
            {isCategoryOpen && (
              <div className="category-list">
                <button type="button" onClick={() => window.location.reload()}>All Products</button>
                {category.length > 0 ? (
                  category.map((cat, index) => (
                    <Link key={index} to={`/category/${cat}`} onClick={() => handleCategoryClick(cat)}>
                      {cat}
                    </Link>
                  ))
                ) : (
                  <p>No categories available</p>
                )}
              </div>
            )}

            <Link to="/logout" onClick={handleLogout}>Logout <FontAwesomeIcon icon={faArrowAltCircleLeft} /></Link>
          </nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Sidebar;
