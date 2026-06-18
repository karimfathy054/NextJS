import ProductsList from "./products-list";

export default async function Products() {
  const res = await fetch("http://localhost:3000/api/products", {
    cache: "no-store",
  });
  const jsonResponse = await res.json();
  const products = jsonResponse.data || [];
  return <ProductsList initialProducts={products} />;
}
