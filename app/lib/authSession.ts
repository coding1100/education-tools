export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;

  return (
    window.localStorage.getItem("accessToken") ||
    window.localStorage.getItem("token") ||
    window.localStorage.getItem("authToken")
  );
}
