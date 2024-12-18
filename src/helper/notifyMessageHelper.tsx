import { Slide, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ToastContent() {
  return (
    <ToastContainer
      // bodyClassName="m-0 rounded-[30px]"
      style={{ width: 'unset' }}
      toastStyle={{
        padding: 5,
        borderRadius: 30,
        height: 43,
        minHeight: 35,
      }}
      closeButton={false}
      position="top-center"
      autoClose={false}
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
