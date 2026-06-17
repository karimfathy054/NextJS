import Image from "next/image";
import Link from "next/link";
import { useState, useDeferredValue, useTransition, useMemo } from "react";

export default function products({ products }) {
  const [searchString, setSearchString] = useState("");
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("");

  const deffredSearch = useDeferredValue(searchString);

  const [pending, startTransition] = useTransition();

  const filteredProducts = useMemo(() => {
    let res = [...products];
    if (deffredSearch) {
      res = res.filter((product) =>
        product.title.toLowerCase().includes(deffredSearch.toLowerCase()),
      );
    }
    if (category && category !== "All") {
      res = res.filter((product) => product.category === category);
    }
    if (sortBy === "priceAsc") {
      res = res.sort((a, b) => a.price - b.price);
    }
    if (sortBy === "priceDesc") {
      res = res.sort((a, b) => b.price - a.price);
    }
    if (sortBy === "rateAsc") {
      res = res.sort((a, b) => a.rating - b.rating);
    }
    if (sortBy === "rateDesc") {
      res = res.sort((a, b) => b.rating - a.rating);
    }
    return res;
  }, [products, deffredSearch, category, sortBy]);

  const handleSearch = (e) => {
    startTransition(() => {
      setSearchString(e.target.value);
    });
  };

  return (
    <div className="container">
      <div className="my-4 row">
        <div className="col">
          <input
            type="text"
            className="form-control"
            id="exampleInputPassword1"
            placeholder="Search"
            onChange={handleSearch}
          />
        </div>
        <div className="col">
          <select
            className="form-select"
            aria-label="Default select example"
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            {Array.from(
              new Set(products.map((product) => product.category)),
            ).map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div className="col">
          <select
            className="form-select"
            aria-label="Default select example"
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
      {pending && <h2>Loading...</h2>}
      <div className="row row-cols-auto g-4 justify-content-center ">
        {filteredProducts.map((product) => {
          return (
            <div className="col" key={product.id}>
              <div className="card text-start ">
                <Image
                  className="card-img-top"
                  src={product.thumbnail}
                  alt={product.title}
                  width={300}
                  height={400}
                />
                <div className="card-body">
                  <h4 className="card-title">{product.title}</h4>
                  <p className="card-text">${product.price}</p>
                  <p className="card-text">rating : {product.rating}</p>
                </div>
                <div className="card-footer">
                  <Link
                    href={`/products/${product.id}`}
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

export async function getServerSideProps() {
  const res = await fetch("https://dummyjson.com/products?limit=50");
  const data = await res.json();
  const products = data.products;
  return {
    props: {
      products,
    },
  };
}
