import { useState } from "react"
import TextBox from "../../components/TextBox"
import Button from "../../components/Button";


export default function ResetPassCard() {
    const [formData, setFormData] = useState({
        code: "",
        password: "",
        confirmPassword: ""
    });

    const [formErrors, setFormErrors] = useState({
        code: "",
        password: "",
        confirmPassword: ""
    });
    

    // check if all fields are filled
    const isFormValid = (
       formData.code.trim() !== "" &&
       formData.password.trim() !== "" &&
       formData.confirmPassword.trim() !== ""
    );

    // handle TextBox input changes
    const handleInputChange = (field: string, value: string) => {
        const updatedData = {
            ...formData,
            [field]:value       //adding OR updating a specific field with new value
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
        let errors = {...formErrors };
        
        const codeRegex = /^[A-Z1-9]{6}$/;
        if (!codeRegex.test(formData.code.trim())) {
            valid = false;
            errors.code = "Invalid Code"
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
        if (passwordRegex.test(formData.password.trim()) == false) {
            valid = false;
            errors.password = `Please ensure your password meets the following requirements:
            At least 8 characters long, At least one uppercase letter (A-Z), At least one lower
            case letter (a-z), At least one digit (0-9), At least one special character (e.g., @$!%*?&#)`;
        }
        if (errors.password !== "") {
            errors.confirmPassword = "Invalid Password"
        } else if (formData.password !== formData.confirmPassword) {
            valid = false;
            errors.confirmPassword = "Passwords don't match"
        }

        setFormErrors(errors)

        if (valid) {
            // create an account
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-white">
            <div className="flex flex-col items-center justify-around w-[430px] h-[700px]">
                <img src="h4i-logo.png" alt="h4i logo" className="h-[105px] w-[105px]" />
                <div className="flex flex-col items-center text-center justify-around w-[305px] h-[105px]">
                    <h1 className="text-3xl font-bold">Reset Password</h1>
                    <h3 className="text-lg text-gray-500">Fill in the code you recieved in your email</h3>
                </div>
                <TextBox 
                    inputType="text"
                    width="421"
                    height="73"
                    label="CODE"
                    invalidLabel={formErrors.code}
                    onChange={(e) => handleInputChange("code", e.target.value)}
                />
                <TextBox 
                    inputType="password"
                    width="421"
                    height="73"
                    label="PASSWORD"
                    invalidLabel={formErrors.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                />
                <TextBox 
                    inputType="password"
                    width="421"
                    height="73"
                    label="CONFIRM PASSWORD"
                    invalidLabel={formErrors.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                />
                
                <Button
                    width="421"
                    height="73"
                    label="Log In"
                    validForm={isFormValid}
                    onClick={handleSubmit}
                />
                <hr className="w-[421px] text-gray-500 m-0"></hr>
            </div>
        </div>
    );
};