import Image from "next/image";

export default function product({ productDetails }) {
  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Product Details</h2>
      </div>

      <div className="row g-4">
        <div className="col-md-5">
          <div className="card shadow-sm">
            <Image
              src={productDetails.thumbnail}
              width={500}
              height={500}
              className="card-img-top"
              alt="Product Image"
            />
          </div>
        </div>

        <div className="col-md-7">
          <div className="card shadow-sm p-3">
            <h3 className="fw-bold">{productDetails.title}</h3>
            <p className="text-muted">
              Brand: <strong>{productDetails.brand}</strong> | Category:{" "}
              {productDetails.category}
            </p>

            <p>{productDetails.description}</p>

            <div className="mb-3">
              <span className="badge bg-primary tag">beauty</span>
              <span className="badge bg-secondary tag">mascara</span>
            </div>

            <div className="row text-center mb-3">
              <div className="col">
                <div className="fw-bold">Price</div>
                <div>${productDetails.price}</div>
              </div>
              <div className="col">
                <div className="fw-bold">Discount</div>
                <div>{productDetails.discountPercentage}%</div>
              </div>
              <div className="col">
                <div className="fw-bold">Rating</div>
                <div>{productDetails.rating} ⭐</div>
              </div>
              <div className="col">
                <div className="fw-bold">Stock</div>
                <div>{productDetails.stock}</div>
              </div>
            </div>

            <hr />

            <h5>Specifications</h5>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">SKU: {productDetails.id}</li>
              <li className="list-group-item">
                Weight: {productDetails.weight}
              </li>
              <li className="list-group-item">
                Dimensions: {productDetails.dimensions.width} x{" "}
                {productDetails.dimensions.height} x{" "}
                {productDetails.dimensions.depth}
              </li>
              <li className="list-group-item">
                Warranty: {productDetails.warrantyInformation}
              </li>
              <li className="list-group-item">
                Shipping: {productDetails.shippingInformation}
              </li>
              <li className="list-group-item">
                Return Policy: {productDetails.returnPolicy}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <h4 className="mb-3">Customer Reviews</h4>

        <div className="row g-3">
          {productDetails.reviews &&
            productDetails.reviews.map((review, index) => (
              <div className="col-md-4" key={index}>
                <div className="card review-card shadow-sm p-3">
                  <div className="fw-bold">{review.reviewerName}</div>
                  <div className="text-warning">
                    {"★".repeat(review.rating || 0).padEnd(5, "☆")}
                  </div>
                  <p className="mb-1">{review.comment}</p>
                  <small className="text-muted">{review.reviewerEmail}</small>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export async function getStaticPaths() {
  const res = await fetch(`http://localhost:3000/api/products`);
  const { data } = await res.json();
  const products = data;
  const paths = products.map((product) => {
    return {
      params: {
        id: product._id.toString(),
      },
    };
  });
  return {
    paths,
    fallback: "blocking",
  };
}

export async function getStaticProps(context) {
  const { id } = context.params;
  const res = await fetch(`http://localhost:3000/api/products/${id}`);
  const data = await res.json();
  const productDetails = data;
  return {
    props: {
      productDetails,
    },
  };
}
