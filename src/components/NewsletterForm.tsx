"use client";

import { useState } from "react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <p className="mt-4 text-sm font-medium text-acc-d">
        ¡Gracias! Revisa tu correo para confirmar la suscripción.
      </p>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
      className="mt-4 flex flex-col gap-2 sm:flex-row"
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="tu@email.com"
        className="w-full flex-1 rounded-full border border-line bg-white px-4 py-2.5 text-sm outline-none focus-visible:border-acc"
      />
      <button
        type="submit"
        className="shrink-0 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white hover:bg-acc-d"
      >
        Suscribirme
      </button>
    </form>
  );
}
