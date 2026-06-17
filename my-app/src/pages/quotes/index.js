export default function Quotes({ initialQuotes }) {
  return (
    <div className="table-responsive container my-5">
      <table className="table table-striped table-hover table-bordered">
        <thead>
          <tr>
            <th scope="col">author</th>
            <th scope="col">quote</th>
          </tr>
        </thead>
        <tbody>
          {initialQuotes?.length === 0 && (
            <tr>
              <td scope="row">No quotes found</td>
            </tr>
          )}
          {initialQuotes?.map((quote) => (
            <tr className="" key={quote.id}>
              <td scope="row">{quote.author}</td>
              <td>{quote.quote}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export async function getStaticProps() {
  const res = await fetch("https://dummyjson.com/quotes?limit=100");
  const data = await res.json();
  return { props: { initialQuotes: data.quotes } };
}
