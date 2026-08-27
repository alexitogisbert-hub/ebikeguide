"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "ebg-admin";

export function useAdminMode(): boolean {
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.has("editar")) {
      localStorage.setItem(STORAGE_KEY, "1");
      setAdmin(true);
      return;
    }

    if (params.has("salir-editar")) {
      localStorage.removeItem(STORAGE_KEY);
      setAdmin(false);
      return;
    }

    setAdmin(localStorage.getItem(STORAGE_KEY) === "1");
  }, []);

  return admin;
}
