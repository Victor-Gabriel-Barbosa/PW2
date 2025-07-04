const divMaluca = (texto: string) => <div>{texto}</div>;

export default function Home() {
  return (
    <article>
      <section>
        {
          ["oi", "como", "tudo", "bem"].map(t => divMaluca(t))
        }
      </section>
    </article>
  );
}