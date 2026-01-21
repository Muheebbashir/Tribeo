import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "../lib/api";
import toast from "react-hot-toast";

const useForgotPassword = () => {
  const { mutate: forgotPasswordMutation, isPending, error, isSuccess } = useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
      toast.success("Password reset link sent to your email!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to send reset link");
    },
  });

  return { forgotPasswordMutation, isPending, error, isSuccess };
};

export default useForgotPassword;
