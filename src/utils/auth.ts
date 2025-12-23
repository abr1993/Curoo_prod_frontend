import {jwtDecode} from "jwt-decode";

interface JwtPayload {
  accountId: string;
  exp: number;
}

export const isTokenValid = (): boolean => {
  const savedData = localStorage.getItem("token");
  if (!savedData) return false;

  try {
    const { token } = JSON.parse(savedData);
    if (!token) return false;

    const decoded = jwtDecode<JwtPayload>(token);
    return decoded.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};
