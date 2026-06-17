import { useEffect, useRef } from "react";

export default function QuotesToast() {
  const toastEl = useRef(null);
  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch(
        `https://dummyjson.com/quotes/${Math.floor(Math.random() * 100)}`,
      );
      const quote = await res.json();
      toastEl.current.querySelector(".toast-body").innerText = quote.quote;
      const bs5 = require("bootstrap/dist/js/bootstrap.bundle.min");
      const toast = new bs5.Toast(toastEl.current);
      toast.show();
    }, 10000);
  }, []);
  return (
    <>
      <div
        aria-live="polite"
        aria-atomic="true"
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "200px" }}
      >
        <div
          className="toast position-absolute bottom-0 end-0"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
          ref={toastEl}
        >
          <div className="toast-header">
            <strong className="me-auto">quotes</strong>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="toast"
              aria-label="Close"
            ></button>
          </div>
          <div className="toast-body"></div>
        </div>
      </div>
    </>
  );
}
