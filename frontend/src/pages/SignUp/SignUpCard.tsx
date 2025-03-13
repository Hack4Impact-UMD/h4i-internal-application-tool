import { useState } from "react"
import TextBox from "../../components/TextBox"
import Button from "../../components/Button";


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

        // if (formData.firstname.length === 0) {
        //     valid = false;
        //     errors.firstname = "Invalid First Name"
        // }

        // if (formData.lastname.length === 0) {
        //     valid = false;
        //     errors.lastname = "Invalid Last Name"
        // }

        const terpmailRegex = /^[a-zA-Z0-9]+@terpmail\.umd\.edu$/;
        console.log(terpmailRegex.test(formData.email.trim()))
        if (terpmailRegex.test(formData.email.trim()) == false) {
            valid = false;
            errors.email = "Enter a valid terpmail address"
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
        if (passwordRegex.test(formData.password.trim()) == false) {
            valid = false;
            errors.password = `Please ensure your password meets the following requirements:
            At least 8 characters long, At least one uppercase letter (A-Z), At least one lower
            case letter (a-z), At least one digit (0-9), At least one special character (e.g., @$!%*?&#)`;
        }

        setFormErrors(errors)

        if (valid) {
            // create an account
        }
    }

    return (
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
            <Button
                width="421"
                height="73"
                label="Create account"
                validForm={isFormValid}
                onClick={handleSubmit}
            />
            <div className="w-[421px]">
                <hr className="w-[421px] text-gray-500 m-0"></hr>
                <p className="text-gray-500 mt-1">Already have an account? <a href="/login" className="text-[#317FD0]">Log In</a></p>
            </div>
        </div>
    );
};