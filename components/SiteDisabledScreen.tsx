// Shown across the whole site (customer + admin) when the administrator has
// turned this site off from the Platform Hub's Access Control panel.

export default function SiteDisabledScreen() {
  return (
    <div className="flex min-h-screen flex-1 items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-8 w-8 text-red-500"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>
        <p className="mt-5 text-xs font-semibold uppercase tracking-widest text-red-500">
          Error 403
        </p>
        <h1 className="mt-1 text-2xl font-bold text-gray-900">Access Denied</h1>
        <p className="mt-3 text-sm text-gray-500">
          This site has been temporarily disabled by the administrator and is
          currently unavailable. Please check back later.
        </p>
      </div>
    </div>
  );
}
