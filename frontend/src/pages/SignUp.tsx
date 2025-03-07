export default function SignUp() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-white">
            <div className="flex flex-col items-center justify-around w-[430px] h-[700px]">
                <img src="h4i-logo.png" alt="h4i logo" className="h-[105px] w-[105px]" />
                <div className="flex flex-col items-center text-center justify-around w-[305px] h-[105px]">
                    <h1 className="text-3xl font-bold">Create an Account</h1>
                    <h3 className="text-lg text-gray-500">Lets get started by filling out your information below</h3>
                </div>
                
                <div className="flex flex-row">
                    <label className="flex flex-col justify-around w-[217px] h-[73px] bg-gray-100 m-1 p-3 border-1 border-transparent rounded-sm hover:border-black">
                        <h4 className="font-bold text-xs text-gray-700">FIRST NAME</h4>
                        <input type="text" className="text-base text-lg font-medium focus:outline-none"></input>
                    </label>
                    <label className="flex flex-col justify-around w-[196px] h-[73px] bg-gray-100 m-1 p-3 border-1 border-transparent rounded-sm hover:border-black">
                        <h4 className="font-bold text-xs text-gray-700">LAST NAME</h4>
                        <input type="text" className="text-base text-lg font-medium focus:outline-none"></input>
                    </label>
                </div>
                <label className="flex flex-col justify-around w-[421px] h-[73px] bg-gray-100 m-1 p-3 border-1 border-transparent rounded-sm hover:border-black">
                    <h4 className="font-bold text-xs text-gray-700">EMAIL</h4>
                    <input type="text" className="text-base text-lg font-medium focus:outline-none"></input>
                </label>
                <label className="flex flex-col justify-around w-[421px] h-[73px] bg-gray-100 m-1 p-3 border-1 border-transparent rounded-sm hover:border-black">
                    <h4 className="font-bold text-xs text-gray-700">PASSWORD</h4>
                    <input type="password" className="text-base text-lg font-medium focus:outline-none"></input>
                </label>
                <button className="w-[421px] h-[73px] bg-[#317FD0] text-white text-lg m-1 rounded-sm focus:border-white">Create account</button>
                <div className="w-[421px]">
                    <hr className="w-[421px] text-gray-500 m-0"></hr>
                    <p className="text-gray-500 mt-1">Already have an account? <a href="/" className="text-[#317FD0]">Log In</a></p>
                </div>
            </div>
        </div>
    )
}