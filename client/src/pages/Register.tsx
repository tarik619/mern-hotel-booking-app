import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

export type RegisterFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function Register() {
  const { showToast } = useAppContext();

  const navigate = useNavigate();

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const mutation = useMutation(apiClient.register, {
    onSuccess: () => {
      showToast({ message: "Registration success!", type: "SUCCESS" });
      navigate("/");
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    },
  });

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });

  return (
    <form className="flex flex-col gap-5" onSubmit={onSubmit}>
      <h2 className="text-3xl font-bold">Create Account</h2>
      <div className="flex flex-col md:flex-row gap-5">
        <label className="flex-1 text-gray-700 text-sm font-bold">
          First Name
          <input
            className="border rounded w-full py-1 px-2 font-normal"
            {...register("firstName", { required: "this field is required" })}
          />
          {errors.firstName && (
            <span className="text-red-500">{errors.firstName.message}</span>
          )}
        </label>
        <label className="flex-1 text-gray-700 text-sm font-bold">
          Last Name
          <input
            className="border rounded w-full py-1 px-2 font-normal"
            {...register("lastName", { required: "this field is required" })}
          />
          {errors.lastName && (
            <span className="text-red-500">{errors.lastName.message}</span>
          )}
        </label>
      </div>
      <label className="flex-1 text-gray-700 text-sm font-bold">
        Email
        <input
          className="border rounded w-full py-1 px-2 font-normal"
          type="email"
          {...register("email", { required: "this field is required" })}
        />
        {errors.email && (
          <span className="text-red-500">{errors.email.message}</span>
        )}
      </label>
      <label className="flex-1 text-gray-700 text-sm font-bold">
        Password
        <input
          className="border rounded w-full py-1 px-2 font-normal"
          type="password"
          {...register("password", {
            required: "this field is required",
            minLength: {
              value: 6,
              message: "password must be at least 6 characters",
            },
          })}
        />
        {errors.password && (
          <span className="text-red-500">{errors.password.message}</span>
        )}
      </label>
      <label className="flex-1 text-gray-700 text-sm font-bold">
        Confirm Password
        <input
          className="border rounded w-full py-1 px-2 font-normal"
          type="password"
          {...register("confirmPassword", {
            validate: (val) => {
              if (!val) {
                return "this field is required";
              } else if (watch("password") !== val) {
                return "passwords do not match";
              }
            },
          })}
        />
        {errors.confirmPassword && (
          <span className="text-red-500">{errors.confirmPassword.message}</span>
        )}
      </label>
      <span>
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-300 text-xl"
        >
          Create Account
        </button>
      </span>
    </form>
  );
}
