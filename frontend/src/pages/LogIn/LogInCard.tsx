import { useState } from "react";
import TextBox from "../../components/TextBox";
import { Button } from "../../components/ui/button";
import { useAuth } from "../../hooks/useAuth";
import { validEmail, validPassword } from "../../utils/verification";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { throwErrorToast } from "../../components/error/ErrorToast";

export default function LogInCard() {
  const { login } = useAuth();
  const { state } = useLocation();
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      return await login(email, password);
    },
  });

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
  });

  // check if all fields are filled
  const isFormValid =
    formData.email.trim() !== "" && formData.password.trim() !== "";

  // handle TextBox input changes
  const handleInputChange = (field: string, value: string) => {
    const updatedData = {
      ...formData,
      [field]: value, //adding OR updating a specific field with new value
    };

    setFormData(updatedData);

    const updatedErrors = {
      ...formErrors,
      [field]: "",
    };

    setFormErrors(updatedErrors);
  };

  // using dummy conditionals for now
  const handleSubmit = async () => {
    let valid = true;
    const errors = { ...formErrors };

    if (!validEmail(formData.email)) {
      valid = false;
      const errorMessage = "Invalid Email.";
      errors.email = errorMessage;
      throwErrorToast(errorMessage);
    }
    if (!validPassword(formData.password)) {
      valid = false;
      const errorMessage =
        "Invalid Password, Please ensure your password meets the following requirements: At least 8 characters long, At least one uppercase letter (A-Z), At least one lowercase letter (a-z), At least one digit (0-9), At least one special character (e.g., @$!%*?&#).";
      errors.password = errorMessage;
      throwErrorToast(errorMessage);
    }

    setFormErrors(errors);

    if (valid) {
      try {
        const user = await loginMutation.mutateAsync({
          email: formData.email,
          password: formData.password,
        });
        if (state.path != null) {
          navigate(state.path);
        } else {
          if (user.role == "applicant") {
            navigate("/apply");
          } else {
            navigate("/admin");
          }
        }
      } catch (error) {
        console.log("Failed to login!");
        console.log(error);
        const errorMessage = "Failed to login, check your email and password.";
        setFormErrors({
          email: errorMessage,
          password: "",
        });

        throwErrorToast(errorMessage);
      }
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleSubmit();
      }}
      className="flex flex-col items-center justify-around w-full p-4 max-w-[430px] h-[700px]"
    >
      <img src="h4i-logo.png" alt="h4i logo" className="h-[105px] w-[105px]" />
      <div className="flex flex-col items-center text-center justify-around w-[305px] h-[105px]">
        <h1 className="text-3xl font-bold text-black">Log In</h1>
        <h3 className="text-lg text-darkgray">
          Lets get started by filling out your information below
        </h3>
      </div>
      <TextBox
        inputType="text"
        className="w-full"
        label="EMAIL"
        invalidLabel={formErrors.email}
        onChange={(e) => handleInputChange("email", e.target.value)}
      />
      <div className="w-full">
        <TextBox
          inputType="password"
          className="w-full"
          label="PASSWORD"
          invalidLabel={formErrors.password}
          onChange={(e) => handleInputChange("password", e.target.value)}
        />
        <div className="w-full flex justify-end">
          <a href="/forgotpassword" className="text-blue">
            Forgot password?
          </a>
        </div>
      </div>
      <Button
        className="w-full h-[73px]"
        disabled={loginMutation.isPending || !isFormValid}
        type="submit"
      > Log In </Button>
      <div className="w-full">
        <hr className="w-full text-darkgray m-0"></hr>
        <p className="text-gray-500 mt-1">
          Dont have an account?{" "}
          <a href="/signup" className="text-blue">
            Create account
          </a>
        </p>
      </div>
    </form>
  );
}
