import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Loader from '../Components/Loader.jsx';
import { registerUser } from '../Api/Auth.jsx';
import useAuthStore from '../Store/AuthStore.jsx';

function SignUp() {
  const [initialLoading, setInitialLoading] = useState(true);
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: 'onBlur',
  });

  const password = watch('password');

  useEffect(() => {
    const timer = setTimeout(() => setInitialLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const onSubmit = async (formData) => {
    try {
      const { repeatPassword, agree, ...userData } = formData;

      const { data } = await registerUser(userData);

      login(data.user);
      navigate('/');
    } catch (err) {
      if (err.response?.status === 422) {
        const message = err.response.data.errors?.body?.[0];

        if (message?.includes('username')) {
          setError('username', {
            type: 'server',
            message: 'Username already exists',
          });
        }

        if (message?.includes('email')) {
          setError('email', {
            type: 'server',
            message: 'Email already exists',
          });
        }
      }
    }
  };

  if (initialLoading) {
    return <Loader />;
  }

  return (
    <>
      <main className="auth-container">
        <h1 className="auth-title">Sign Up</h1>

        <p className="auth-switch">
          Already have an account?{' '}
          <Link to="/sign-in">Sign In</Link>
        </p>

        <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
          <input
            type="text"
            placeholder="Username"
            {...register('username', {
              required: 'Username is required',
              minLength: {
                value: 3,
                message: 'Username must be at least 3 characters',
              },
              maxLength: {
                value: 20,
                message: 'Username must be at most 20 characters',
              },
            })}
          />
          {errors.username && <p className="form-error">{errors.username.message}</p>}

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
          {errors.email && <p className="form-error">{errors.email.message}</p>}

          <input
            type="password"
            placeholder="Password"
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
              maxLength: {
                value: 40,
                message: 'Password must be at most 40 characters',
              },
            })}
          />
          {errors.password && <p className="form-error">{errors.password.message}</p>}

          <input
            type="password"
            placeholder="Repeat Password"
            {...register('repeatPassword', {
              validate: (value) =>
                value === password || 'Passwords do not match',
            })}
          />
          {errors.repeatPassword && (
            <p className="form-error">{errors.repeatPassword.message}</p>
          )}

          <label style={{ textAlign: 'left', fontSize: 14 }}>
            <input
              type="checkbox"
              {...register('agree', {
                required: 'You must agree to personal data processing',
              })}
            />{' '}
            I agree to the processing of personal data
          </label>
          {errors.agree && <p className="form-error">{errors.agree.message}</p>}

          <button
            type="submit"
            className="auth-btn"
            disabled={isSubmitting}
          >
            Sign Up
          </button>
        </form>
      </main>
    </>
  );
}

export default SignUp;