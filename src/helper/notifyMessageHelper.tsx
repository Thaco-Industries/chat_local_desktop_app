import React from 'react';
import { Slide, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ToastContent() {
  return (
    <ToastContainer
      position="top-center"
      autoClose={6000}
      hideProgressBar
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable={false}
      pauseOnHover={false}
      theme="light"
      transition={Slide}
    />
  );
}

export default ToastContent;
