import { useState } from "react";
import { ShipWheelIcon, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Link, useParams } from "react-router";
import useResetPassword from "../hooks/useResetPassword";

const ResetPasswordPage = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { resetPasswordMutation, isPending, isSuccess } = useResetPassword();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      return;
    }
    
    if (newPassword.length < 6) {
      return;
    }
    
    resetPasswordMutation({ token, newPassword });
  };

  return (
    <div
      className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8"
      data-theme="forest"
    >
      <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
        {/* RESET PASSWORD FORM SECTION */}
        <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col">
          {/* LOGO */}
          <div className="mb-4 flex items-center justify-start gap-2">
            <ShipWheelIcon className="size-9 text-primary" />
            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
              Tribeo
            </span>
          </div>

          <div className="w-full">
            {!isSuccess ? (
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <h2 className="text-xl font-semibold">Reset Your Password</h2>
                    <p className="text-sm opacity-70">
                      Enter your new password below
                    </p>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="form-control w-full space-y-2">
                      <label className="label">
                        <span className="label-text">New Password</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="input input-bordered w-full pr-10"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                          minLength={6}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                      <span className="text-xs opacity-60">Must be at least 6 characters</span>
                    </div>

                    <div className="form-control w-full space-y-2">
                      <label className="label">
                        <span className="label-text">Confirm Password</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="input input-bordered w-full pr-10"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                      {confirmPassword && newPassword !== confirmPassword && (
                        <span className="text-xs text-error">Passwords do not match</span>
                      )}
                    </div>

                    <button 
                      type="submit" 
                      className="btn btn-primary w-full" 
                      disabled={isPending || newPassword !== confirmPassword || newPassword.length < 6}
                    >
                      {isPending ? (
                        <>
                          <span className="loading loading-spinner loading-xs"></span>
                          Resetting Password...
                        </>
                      ) : (
                        "Reset Password"
                      )}
                    </button>

                    <div className="text-center mt-4">
                      <Link to="/login" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
                        <ArrowLeft className="size-4" />
                        Back to Sign In
                      </Link>
                    </div>
                  </div>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="alert alert-success">
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Password reset successful!</span>
                </div>

                <div className="space-y-2">
                  <h2 className="text-xl font-semibold">All Set!</h2>
                  <p className="text-sm opacity-70">
                    Your password has been successfully reset. You can now sign in with your new password.
                  </p>
                </div>

                <div className="text-center mt-4 pt-4">
                  <Link to="/login" className="btn btn-primary w-full">
                    Go to Sign In
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* IMAGE SECTION */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
          <div className="max-w-md p-8">
            {/* Illustration */}
            <div className="relative aspect-square max-w-sm mx-auto">
              <img src="/i.png" alt="Password reset illustration" className="w-full h-full" />
            </div>

            <div className="text-center space-y-3 mt-6">
              <h2 className="text-xl font-semibold">Create a Strong Password</h2>
              <p className="opacity-70">
                Choose a secure password to protect your account and continue your language learning journey
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;