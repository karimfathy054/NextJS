import Image from "next/image";
import { notFound } from "next/navigation";

// Replaces getStaticPaths
export async function generateStaticParams() {
  const res = await fetch("http://localhost:3000/api/products");
  const { data } = await res.json();

  return data.map((product) => ({
    id: product._id.toString(),
  }));
}

// Fetch function to get product by ID
async function getProductDetails(id) {
  const res = await fetch(`http://localhost:3000/api/products/${id}`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    return null;
  }

  return res.json();
}

export default async function ProductPage({ params }) {
  const { id } = await params;
  const productDetails = await getProductDetails(id);

  if (!productDetails) {
    notFound();
  }

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Product Details</h2>
      </div>

      <div className="row g-4">
        {/* Left Column: Thumbnail Image */}
        <div className="col-md-5">
          <div className="card shadow-sm">
            <Image
              src={productDetails.thumbnail}
              width={500}
              height={500}
              className="card-img-top"
              alt={productDetails.title}
              priority
            />
          </div>
        </div>

        {/* Right Column: Schema Information */}
        <div className="col-md-7">
          <div className="card shadow-sm p-4">
            <h3 className="fw-bold mb-2">{productDetails.title}</h3>

            <div className="mb-3">
              <span className="badge bg-primary text-capitalize me-2">
                {productDetails.category}
              </span>
            </div>

            <p className="text-secondary fs-5 mb-4">
              {productDetails.description}
            </p>

            <hr />

            {/* Specifications List matching database keys */}
            <h5 className="fw-bold mb-3">Specifications</h5>
            <ul className="list-group list-group-flush">
              <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                <span className="text-muted">Product ID (_id)</span>
                <span className="font-monospace text-break">
                  {productDetails._id?.$oid || productDetails._id}
                </span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                <span className="text-muted">Price</span>
                <span className="fw-bold text-success fs-5">
                  ${productDetails.price?.toFixed(2)}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
