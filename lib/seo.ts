import type { Metadata } from "next";

/** 站内 canonical 路径：前导 /、trailing slash，中文保持原文（由 metadataBase 统一编码）。 */
export function canonicalPath(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (normalized !== "/" && !normalized.endsWith("/")) return `${normalized}/`;
  return normalized;
}

export function withCanonical(path: string, metadata: Metadata = {}): Metadata {
  return {
    ...metadata,
    alternates: { ...metadata.alternates, canonical: canonicalPath(path) },
  };
}
