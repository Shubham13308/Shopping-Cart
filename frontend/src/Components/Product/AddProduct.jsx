import React, { useState, useRef } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { BASEURL } from '../../Auth/Matcher';
import { useNavigate } from 'react-router-dom';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import '../../css/products/AddProduct.css';

const AddProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    product_name: '',
    product_category: '',
    product_description: '',
    product_price: '',
    product_stock: '',
    product_image: null, 
  });

  const scrollableRef = useRef(null);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleImageChange = (e) => {
    const { files } = e.target;
    if (files.length > 0) {
      setFormData({ ...formData, product_image: files[0] });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formDataToSubmit = new FormData(); 
    formDataToSubmit.append('product_name', formData.product_name);
    formDataToSubmit.append('product_category', formData.product_category);
    formDataToSubmit.append('product_description', formData.product_description);
    formDataToSubmit.append('product_price', formData.product_price);
    formDataToSubmit.append('product_stock', formData.product_stock);
    if (formData.product_image) {
      formDataToSubmit.append('product_image', formData.product_image);
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found in localStorage');
      }
      const response = await axios.post(
        `${BASEURL}/product/add-product`,
        formDataToSubmit,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const productname = response?.data?.data?.product_name;
      toast.success(`${formData.product_name} added successfully!`);

      setFormData({
        product_name: '',
        product_category: '',
        product_description: '',
        product_price: '',
        product_stock: '',
        product_image: null, 
      });
    } catch (error) {
      toast.error('Error adding product');
      console.error('Error adding product:', error);
    }
  };

  const handleScroll = (event) => {
    const { deltaY } = event;
    if (scrollableRef.current) {
      scrollableRef.current.scrollBy({
        top: deltaY,
        behavior: 'smooth',
      });
    }
  };

  return (
    <main className="add-product-container">
      <ToastContainer />
      <div className="form-container" ref={scrollableRef} onWheel={handleScroll}>
        <h2 className="form-title">Add New Product</h2>
        <form onSubmit={handleSubmit}>
          <Col xs={6} md={4}>
            {/* Display image preview if image is selected */}
            {formData.product_image && (
              <Image
                src={URL.createObjectURL(formData.product_image)}
                thumbnail
                alt="Product Preview"
              />
            )}
          </Col>

          <div className="form-group">
            <label>Product Name</label>
            <input
              type="text"
              className="form-control"
              id="product_name"
              value={formData.product_name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Product Category</label>
            <select
              className="form-control"
              id="product_category"
              value={formData.product_category}
              onChange={handleInputChange}
              required
            >
           
              <option value="">Select a category</option>
              {['Electronics', 'Clothing', 'Books','Home','Toys','Accessories','Wearables'].map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              className="form-control"
              id="product_description"
              rows="3"
              value={formData.product_description}
              onChange={handleInputChange}
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label>Price ($)</label>
            <input
              type="number"
              className="form-control"
              id="product_price"
              value={formData.product_price}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Stock</label>
            <input
              type="number"
              className="form-control"
              id="product_stock"
              value={formData.product_stock}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Product Image</label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Add Product
          </button>
        </form>
      </div>
    </main>
  );
};

export default AddProduct;
