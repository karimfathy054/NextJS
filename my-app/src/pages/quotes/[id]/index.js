export default function Quote({ quoteDetails }) {
  return (
    <div className="container">
      <h1 className="my-5">Quote</h1>
      <h2>{quoteDetails.author}</h2>
      <p>{quoteDetails.quote}</p>
    </div>
  );
}

export async function getStaticPaths() {
  const res = await fetch("https://dummyjson.com/quotes?limit=20");
  const data = await res.json();
  const quotes = data.quotes;
  const paths = quotes.map((quote) => {
    return {
      params: {
        id: quote.id.toString(),
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
  const res = await fetch(`https://dummyjson.com/quotes/${id}`);
  const quoteDetails = await res.json();
  return {
    props: {
      quoteDetails,
    },
  };
}
