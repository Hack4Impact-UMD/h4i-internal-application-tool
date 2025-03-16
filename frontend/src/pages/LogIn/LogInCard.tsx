import { useState } from "react"
import TextBox from "../../components/TextBox"
import Button from "../../components/Button";
import { useAuth } from "../../hooks/useAuth";
import { validEmail } from "../../utils/verification";
import { useLocation, useNavigate } from "react-router-dom";


export default function LogInCard() {
    const { login } = useAuth()
    const { state } = useLocation()
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [formErrors, setFormErrors] = useState({
        email: "",
        password: "",
    });


    // check if all fields are filled
    const isFormValid = (
        formData.email.trim() !== "" &&
        formData.password.trim() !== ""
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
    const handleSubmit = async () => {
        let valid = true;
        const errors = { ...formErrors };

        if (!validEmail(formData.email)) {
            valid = false;
            errors.email = "Invalid Email"
        }
        if (formData.password.length < 6) {
            valid = false;
            errors.password = "Invalid Password"
        }

        setFormErrors(errors)

        if (valid) {
            try {
                const user = await login(formData.email, formData.password)
                if (state.path) {
                    navigate(state.path)
                } else {
                    if (user.role == "applicant") {
                        navigate("/apply")
                    } else {
                        navigate("/admin")
                    }
                }
            } catch (error) {
                console.log("Failed to login!")
                console.log(error);
                setFormErrors({
                    email: "Failed to login, check your email and password",
                    password: ""
                })
            }
        }
    }

    return (
        <div className="flex flex-col items-center justify-around w-full p-4 max-w-[430px] h-[700px]">
            <img src="h4i-logo.png" alt="h4i logo" className="h-[105px] w-[105px]" />
            <div className="flex flex-col items-center text-center justify-around w-[305px] h-[105px]">
                <h1 className="text-3xl font-bold">Log In</h1>
                <h3 className="text-lg text-gray-500">Lets get started by filling out your information below</h3>
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
                    <a href="/forgotpassword" className="text-[#317FD0]">Forgot password?</a>
                </div>
            </div>

            <div className="w-full">
                <Button
                    className="w-full h-[73px]"
                    label="Log In"
                    enabled={isFormValid}
                    onClick={handleSubmit}
                />
            </div>
            <div className="w-full">
                <hr className="w-full text-gray-500 m-0"></hr>
                <p className="text-gray-500 mt-1">Dont have an account? <a href="/signup" className="text-[#317FD0]">Create account</a></p>
            </div>
        </div>
    );
};
