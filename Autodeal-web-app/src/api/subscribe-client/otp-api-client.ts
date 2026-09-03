const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

interface OtpRequest {
  email: string;
}

interface OtpVerificationRequest {
  email: string;
  otp: string;
}

async function otpPostRequest(
  path: string,
  data: OtpRequest | OtpVerificationRequest
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

export function requestOtp(email: string) {
  return otpPostRequest(
    "/api/subscribers/request-otp",
    { email }
  );
}

export function verifyOtp(email: string, otp: string) {
  return otpPostRequest(
    "/api/subscribers/verify-otp",
    { email, otp }
  );
}