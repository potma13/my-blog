function ConfirmModal({ onConfirm, onCancel, loading }) {
  return (
    <div className="modal-overlay"
    onClick={onCancel}>
      <div className="modal"
      onClick={(e) => e.stopPropagation()}>
        <h3>Delete Article</h3>
        <p>Are you sure you want to delete this article?</p>

        <div className="modal-actions">
          <button onClick={onCancel} className="modal-cancel">
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="modal-delete"
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;