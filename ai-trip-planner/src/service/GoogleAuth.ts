import axios from 'axios';
import type { TokenResponse } from '@react-oauth/google';

export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture: string;
}

type TokenInfo = Pick<TokenResponse, 'access_token'>;

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
  return res.data;
};

export function getStoredUser(): GoogleUser | null {
  const raw = localStorage.getItem('user');
  return raw ? (JSON.parse(raw) as GoogleUser) : null;
}
