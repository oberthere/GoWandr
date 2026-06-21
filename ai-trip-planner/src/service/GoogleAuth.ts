import axios from 'axios';
import { useEffect, useState } from 'react';
import type { TokenResponse } from '@react-oauth/google';

export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture: string;
}

type TokenInfo = Pick<TokenResponse, 'access_token'>;

const AUTH_EVENT = 'auth-changed';

/**
 * Exchanges a Google OAuth token for the user's profile, logs the access
 * token, and persists the profile to localStorage under "user".
 */
export const getUserProfile = async (tokenInfo: TokenInfo): Promise<GoogleUser> => {
  console.log('access token:', tokenInfo.access_token);

  const res = await axios.get<GoogleUser>(
    `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo.access_token}`,
    {
      headers: {
        Authorization: `Bearer ${tokenInfo.access_token}`,
        Accept: 'application/json',
      },
    },
  );

  localStorage.setItem('user', JSON.stringify(res.data));
  window.dispatchEvent(new Event(AUTH_EVENT));
  return res.data;
};

export function getStoredUser(): GoogleUser | null {
  const raw = localStorage.getItem('user');
  return raw ? (JSON.parse(raw) as GoogleUser) : null;
}

export function signOut() {
  localStorage.removeItem('user');
  window.dispatchEvent(new Event(AUTH_EVENT));
}

/**
 * Reactive view of the signed-in user. Re-renders on sign-in / sign-out
 * from anywhere in the app (and across tabs via the storage event).
 */
export function useAuthUser(): GoogleUser | null {
  const [user, setUser] = useState<GoogleUser | null>(() => getStoredUser());

  useEffect(() => {
    const sync = () => setUser(getStoredUser());
    window.addEventListener(AUTH_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(AUTH_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  return user;
}
