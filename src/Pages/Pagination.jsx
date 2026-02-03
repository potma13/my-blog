function Pagination({ total, limit, current, onChange }) {
  const totalPages = Math.ceil(total / limit);
  const pages = Math.min(totalPages, 7);

  return (
    <div className="pagination">
      {Array.from({ length: pages }).map((_, i) => (
        <button
          key={i}
          className={current === i + 1 ? 'active' : ''}
          onClick={() => onChange(i + 1)}
          disabled={current === i + 1}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
}

export default Pagination;