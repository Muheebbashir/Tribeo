import { useState } from "react";
import { ShipWheelIcon, ArrowLeft } from "lucide-react";
import { Link } from "react-router";
import useForgotPassword from "../hooks/useForgotPassword";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const { forgotPasswordMutation, isPending, isSuccess } = useForgotPassword();

  const handleSubmit = async (e) => {
    e.preventDefault();
    forgotPasswordMutation(email);
  };

  return (
    <div
      className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8"
      data-theme="forest"
    >
      <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
        {/* FORGOT PASSWORD FORM SECTION */}
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
                    <h2 className="text-xl font-semibold">Forgot Password?</h2>
                    <p className="text-sm opacity-70">
                      No worries! Enter your email and we'll send you reset instructions
                    </p>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="form-control w-full space-y-2">
                      <label className="label">
                        <span className="label-text">Email</span>
                      </label>
                      <input
                        type="email"
                        placeholder="john@gmail.com"
                        className="input input-bordered w-full"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>

                    <button type="submit" className="btn btn-primary w-full" disabled={isPending}>
                      {isPending ? (
                        <>
                          <span className="loading loading-spinner loading-xs"></span>
                          Sending...
                        </>
                      ) : (
                        "Send Reset Link"
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
                  <span>Check your email for reset instructions!</span>
                </div>

                <div className="space-y-2">
                  <h2 className="text-xl font-semibold">Email Sent!</h2>
                  <p className="text-sm opacity-70">
                    We've sent a password reset link to <span className="font-semibold">{email}</span>
                  </p>
                  <p className="text-sm opacity-70">
                    Please check your inbox and follow the instructions to reset your password.
                  </p>
                </div>

                <div className="pt-4">
                  <p className="text-sm opacity-70 mb-2">Didn't receive the email?</p>
                  <button 
                    onClick={() => setEmail("")} 
                    className="btn btn-outline btn-sm"
                  >
                    Try Again
                  </button>
                </div>

                <div className="text-center mt-4 pt-4 border-t">
                  <Link to="/login" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
                    <ArrowLeft className="size-4" />
                    Back to Sign In
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
              <h2 className="text-xl font-semibold">Secure Account Recovery</h2>
              <p className="opacity-70">
                We'll help you get back to connecting with language partners in no time
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
