import Link from "next/link";

export type ServiceCardData = {
  slug: string;
  title: string;
  summary: string;
  imageUrl: string;
  icon: string;
  iconUrl: string;
};

export function ServiceCard({ service }: { service: ServiceCardData }) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        {service.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={service.imageUrl}
            alt={service.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full place-items-center text-4xl">{service.icon || "☀"}</div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-1 flex items-center gap-2">
          {service.iconUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={service.iconUrl} alt="" className="h-6 w-6 object-contain" />
          ) : service.icon ? (
            <span className="text-xl">{service.icon}</span>
          ) : null}
          <h3 className="text-lg font-semibold text-slate-900 group-hover:text-brand-600">
            {service.title}
          </h3>
        </div>
        <p className="flex-1 text-sm text-slate-600">{service.summary}</p>
        <span className="mt-4 text-sm font-semibold text-brand-600">
          Learn more →
        </span>
      </div>
    </Link>
  );
}
