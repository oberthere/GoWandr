import { useEffect, useState } from 'react';
import { getPhotoUrl, getPlaceDetails, pickBestPhoto } from '@/service/GlobalApi';

interface Props {
  query: string;
  /** Tried if `query` returns no usable photo (e.g. a "skyline"-biased query). */
  fallbackQuery?: string;
  className?: string;
  /** Emoji or text shown while loading or when no photo is found. */
  fallback?: string;
  /** Requested image width; larger for heroes, smaller for thumbnails. */
  maxWidthPx?: number;
}

export function PlacePhoto({ query, fallbackQuery, className, fallback = '📍', maxWidthPx }: Props) {
  const [url, setUrl] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    setUrl(null);
    setFailed(false);

    // Try the (possibly biased) query first, then the plain fallback, so a
    // "<city> skyline" search that comes back empty still yields a city photo.
    const queries = fallbackQuery && fallbackQuery !== query ? [query, fallbackQuery] : [query];

    (async () => {
      for (const q of queries) {
        try {
          const res = await getPlaceDetails(q);
          const photoName = pickBestPhoto(res.data.places?.[0]?.photos);
          if (!active) return;
          if (photoName) {
            setUrl(getPhotoUrl(photoName, maxWidthPx));
            return;
          }
        } catch {
          /* try the next query */
        }
      }
      if (active) setFailed(true);
    })();

    return () => {
      active = false;
    };
  }, [query, fallbackQuery, maxWidthPx]);

  if (url && !failed) {
    return (
      <img
        src={url}
        alt={query}
        loading="lazy"
        onError={() => setFailed(true)}
        className={className}
      />
    );
  }

  return (
    <div
      className={`flex items-center justify-center bg-linear-to-br from-sky-400/20 to-indigo-500/20 text-3xl ${className ?? ''}`}
    >
      {fallback}
    </div>
  );
}
