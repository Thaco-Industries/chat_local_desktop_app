import { useState } from 'react';

import { Formik, Field, Form, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useFetchApi } from '../../context/ApiContext';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';
import { EyeSlashIcon } from '../../assets/icons/eye-slash';
import { EyeIcon } from '../../assets/icons/eye';
import { Spinner } from 'flowbite-react';

interface LoginFormValues {
  username: string;
  password: string;
}

const validationSchema = Yup.object({
  username: Yup.string().required('Tên đăng nhập không được để trống!'),
  password: Yup.string().required('Mật khẩu không được để trống!'),
});

const LoginForm = () => {
  const { apiRequest, setToken, loading } = useFetchApi();
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleLogin = async (
    values: LoginFormValues,
    { setErrors }: FormikHelpers<LoginFormValues>
  ) => {
    try {
      const response = await apiRequest('POST', 'auth/login', {
        userName: values.username,
        password: values.password,
      });

      // Lưu token vào cookies
      setToken(response.data);

      // Điều hướng đến trang chủ
      navigate('/');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error?.response?.data?.message || error.message;
        console.error('Error:', errorMessage);

        setErrors({
          password: errorMessage,
        });
      } else {
        console.error('Đã xảy ra lỗi không xác định:', error);
      }
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="w-full tablet:w-[70%] mx-auto">
      <h1 className="mb-5 text-[24px] font-medium text-center">
        Đăng nhập tài khoản
      </h1>
      <Formik
        initialValues={{ username: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={handleLogin}
      >
        {({ values, handleChange, handleBlur }) => (
          <Form>
            <div className="flex flex-col gap-[10px] mb-2">
              <label
                htmlFor="username"
                className="block text-[16px] font-medium text-textBody mt-5 text-start"
              >
                Tên đăng nhập
              </label>
              <div className="relative ">
                <Field
                  name="username"
                  type="text"
                  className="!rounded-lg !bg-background-500 !text-textBody h-xl tablet:h-[60px] outline-none px-[20px] transition-none w-full border-none focus:ring-0 shadow-md"
                  placeholder="Nhập vào tên đăng nhập"
                />
                <ErrorMessage
                  name="username"
                  component="div"
                  className="absolute text-red-500 mt-1 left-0"
                />
              </div>
            </div>

            <div className="flex flex-col gap-[10px]">
              <label
                htmlFor="password"
                className="block text-[16px] font-medium text-textBody mt-5 text-start"
              >
                Mật khẩu
              </label>
              <div className="relative">
                <Field
                  name="password"
                  type={passwordVisible ? 'text' : 'password'}
                  className="!rounded-lg !bg-background-500 !text-textBody h-xl tablet:h-[60px] px-[20px] transition-none w-full border-none outline-none focus:ring-0 shadow-md"
                  placeholder="Nhập vào mật khẩu"
                />
                <div
                  className="absolute inset-y-0 right-0 flex items-center pr-[20px] cursor-pointer"
                  onClick={togglePasswordVisibility}
                >
                  {passwordVisible ? (
                    <EyeIcon className="w-5 h-5" />
                  ) : (
                    <EyeSlashIcon className="w-5 h-5" />
                  )}
                </div>
                <ErrorMessage
                  name="password"
                  component="div"
                  className="absolute text-red-500 mt-1 left-0"
                />
              </div>
            </div>

            <button
              type="submit"
              className="!mt-12 h-xl tablet:h-[60px] !w-full !justify-center items-center !py-3 !bg-primary hover:!bg-primary rounded-md text-[16px] text-white font-semibold"
              disabled={loading}
            >
              {loading ? <Spinner /> : 'Đăng nhập'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default LoginForm;
