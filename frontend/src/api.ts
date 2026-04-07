import type { District, DistrictListResponse, State } from "./types";

const BASE = ""; // same origin (vite proxy or static mount)

export async function fetchStates(): Promise<State[]> {
  const r = await fetch(`${BASE}/api/states`);
  if (!r.ok) throw new Error("Failed to load states");
  return r.json();
}

export async function fetchDistricts(
  state: string,
  q?: string,
): Promise<DistrictListResponse> {
  const params = new URLSearchParams({ state });
  if (q) params.set("q", q);
  const r = await fetch(`${BASE}/api/districts?${params.toString()}`);
  if (!r.ok) throw new Error("Failed to load districts");
  return r.json();
}

export async function fetchDistrict(leaid: string): Promise<District> {
  const r = await fetch(`${BASE}/api/districts/${leaid}`);
  if (!r.ok) throw new Error("Failed to load district");
  return r.json();
}
