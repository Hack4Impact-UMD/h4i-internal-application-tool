import { useState } from "react"
import TextBox from "../../components/TextBox"
import Button from "../../components/Button";
import { registerUser } from "../../services/userService";
import { AxiosError } from "axios";
import { validEmail } from "../../utils/verification";
import { useNavigate } from "react-router-dom";


export default function SignUpCard() {
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: ""
    });

    const [formErrors, setFormErrors] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        genericError: "",
    });


    // check if all fields are filled
    const isFormValid = (
        formData.firstName.trim() !== "" &&
        formData.lastName.trim() !== "" &&
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

        if (formData.firstName.length == 0) {
            valid = false;
            errors.firstName = "Invalid First Name"
        }
        if (formData.lastName.length == 0) {
            valid = false;
            errors.lastName = "Invalid Last Name"
        }
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
                await registerUser(formData.email, formData.firstName, formData.lastName, formData.password)
                setFormErrors({
                    firstName: "",
                    lastName: "",
                    email: "",
                    password: "",
                    genericError: ""
                })
                navigate("/apply")
            } catch (error) {
                const serverErrors = {
                    firstName: "",
                    lastName: "",
                    email: "",
                    password: "",
                    genericError: ""
                };
                if (error instanceof AxiosError) {
                    if (error.response?.data.error == "Invalid Data") {
                        error.response?.data.details.map(
                            (issue: { field: "firstName" | "lastName" | "email"; message: string }) => {
                                console.log(`[Server validation error] ${issue.field}: ${issue.message}`)
                                serverErrors[issue.field] = issue.message
                            }
                        )
                    }
                } else if (error instanceof Error) {
                    serverErrors.genericError = error.message
                } else {
                    serverErrors.genericError = "Failed to register. You should contact us."
                }
                setFormErrors(serverErrors)
            }
        }
    }

    return (
        <div className="flex flex-col items-center justify-around w-full max-w-[430px] max-h-[700px] p-4">
            <img src="h4i-logo.png" alt="h4i logo" className="h-[105px] w-[105px]" />
            <div className="flex flex-col items-center text-center justify-around w-[305px] h-[105px]">
                <h1 className="text-3xl font-bold">Create an Account</h1>
                <h3 className="text-lg text-gray-500">Lets get started by filling out your information below</h3>
            </div>

            <div className="max-w-full w-full flex flex-col sm:flex-row">
                <TextBox
                    className="sm:max-w-1/2"
                    inputType="text"
                    label="FIRST NAME"
                    invalidLabel={formErrors.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                />
                <TextBox
                    className="sm:max-w-1/2"
                    inputType="text"
                    label="LAST NAME"
                    invalidLabel={formErrors.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                />
            </div>
            <TextBox
                inputType="text"
                className="w-full"
                label="EMAIL"
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
            <div className="w-full">
                {formErrors.genericError != "" && <p className="text-sm m-1 w-full text-red">{formErrors.genericError}</p>}
            </div>
            <div className="w-full">
                <Button
                    className="w-full h-[73px]"
                    label="Create account"
                    enabled={isFormValid}
                    onClick={handleSubmit}
                />
            </div>
            <div className="w-full">
                <hr className="w-full text-gray-500 m-0"></hr>
                <p className="text-gray-500 mt-1">Already have an account? <a href="/login" className="text-[#317FD0]">Log In</a></p>
            </div>
        </div>
    );
};
