import { jwtDecode } from 'jwt-decode';

export const getTokenExpiry = (token: string): boolean => {
  let decodedHeader;
  try {
    decodedHeader = jwtDecode(token, { header: true });
  } catch (error) {
    console.log(error);
    return false;
  }
  if (decodedHeader && decodedHeader.typ === 'JWT') {
    const decodedPayload = jwtDecode(token);
    const isTokenAlive = (decodedPayload.exp ?? 0) - Date.now() / 1000 > 0;
    return isTokenAlive;
  } else {
    return false;
  }
};

export type AditionalPayload = {
  family_name: string;
  given_name: string;
  email: string;
  picture: string;
  iss?: string;
  sub?: string;
  aud?: string[] | string;
  exp?: number;
  nbf?: number;
  iat?: number;
  jti?: string;
};
export const getTokenPayload = (token: string): AditionalPayload | null => {
  let decodedHeader;
  try {
    decodedHeader = jwtDecode(token, { header: true });
  } catch (error) {
    console.log(error);
    return null;
  }
  if (decodedHeader && decodedHeader.typ === 'JWT') {
    const decodedPayload: AditionalPayload = jwtDecode(token);
    return decodedPayload;
  } else {
    return null;
  }
};
