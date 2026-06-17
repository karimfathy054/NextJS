import Navbar from "@/Components/navbar";
import QuotesToast from "@/Components/quotes-toast";
import "@/styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/router";
import { useEffect } from "react";
export default function App({ Component, pageProps }) {
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);
  const router = useRouter();
  const noNavbarRoutes = ["/404"];
  const NoNavbar = noNavbarRoutes.includes(router.pathname);
  return (
    <>
      {!NoNavbar && <Navbar />}
      <Component {...pageProps} />
      <QuotesToast />
    </>
  );
}
