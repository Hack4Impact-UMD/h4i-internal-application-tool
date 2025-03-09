import TextBox from "../components/signup/TextBox"

export default function SignUpCard() {
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
                        width="217"
                        height="73"
                        label="FIRST NAME"
                        invalidLabel="TEST"
                    />
                    <TextBox 
                        inputType="text"
                        width="196"
                        height="73"
                        label="LAST NAME"
                        invalidLabel="TEST"
                    />
                </div>
                <TextBox 
                    inputType="text"
                    width="421"
                    height="73"
                    label="EMAIL"
                    invalidLabel="TEST"
                />
                <TextBox 
                    inputType="password"
                    width="421"
                    height="73"
                    label="PASSWORD"
                    invalidLabel="TEST"
                />
                <button className="w-[421px] h-[73px] bg-[#317FD0] text-white text-lg m-1 rounded-sm focus:border-white">Create account</button>
                <div className="w-[421px]">
                    <hr className="w-[421px] text-gray-500 m-0"></hr>
                    <p className="text-gray-500 mt-1">Already have an account? <a href="/" className="text-[#317FD0]">Log In</a></p>
                </div>
            </div>
        </div>
    )
}