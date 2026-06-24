import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-slate-50 p-6 text-center">
      <div>
        <div className="text-7xl">🔆</div>
        <h1 className="mt-4 text-3xl font-bold text-slate-900">Page Not Found</h1>
        <p className="mt-2 text-slate-600">
          Sorry, the page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
        <Link href="/" className="btn-primary mt-6">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
