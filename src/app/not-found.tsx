import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-x py-28 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-3 text-4xl text-forest sm:text-5xl">We couldn&apos;t find that page</h1>
      <p className="mt-4 text-stone">The link may be outdated, but the quilting essentials are still here.</p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link href="/" className="btn-primary">Back to Home</Link>
        <Link href="/shop" className="btn-secondary">Shop All</Link>
      </div>
    </section>
  );
}
