// components/ProductForm.js
import { useActionState } from "react";

export default function ProductForm({ initialData, onSuccess }) {
  async function handleSubmit(prevState, formData) {
    const payload = {
      title: formData.get("title"),
      description: formData.get("description"),
      category: formData.get("category"),
      price: Number(formData.get("price")),
      thumbnail: formData.get("thumbnail"),
    };

    const isEdit = !!initialData;
    if (isEdit) {
      payload.id = initialData._id || initialData.id;
    }

    try {
      const url = isEdit
        ? `http://localhost:3000/api/products/${initialData._id || initialData.id}`
        : "http://localhost:3000/api/products";
      const response = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errData = await response.json();
        return { error: errData.error || "Something went wrong" };
      }

      onSuccess();
      return { success: true, error: null };
    } catch (err) {
      return { error: "Network error occurred" };
    }
  }

  const [state, formAction, isPending] = useActionState(handleSubmit, {
    error: null,
    success: false,
  });

  return (
    <div className="card shadow-sm mx-auto" style={{ maxWidth: "500px" }}>
      <div className="card-body">
        <h3 className="card-title h5 mb-3">
          {initialData ? "Edit Product" : "Add New Product"}
        </h3>

        {state?.error && (
          <div className="alert alert-danger py-2 fs-7" role="alert">
            {state.error}
          </div>
        )}

        <form action={formAction}>
          <div className="mb-3">
            <label className="form-label small fw-bold">Product Title</label>
            <input
              name="title"
              defaultValue={initialData?.title || ""}
              required
              className="form-control"
            />
          </div>

          <div className="mb-3">
            <label className="form-label small fw-bold">Category</label>
            <input
              name="category"
              defaultValue={initialData?.category || ""}
              required
              className="form-control"
              placeholder="e.g. electronics"
            />
          </div>

          <div className="mb-3">
            <label className="form-label small fw-bold">Price</label>
            <input
              name="price"
              type="number"
              step="0.01"
              defaultValue={initialData?.price || ""}
              required
              className="form-control"
            />
          </div>

          <div className="mb-3">
            <label className="form-label small fw-bold">Thumbnail URL</label>
            <input
              name="thumbnail"
              type="url"
              defaultValue={initialData?.thumbnail || ""}
              className="form-control"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="mb-3">
            <label className="form-label small fw-bold">Description</label>
            <textarea
              name="description"
              defaultValue={initialData?.description || ""}
              required
              className="form-control"
              rows="3"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="btn btn-primary w-100"
          >
            {isPending ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Saving...
              </>
            ) : initialData ? (
              "Update Product"
            ) : (
              "Create Product"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
