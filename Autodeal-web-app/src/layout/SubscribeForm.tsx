import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Bell, Check, X } from "lucide-react";

import {
  requestOtp,
  verifyOtp,
} from "../api/subscribe-client/otp-api-client";

interface SubscribeFormProps {
  onClose: () => void;
}

const OTP_DURATION = 5 * 60;

const SubscribeForm = ({ onClose }: SubscribeFormProps) => {
  const [email, setEmail] = useState<string>("");
  const [otp, setOtp] = useState<string>("");

  const [otpSent, setOtpSent] = useState<boolean>(false);

  const [timeLeft, setTimeLeft] = useState<number>(OTP_DURATION);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  /*
   * OTP countdown
   */
  useEffect(() => {
    if (!otpSent || timeLeft <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((previous) => {
        if (previous <= 1) {
          clearInterval(timer);
          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [otpSent, timeLeft]);

  /*
   * Format timer as MM:SS
   */
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  /*
   * Request OTP
   */
  const handleEmailSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await requestOtp(email);

      console.log("OTP response:", response);

      setOtpSent(true);
      setTimeLeft(OTP_DURATION);
      setOtp("");

      setSuccess("OTP has been sent to your email.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to send OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * Verify OTP
   */
  const handleOtpSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (timeLeft <= 0) {
      setError("OTP has expired. Please request a new OTP.");
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await verifyOtp(email, otp);

      console.log("OTP verification response:", response);

      setSuccess("Email verified successfully!");

      setTimeout(() => {
        onClose();
      }, 800);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Invalid or expired OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * Email change
   */
  const handleEmailChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setEmail(e.target.value);
  };

  /*
   * OTP change
   */
  const handleOtpChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;

    // Only allow 6 digits
    if (/^\d{0,6}$/.test(value)) {
      setOtp(value);
    }
  };

  /*
   * Go back to email
   */
  const handleChangeEmail = () => {
    setOtpSent(false);
    setOtp("");
    setError("");
    setSuccess("");
    setTimeLeft(OTP_DURATION);
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center sm:px-4 animate-[fadeIn_.2s_ease]"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md overflow-hidden rounded-t-3xl bg-white p-6 pb-safe shadow-2xl sm:rounded-3xl sm:p-7 animate-[sheetUp_.34s_cubic-bezier(.2,.9,.3,1)]"
      >
        {/* Top accent gradient bar */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-maroon-700 via-maroon-500 to-amber-400" aria-hidden="true" />

        {/* Mobile drag handle */}
        <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-slate-200 sm:hidden" />
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="anim-pop hidden h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-maroon-50 text-maroon-600 sm:flex">
              {otpSent ? <Check size={20} /> : <Bell size={20} />}
            </div>

            <div>
              <h2 className="font-display text-2xl font-extrabold tracking-tight text-gray-900">
                {otpSent ? "Verify Your Email" : "Stay Updated"}
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                {otpSent
                  ? `Enter the 6-digit OTP sent to ${email}`
                  : "Get notified whenever a new motorcycle is added to our collection."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="btn-spring ml-4 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="mb-4 rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-600">
            {success}
          </div>
        )}

        {!otpSent ? (
          /*
           * EMAIL FORM
           */
          <form onSubmit={handleEmailSubmit}>
            <div>
              <label
                htmlFor="subscriber-email"
                className="mb-2 block text-sm font-bold text-gray-700"
              >
                Email Address
              </label>

              <input
                id="subscriber-email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={handleEmailChange}
                required
                disabled={loading}
                className="
                  w-full rounded-xl
                  border border-gray-200
                  bg-gray-50
                  px-4 py-3
                  text-sm text-gray-900
                  outline-none
                  transition-all duration-200
                  placeholder:text-gray-400
                  focus:border-[var(--maroon)]
                  focus:ring-2
                  focus:ring-[var(--maroon)]/10
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="
                btn-spring
                mt-5 w-full
                rounded-xl
                bg-gradient-to-br from-maroon-600 to-maroon-800
                px-4 py-3
                text-sm font-bold text-white
                shadow-md shadow-maroon-900/20
                hover:shadow-lg
                disabled:cursor-not-allowed
                disabled:opacity-60
                disabled:saturate-50
              "
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>

            <p className="mt-4 text-center text-xs text-gray-400">
              We'll only email you about new motorcycles.
            </p>
          </form>
        ) : (
          /*
           * OTP FORM
           */
          <form onSubmit={handleOtpSubmit}>
            <div>
              <label
                htmlFor="subscriber-otp"
                className="mb-2 block text-sm font-bold text-gray-700"
              >
                Enter OTP
              </label>

              <input
                id="subscriber-otp"
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={handleOtpChange}
                required
                disabled={loading || timeLeft <= 0}
                className="
                  w-full rounded-xl
                  border border-gray-200
                  bg-gray-50
                  px-4 py-3
                  text-center
                  text-lg
                  font-bold
                  tracking-[0.5em]
                  text-gray-900
                  outline-none
                  transition-all duration-200
                  placeholder:text-gray-400
                  placeholder:tracking-normal
                  focus:border-[var(--maroon)]
                  focus:ring-2
                  focus:ring-[var(--maroon)]/10
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              />
            </div>

            {/* Timer */}
            <div className="mt-4 text-center">
              {timeLeft > 0 ? (
                <p className="text-sm font-semibold text-gray-500">
                  OTP expires in{" "}
                  <span className="font-black text-[var(--maroon)]">
                    {formatTime(timeLeft)}
                  </span>
                </p>
              ) : (
                <p className="text-sm font-semibold text-red-500">
                  OTP expired
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={
                loading ||
                otp.length !== 6 ||
                timeLeft <= 0
              }
              className="
                btn-spring
                mt-5 w-full
                rounded-xl
                bg-gradient-to-br from-maroon-600 to-maroon-800
                px-4 py-3
                text-sm font-bold text-white
                shadow-md shadow-maroon-900/20
                hover:shadow-lg
                disabled:cursor-not-allowed
                disabled:opacity-50
                disabled:saturate-50
              "
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <button
              type="button"
              onClick={handleChangeEmail}
              disabled={loading}
              className="
                btn-spring
                mt-3 w-full
                rounded-xl
                border border-gray-200
                px-4 py-3
                text-sm font-bold
                text-gray-600
                hover:bg-gray-50
                disabled:opacity-50
              "
            >
              Change Email
            </button>

            <p className="mt-4 text-center text-xs text-gray-400">
              Check your inbox and spam folder for the OTP.
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default SubscribeForm;