import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Loader from '../Components/Loader';
import { loginUser } from '../Api/Auth';
import useAuthStore from '../Store/AuthStore';

function SignIn() {
  const [initialLoading, setInitialLoading] = useState(true);
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: 'onBlur',
  });

  useEffect(() => {
    const timer = setTimeout(() => setInitialLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const onSubmit = async (formData) => {
    try {
      const { data } = await loginUser(formData);

      login(data.user);
      navigate('/');
    } catch (err) {
      if (err.response?.status === 422) {
        const serverErrors = err.response.data.errors;

        Object.entries(serverErrors).forEach(([field, messages]) => {
          setError(field, {
            type: 'server',
            message: messages[0],
          });
        });
      }
    }
  };

  if (initialLoading) {
    return <Loader />;
  }

  return (
    <>
      <main className="auth-container">
        <h1 className="auth-title">Sign In</h1>

        <p className="auth-switch">
          Don’t have an account?{' '}
          <Link to="/sign-up">Sign Up</Link>
        </p>

        <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
          <input
            type="email"
            placeholder="Email address"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^\S+@\S+$/,
                message: 'Email is not valid',
              },
            })}
          />
          {errors.email && (
            <p className="form-error">{errors.email.message}</p>
          )}

          <input
            type="password"
            placeholder="Password"
            {...register('password', {
              required: 'Password is required',
            })}
          />
          {errors.password && (
            <p className="form-error">{errors.password.message}</p>
          )}

          <button
            type="submit"
            className="auth-btn"
            disabled={isSubmitting}
          >
            Sign In
          </button>
        </form>
      </main>
    </>
  );
}

export default SignIn;