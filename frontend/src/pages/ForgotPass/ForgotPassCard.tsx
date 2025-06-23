import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { validEmail } from "../../utils/verification";
import TextBox from "../../components/TextBox";
import { Button } from "../../components/ui/button";

export default function ForgotPassCard() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
  });

  const [formErrors, setFormErrors] = useState({
    email: "",
  });

  // check if all fields are filled
  const isFormValid = formData.email.trim() !== "";

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
  const handleSubmit = () => {
    let valid = true;
    const errors = { ...formErrors };

    if (!validEmail(formData.email)) {
      valid = false;
      errors.email = "Enter a valid terpmail address";
    }

    setFormErrors(errors);

    if (valid) {
      navigate("/resetpassword");
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleSubmit();
      }}
      className="flex flex-col items-center justify-around p-4 w-full max-w-[430px] h-[500px]"
    >
      <img src="h4i-logo.png" alt="h4i logo" className="h-[105px] w-[105px]" />
      <div className="flex flex-col items-center text-center justify-around w-[305px] h-[105px]">
        <h1 className="text-3xl font-bold">Forgot Password?</h1>
        <h3 className="text-lg text-darkgray">
          No worries! You will recieve a code in your email to reset your
          account
        </h3>
      </div>
      <TextBox
        inputType="text"
        className="w-full"
        label="EMAIL"
        invalidLabel={formErrors.email}
        onChange={(e) => handleInputChange("email", e.target.value)}
      />
      <Button className="w-full h-[73px]" disabled={!isFormValid} type="submit">
        {" "}
        Send Code{" "}
      </Button>
      <div className="w-full">
        <hr className="w-full text-darkgray m-0"></hr>
      </div>
    </form>
  );
}
