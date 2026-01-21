import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "../lib/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

const useResetPassword = () => {
  const navigate = useNavigate();

  const { mutate: resetPasswordMutation, isPending, error, isSuccess } = useMutation({
    mutationFn: ({ token, newPassword }) => resetPassword(token, newPassword),
    onSuccess: () => {
      toast.success("Password reset successful! Please login with your new password.");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to reset password");
    },
  });

  return { resetPasswordMutation, isPending, error, isSuccess };
};

export default useResetPassword;
