import Modal from "./Modal";

export default function ConfirmDeleteModal({
  open,
  onClose,
  onConfirm,
  title = "Confirm Delete",
  message = "Are you sure you want to delete this item? This action will mark the record as deleted.",
  itemName,
  isDeleting = false,
}) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div style={{ padding: "12px 16px" }}>
        <p style={{ margin: 0, color: "var(--text-secondary)", lineHeight: 1.5 }}>
          {message}
        </p>
        {itemName && (
          <div style={{ marginTop: 12, padding: "8px 12px", background: "var(--bg-hover)", borderRadius: 6, fontWeight: 500 }}>
            {itemName}
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 24 }}>
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isDeleting}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            style={{ background: "var(--danger-600)", borderColor: "var(--danger-600)" }}
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
