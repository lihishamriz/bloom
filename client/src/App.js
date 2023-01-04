import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

import {
  Navbar,
  Store,
  Login,
  SignUp,
  Cart,
  Gallery,
  Club,
  Reviews,
  ContactUs,
  UserActivities,
  AddProduct,
  RemoveProduct
} from './components';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [checkoutProducts, setCheckoutProducts] = useState([]);
  const [sumToPay, setSumToPay] = useState(0);

  const getUserDetails = async () => {
    try {
      const { data } = await axios.get('/auth/user-details');
      const email = data.email;

      if (email) {
        setIsLoggedIn(true);
        if ('admin' === email) {
          setIsAdmin(true);
        }
      } else {
        setIsLoggedIn(false);
        setIsAdmin(false);
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    }
  };

  useEffect(() => {
    getUserDetails();
    const interval = setInterval(() => {
      getUserDetails();
    }, 1000 * 10);
    return () => clearInterval(interval);
  });

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('/products');

      setAllProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      toast.error('An unexpected error occurred');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchCart = async () => {
    try {
      if (!isLoggedIn) {
        return;
      }
      const { data } = await axios.get('/cart');
      setCart(data);
    } catch (error) {
      toast.error('An unexpected error occurred');
    }
  };

  useEffect(() => {
    fetchCart();
  }, [isLoggedIn, allProducts, checkoutProducts]);

  const addToCart = async (productName) => {
    try {
      await axios.put('/cart/add', { productName: productName });
      await fetchCart();
      toast.success('Added to cart');
    } catch (error) {
      toast.error('An unexpected error occurred');
    }
  };

  const removeFromCart = async (product) => {
    try {
      await axios.delete(`/cart/remove/${product.id}`);
      setCart(cart.filter((cartProduct) => cartProduct.id !== product.id));
      const currentIndex = checkoutProducts.indexOf(product.id);
      if (currentIndex !== -1) {
        const newChecked = [...checkoutProducts];
        newChecked.splice(currentIndex, 1);
        setCheckoutProducts(newChecked);
        setSumToPay(sumToPay - parseInt(product.price));
      }
      toast.success('Removed from cart');
    } catch (error) {
      toast.error('An unexpected error occurred');
    }
  };

  return (
    <div>
      <Navbar
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
        cartBadge={cart.length}
      />
      <ToastContainer position="bottom-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<Navigate to="/store" />} />
        <Route
          path="/store"
          element={
            <Store
              isLoggedIn={isLoggedIn}
              allProducts={allProducts}
              filteredProducts={filteredProducts}
              setFilteredProducts={setFilteredProducts}
              addToCart={addToCart}
            />
          }
        />
        <Route
          path="/login"
          element={<Login setIsLoggedIn={setIsLoggedIn} setIsAdmin={setIsAdmin} />}
        />
        <Route path="/sign-up" element={<SignUp />} />
        {isLoggedIn && <Route path="/gallery" element={<Gallery />} />}
        {isLoggedIn && <Route path="/club" element={<Club />} />}
        {isLoggedIn && <Route path="/reviews" element={<Reviews />} />}
        {isLoggedIn && <Route path="/contact-us" element={<ContactUs />} />}
        {isLoggedIn && (
          <Route
            path="/cart"
            element={
              <Cart
                products={cart}
                removeFromCart={removeFromCart}
                checkoutProducts={checkoutProducts}
                setCheckoutProducts={setCheckoutProducts}
                sumToPay={sumToPay}
                setSumToPay={setSumToPay}
              />
            }
          />
        )}
        {isAdmin && (
          <Route
            path="/admin/user-activities"
            element={<UserActivities setIsLoggedIn={setIsLoggedIn} setIsAdmin={setIsAdmin} />}
          />
        )}
        {isAdmin && (
          <Route
            path="/admin/add-product"
            element={<AddProduct setAllProducts={setAllProducts} />}
          />
        )}
        {isAdmin && (
          <Route
            path="/admin/remove-product"
            element={<RemoveProduct allProducts={allProducts} setAllProducts={setAllProducts} />}
          />
        )}
        <Route path="/readme.html" element={<link href="%PUBLIC_URL%/readme.html" />} />
        <Route path="*" element={<Navigate to="/store" />} />
      </Routes>
    </div>
  );
};

export default App;
