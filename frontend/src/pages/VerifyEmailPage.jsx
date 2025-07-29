import { useState } from "react";
import axios from "axios";

const VerifyEmailPage = () => {
  const [status, setStatus] = useState("");
  const params = new URLSearchParams(window.location.search);
  const email = params.get("email");
  const token = params.get("token");

  const handleVerify = async () => {
    try {
      await axios.post("/api/auth/verify-email", { email, token });
      setStatus("Email verified! You can now login.");
    } catch (err) {
      console.error("Verification error:", err);
      setStatus("Invalid or expired link.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 space-y-4">
      <h2 className="text-2xl font-bold mb-4">Verify Email</h2>
      <button onClick={handleVerify} className="btn btn-primary w-full">
        Verify Email
      </button>
      <p>{status}</p>
    </div>
  );
};

export default VerifyEmailPage;
