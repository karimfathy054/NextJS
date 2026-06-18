import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container text-center position-absolute top-50 start-50 translate-middle">
      <h1 className="text-danger my-4">404 - Page Not Found</h1>
      <Link href="/products" className="btn btn-secondary">
        Back to Products Page
      </Link>
    </div>
  );
}
