export default function CreateAccount() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-white">
            <div className="flex flex-col items-center justify-center w-[430px] h-[700px] bg-gray-100">
                <img src="h4i-logo.png" alt="h4i logo" className="h-[105px] w-[105px]" />
                <h1>Create an Account</h1>
                <p>Lets get started by filling out your information below</p>
                <div className="flex flex-row">
                    <div className="w-[217px] h-[73px] bg-gray-300 m-1 hover:border-2 border-black"></div>
                    <div className="w-[196px] h-[73px] bg-gray-300 m-1"></div>
                </div>
                <div className="w-[421px] h-[73px] bg-gray-300 m-1"></div>
                <div className="w-[421px] h-[73px] bg-gray-300 m-1"></div>
                <button className="w-[421px] h-[73px] bg-gray-100 m-1 text-white">Create account</button>
                <hr className="m-1 w-[421px] text-gray-500"></hr>
                <p>Already have an account? <a href="/">Log In</a></p>
            </div>
        </div>
    )
}