import { useState } from "react"
import TextBox from "../../components/TextBox"
import Button from "../../components/Button";


export default function ResetPassCard() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [formErrors, setFormErrors] = useState({
        email: "",
        password: "",
        confirmPassword: ""
    });


    // check if all fields are filled
    const isFormValid = (
        formData.email.trim() !== "" &&
        formData.password.trim() !== "" &&
        formData.confirmPassword.trim() !== ""
    );

    // handle TextBox input changes
    const handleInputChange = (field: string, value: string) => {
        const updatedData = {
            ...formData,
            [field]: value       //adding OR updating a specific field with new value
        };

        setFormData(updatedData)

        const updatedErrors = {
            ...formErrors,
            [field]: ""
        }

        setFormErrors(updatedErrors)
    };

    // using dummy conditionals for now
    const handleSubmit = () => {
        let valid = true;
        const errors = { ...formErrors };

        if (formData.email.length < 6) {
            valid = false;
            errors.email = "Invalid Email"
        }
        if (formData.password.length < 6) {
            valid = false;
            errors.password = "Invalid Password"
        }
        if (formData.confirmPassword.length < 6) {
            valid = false;
            errors.confirmPassword = "Invalid Confirmation Password"
        }

        setFormErrors(errors)

        if (valid) {
            // create an account
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-white">
            <div className="flex flex-col items-center justify-around w-full p-4 max-w-[430px] h-[700px]">
                <img src="h4i-logo.png" alt="h4i logo" className="h-[105px] w-[105px]" />
                <div className="flex flex-col items-center text-center justify-around w-[305px] h-[105px]">
                    <h1 className="text-3xl font-bold">Reset Password</h1>
                    <h3 className="text-lg text-gray-500">Fill in the code you recieved in your email</h3>
                </div>
                <TextBox
                    inputType="text"
                    className="w-full"
                    label="CODE"
                    invalidLabel={formErrors.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                />
                <TextBox
                    inputType="password"
                    className="w-full"
                    label="PASSWORD"
                    invalidLabel={formErrors.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                />
                <TextBox
                    inputType="password"
                    className="w-full"
                    label="CONFIRM PASSWORD"
                    invalidLabel={formErrors.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                />

                <div className="w-full">
                    <Button
                        className="w-full h-[73px]"
                        label="Reset"
                        validForm={isFormValid}
                        onClick={handleSubmit}
                    />
                </div>
                <hr className="w-full text-gray-500 m-0"></hr>
            </div>
        </div>
    );
};
