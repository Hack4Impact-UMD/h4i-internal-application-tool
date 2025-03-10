import { useState } from "react"
import TextBox from "../components/signup/TextBox"


export default function SignUpCard() {
    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        email: "",
        password: ""
    });

    const [formErrors, setFormErrors] = useState({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
    });
    

    // check if all fields are filled
    const isFormValid = (
       formData.firstname.trim() !== "" &&
       formData.lastname.trim() !== "" &&
       formData.email.trim() !== "" &&
       formData.password.trim() !== ""
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

        if (formData.firstname.trim() === "") {
            valid = false;
            errors.firstname = "Invalid First Name"
        }
        if (formData.lastname.trim() === "") {
            valid = false;
            errors.lastname = "Invalid Last Name"
        }
        if (formData.email.trim() === "" ) {
            valid = false;
            errors.email = "Invalid Email"
        }
        if (formData.password.length < 6) {
            valid = false;
            errors.password = "Invalid Password"
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
                    <h1 className="text-3xl font-bold">Create an Account</h1>
                    <h3 className="text-lg text-gray-500">Lets get started by filling out your information below</h3>
                </div>
                
                <div className="flex flex-row">
                    <TextBox 
                        inputType="text"
                        width="175"
                        height="73"
                        label="FIRST NAME"
                        invalidLabel={formErrors.firstname}
                        onChange={(e) => handleInputChange("firstname", e.target.value)}
                    />
                    <TextBox 
                        inputType="text"
                        width="238"
                        height="73"
                        label="LAST NAME"
                        invalidLabel={formErrors.lastname}
                        onChange={(e) => handleInputChange("lastname", e.target.value)}
                    />
                </div>
                <TextBox 
                    inputType="text"
                    width="421"
                    height="73"
                    label="EMAIL"
                    invalidLabel={formErrors.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                />
                <TextBox 
                    inputType="password"
                    width="421"
                    height="73"
                    label="PASSWORD"
                    invalidLabel={formErrors.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                />
                <button 
                    className={`w-[421px] h-[73px] text-white text-lg m-1 rounded-sm focus:border-white ${
                        isFormValid ? "bg-[#317FD0] hover:bg-[#265FA1]" : "bg-gray-400"
                    }`} 
                    disabled={!isFormValid}
                    onClick={handleSubmit}
                >
                    Create account
                </button>
                <div className="w-[421px]">
                    <hr className="w-[421px] text-gray-500 m-0"></hr>
                    <p className="text-gray-500 mt-1">Already have an account? <a href="/" className="text-[#317FD0]">Log In</a></p>
                </div>
            </div>
        </div>
    );
};