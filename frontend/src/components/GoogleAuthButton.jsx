import { GoogleLogin } from "@react-oauth/google";
import { toast } from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore";

export default function GoogleAuthButton() {
  const googleLogin = useAuthStore((state) => state.googleLogin);

  // Success handler
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const token = credentialResponse.credential;
      await googleLogin(token); // store function call
    } catch (err) {
      toast.error("Google login failed. Please try again.");
      console.error("Google login error:", err);
    }
  };

  // Error handler
  const handleGoogleError = () => {
    toast.error("Google Login Failed");
  };

  return (
    <div className="flex justify-center">
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
        shape="pill"
        text="continue_with"
        theme="outline"
        size="large"
      />
    </div>
  );
}
