import Link from "next/link";

export type ProductCardData = {
  slug: string;
  title: string;
  summary: string;
  imageUrl: string;
  price: string;
};

export function ProductCard({ product }: { product: ProductCardData }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imageUrl}
            alt={product.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full place-items-center text-4xl">🔆</div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-semibold text-slate-900 group-hover:text-brand-600">
          {product.title}
        </h3>
        <p className="mt-1 flex-1 text-sm text-slate-600">{product.summary}</p>
        {product.price && (
          <span className="mt-3 text-sm font-semibold text-eco-700">{product.price}</span>
        )}
      </div>
    </Link>
  );
}
