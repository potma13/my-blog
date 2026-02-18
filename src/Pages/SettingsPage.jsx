import { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Loader from '../Components/Loader';
import useAuthStore from '../Store/AuthStore';
import { getCurrentUser, updateUser } from '../Api/Auth';

function Settings() {
  const navigate = useNavigate();

  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const hydrate = useAuthStore((s) => s.hydrate);
  const logout = useAuthStore((s) => s.logout);

  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingUpdate, setLoadingUpdate] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm();

  const resetForm = useCallback((currentUser) => {
    reset({
      username: currentUser.username,
      email: currentUser.email,
      bio: currentUser.bio || '',
      image: currentUser.image || '',
      password: '',
    });
  }, [reset]);

  useEffect(() => {
    let isMounted = true;
    
    const timer = setTimeout(() => {
      const loadUser = async () => {
        if (!token) {
          navigate('/sign-in');
          return;
        }

        if (user) {
          resetForm(user);
          if (isMounted) setInitialLoading(false);
          return;
        }

        try {
          const { data } = await getCurrentUser(token);
          if (isMounted) {
            hydrate(data.user);
            resetForm(data.user);
          }
        } catch {
          if (isMounted) {
            logout();
            navigate('/sign-in');
          }
        } finally {
          if (isMounted) setInitialLoading(false);
        }
      };

      loadUser();
    }, 300);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [token, user, hydrate, logout, navigate, resetForm]);

  const onSubmit = async (formData) => {
    try {
      setLoadingUpdate(true);

      const updateData = {
        username: formData.username,
        email: formData.email,
        bio: formData.bio,
        image: formData.image,
      };

      if (formData.password) {
        updateData.password = formData.password;
      }

      const { data } = await updateUser(token, updateData);

      hydrate(data.user);

      resetForm(data.user);
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
    } finally {
      setLoadingUpdate(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (initialLoading) {
    return <Loader />;
  }

  return (
    <>
      <main className="settings-container">
        <h1 className="settings-title">Your Settings</h1>

        <form className="settings-form" onSubmit={handleSubmit(onSubmit)}>
          <input
            placeholder="Username"
            {...register('username', { required: 'Username is required' })}
          />
          {errors.username && (
            <p className="form-error">{errors.username.message}</p>
          )}

          <input
            placeholder="Email Address"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^\S+@\S+$/i,
                message: 'Invalid email',
              },
            })}
          />
          {errors.email && (
            <p className="form-error">{errors.email.message}</p>
          )}

          <textarea
            rows="6"
            placeholder="Short bio about you"
            {...register('bio')}
          />

          <input
            placeholder="Avatar image (URL)"
            {...register('image')}
          />

          <button
            type="submit"
            className="settings-btn"
            disabled={loadingUpdate}
          >
            {loadingUpdate ? 'Updating...' : 'Update Settings'}
          </button>
        </form>

        <button onClick={handleLogout} className="logout-btn">
          Or click here to logout
        </button>
      </main>
    </>
  );
}

export default Settings;