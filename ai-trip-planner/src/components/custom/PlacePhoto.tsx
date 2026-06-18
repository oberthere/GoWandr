import { useEffect, useState } from 'react';
import { getPhotoUrl, getPlaceDetails } from '@/service/GlobalApi';

interface Props {
  query: string;
  className?: string;
  /** Emoji or text shown while loading or when no photo is found. */
  fallback?: string;
}

export function PlacePhoto({ query, className, fallback = '📍' }: Props) {
  const [url, setUrl] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    setUrl(null);
    setFailed(false);

    getPlaceDetails(query)
      .then((res) => {
        const photoName = res.data.places?.[0]?.photos?.[0]?.name;
        if (active && photoName) setUrl(getPhotoUrl(photoName));
        else if (active) setFailed(true);
      })
      .catch(() => active && setFailed(true));

    return () => {
      active = false;
    };
  }, [query]);

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
