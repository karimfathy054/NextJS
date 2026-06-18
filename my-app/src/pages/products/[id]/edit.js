import ProductForm from "@/Components/product-form";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { useRouter } from "next/router";

export default function EditProductPage({ product }) {
  const router = useRouter();

  const handleSuccess = () => {
    router.push("/products");
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <ProductForm initialData={product} onSuccess={handleSuccess} />
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination:
          "/api/auth/signin?callbackUrl=" +
          encodeURIComponent(context.resolvedUrl),
        permanent: false,
      },
    };
  }

  const { id } = context.params;
  const res = await fetch(`http://localhost:3000/api/products/${id}`);
  const result = await res.json();
  const product = result.data;

  if (!product) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      session,
      product,
    },
  };
}
