"use client";
import { useRouter } from "next/navigation";
import { useState, useDeferredValue, useTransition, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";

export default function ProductsList({ initialProducts }) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [searchString, setSearchString] = useState("");
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("");

  const deferredSearch = useDeferredValue(searchString);
  const [pending, startTransition] = useTransition();

  // Filter and sort products on the client
  const filteredProducts = useMemo(() => {
    let res = [...products];
    if (deferredSearch) {
      res = res.filter((product) =>
        product.title.toLowerCase().includes(deferredSearch.toLowerCase()),
      );
    }
    if (category && category !== "All") {
      res = res.filter((product) => product.category === category);
    }
    if (sortBy === "priceAsc") res = res.sort((a, b) => a.price - b.price);
    if (sortBy === "priceDesc") res = res.sort((a, b) => b.price - a.price);
    if (sortBy === "rateAsc") res = res.sort((a, b) => a.rating - b.rating);
    if (sortBy === "rateDesc") res = res.sort((a, b) => b.rating - a.rating);
    return res;
  }, [products, deferredSearch, category, sortBy]);

  const handleSearch = (e) => {
    setSearchString(e.target.value);
  };

  const handleDelete = (id) => {
    startTransition(async () => {
      const res = await fetch(`http://localhost:3000/api/products/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        // Update local state so the deleted item disappears instantly
        setProducts((prev) => prev.filter((p) => p._id !== id));
        // Tell Next.js to refresh the server cache in the background
        router.refresh();
      }
    });
  };

  return (
    <div className="container">
      <div className="my-4 row">
        <div className="col">
          <input
            type="text"
            className="form-control"
            placeholder="Search"
            onChange={handleSearch}
          />
        </div>
        <div className="col">
          <select
            className="form-select"
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            {Array.from(
              new Set(products.map((product) => product.category)),
            ).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div className="col">
          <select
            className="form-select"
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="">Sort By</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
            <option value="rateAsc">Rating: Low to High</option>
            <option value="rateDesc">Rating: High to Low</option>
          </select>
        </div>
      </div>

      {pending && <h2>Processing...</h2>}

      <div className="row row-cols-auto g-4 justify-content-center">
        {filteredProducts.map((product) => {
          // Fallback key handling if product.id is missing
          const productId = product._id || product.id;

          return (
            <div className="col" key={productId}>
              <div className="card text-start">
                <Image
                  className="card-img-top"
                  src={product.thumbnail}
                  alt={product.title}
                  width={300}
                  height={400}
                  priority={false}
                />
                <div className="card-body">
                  <h4 className="card-title">{product.title}</h4>
                  <p className="card-text">${product.price}</p>
                  <p className="card-text">rating : {product.rating}</p>
                </div>
                <div className="card-footer">
                  <Link
                    href={`/products/${productId}`}
                    className="btn btn-primary"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
