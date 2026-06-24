"use client";

import { useState } from "react";
import { EnquiryForm } from "./EnquiryForm";

export function FloatingButtons({
  whatsapp,
  companyName,
}: {
  whatsapp?: string;
  companyName: string;
}) {
  const [open, setOpen] = useState(false);

  const waNumber = (whatsapp || "").replace(/[^0-9]/g, "");
  const waLink = waNumber
    ? `https://wa.me/${waNumber}?text=${encodeURIComponent(
        `Hi ${companyName}, I'd like to enquire about solar.`
      )}`
    : "";

  return (
    <>
      {/* Floating action buttons */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
        {waLink && (
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="group flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105"
          >
            <svg viewBox="0 0 32 32" className="h-7 w-7 fill-current" aria-hidden="true">
              <path d="M16 .5C7.4.5.5 7.4.5 16c0 2.8.7 5.4 2.1 7.8L.4 31.5l7.9-2.1c2.3 1.3 4.9 1.9 7.7 1.9 8.6 0 15.5-6.9 15.5-15.5S24.6.5 16 .5zm0 28.2c-2.5 0-4.8-.7-6.9-1.9l-.5-.3-4.7 1.2 1.3-4.6-.3-.5C3.9 20.5 3.2 18.3 3.2 16 3.2 8.9 9 3.2 16 3.2S28.8 8.9 28.8 16 23 28.7 16 28.7zm7.4-9.4c-.4-.2-2.4-1.2-2.7-1.3-.4-.1-.6-.2-.9.2-.3.4-1 1.3-1.3 1.5-.2.3-.5.3-.9.1-.4-.2-1.7-.6-3.2-2-1.2-1.1-2-2.4-2.2-2.8-.2-.4 0-.6.2-.8.2-.2.4-.5.6-.7.2-.3.3-.4.4-.7.1-.3.1-.5 0-.7-.1-.2-.9-2.2-1.3-3-.3-.8-.7-.7-.9-.7h-.8c-.3 0-.7.1-1.1.5-.4.4-1.4 1.4-1.4 3.4s1.5 3.9 1.7 4.2c.2.3 2.9 4.5 7.1 6.3 1 .4 1.8.7 2.4.9 1 .3 1.9.3 2.6.2.8-.1 2.4-1 2.8-2 .3-1 .3-1.8.2-2-.1-.2-.4-.3-.8-.5z" />
            </svg>
          </a>
        )}

        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Raise an enquiry"
          className="flex items-center gap-2 rounded-full bg-brand-500 px-4 py-3 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105"
        >
          <span className="text-lg leading-none">💬</span>
          <span className="hidden sm:inline">Enquire Now</span>
        </button>
      </div>

      {/* Enquiry modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Raise an Enquiry</h2>
                <p className="text-sm text-slate-500">
                  Fill in your details and we&apos;ll get back to you soon.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="grid h-8 w-8 place-items-center rounded-full text-slate-500 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>
            <EnquiryForm source="chat-button" compact />
          </div>
        </div>
      )}
    </>
  );
}
