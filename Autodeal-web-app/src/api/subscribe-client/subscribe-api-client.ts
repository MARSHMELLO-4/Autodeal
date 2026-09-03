const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

interface SubscribeRequest {
  email: string;
}

async function subscribePostRequest(
  path: string,
  data: SubscribeRequest
) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "Request failed" }));

    throw new Error(error.message || "Request failed");
  }

  return response.json();
}

export function subscribe(email: string) {
  return subscribePostRequest(
    "/api/subscribers/request-otp",
    { email }
  );
}