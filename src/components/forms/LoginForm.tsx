import { useState } from 'react';

import { Formik, Field, Form, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useFetchApi } from '../../context/ApiContext';
import { useNavigate } from 'react-router-dom';
import { EyeSlashIcon } from '../../assets/icons/eye-slash';
import { EyeIcon } from '../../assets/icons/eye';
import axios from 'axios';

interface LoginFormValues {
  username: string;
  password: string;
}

const validationSchema = Yup.object({
  username: Yup.string().required('Hãy điền tên đăng nhập'),
  password: Yup.string().required('Hãy điền mật khẩu'),
});

const LoginForm = () => {
  const { apiRequest, setToken, loading, error } = useFetchApi();
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
        console.log('Lỗi đăng nhập:', error.response); // Kiểm tra phản hồi lỗi từ API

        if (error.response && error.response.status === 404) {
          setErrors({
            password: 'Tên đăng nhập hoặc mật khẩu không đúng',
          });
        } else {
          setErrors({ password: 'Đã xảy ra lỗi không xác định' });
        }
      } else {
        console.error('Đã xảy ra lỗi không xác định:', error);
      }
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h1 className="mb-5 text-[32px] font-medium text-center">
        Đăng nhập tài khoản
      </h1>
      <Formik
        initialValues={{ username: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={handleLogin}
      >
        {({ values, handleChange, handleBlur }) => (
          <Form>
            <div className="flex flex-col gap-[10px]">
              <label
                htmlFor="username"
                className="block text-base font-medium text-text mt-5 text-start"
              >
                Tên đăng nhập
              </label>
              <Field
                name="username"
                type="text"
                className="!rounded-lg !bg-background-500 !text-[#00000080] h-12 px-10 transition-none w-full"
                placeholder="Nhập vào tên đăng nhập"
              />
              <ErrorMessage
                name="username"
                component="div"
                className="text-red-500 text-sm mt-2 text-start"
              />
            </div>

            <div className="flex flex-col gap-[10px]">
              <label
                htmlFor="password"
                className="block text-base font-medium text-text mt-5 text-start"
              >
                Mật khẩu
              </label>
              <div className="relative">
                <Field
                  name="password"
                  type={passwordVisible ? 'text' : 'password'}
                  className="!rounded-lg !bg-background-500 !text-[#00000080] h-12 px-10 transition-none w-full"
                  placeholder="Nhập vào mật khẩu"
                />
                <div
                  className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                  onClick={togglePasswordVisibility}
                >
                  {passwordVisible ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </div>
              </div>
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500 text-sm mt-2 text-start"
              />
            </div>

            <button
              type="submit"
              className="!mt-12 h-12 !w-full !justify-center items-center !py-3 !bg-primary hover:!bg-primary rounded-md text-[16px] text-white font-semibold"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Đăng nhập'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default LoginForm;
