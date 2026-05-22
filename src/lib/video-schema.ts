/**
 * VideoObject JSON-LD helper (SEO / AEO / GEO).
 * Use the returned object inside `head().scripts`.
 */
export type VideoSchemaInput = {
  name: string;
  description: string;
  thumbnailUrl: string | string[];
  uploadDate: string; // ISO date
  contentUrl?: string;
  embedUrl?: string;
  duration?: string; // ISO 8601 e.g. "PT21S"
  transcript?: string;
};

export function videoObjectSchema(v: VideoSchemaInput) {
  return {
    type: "application/ld+json" as const,
    children: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "VideoObject",
      name: v.name,
      description: v.description,
      thumbnailUrl: v.thumbnailUrl,
      uploadDate: v.uploadDate,
      ...(v.contentUrl && { contentUrl: v.contentUrl }),
      ...(v.embedUrl && { embedUrl: v.embedUrl }),
      ...(v.duration && { duration: v.duration }),
      ...(v.transcript && { transcript: v.transcript }),
      publisher: {
        "@type": "Organization",
        name: "Parqueto",
        logo: {
          "@type": "ImageObject",
          url: "https://parqueto.fr/logo.png",
        },
      },
    }),
  };
}
