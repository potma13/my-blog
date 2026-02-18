import { useForm } from 'react-hook-form';

function ArticleForm({ defaultValues, onSubmit, loading, buttonText }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
  });

  return (
    <form className="newpost-form" onSubmit={handleSubmit(onSubmit)}>
      <input
        placeholder="Title"
        {...register('title', { required: 'Title is required' })}
      />
      {errors.title && <p className="form-error">{errors.title.message}</p>}

      <input
        placeholder="Short description"
        {...register('description', { required: 'Description is required' })}
      />
      {errors.description && (
        <p className="form-error">{errors.description.message}</p>
      )}

      <textarea
        rows="6"
        placeholder="Input your text"
        {...register('body', { required: 'Article body is required' })}
      />
      {errors.body && <p className="form-error">{errors.body.message}</p>}

      <button
        type="submit"
        className="publish-btn"
        disabled={loading}
      >
        {loading ? 'Saving...' : buttonText}
      </button>
    </form>
  );
}

export default ArticleForm;