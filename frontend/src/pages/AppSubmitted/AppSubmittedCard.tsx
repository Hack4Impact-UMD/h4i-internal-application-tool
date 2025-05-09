import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/Button";

export default function AppSubmittedCard() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center text-center justify-around w-[1000px] h-[400px] m-20">
            <img src="/success_icon.png" alt="success icon" className="h-[100px] w-[100px]" />
            <h3 className="text-3xl text-black">Your Application has been Successfully Submitted</h3>
            <div>
                <Button
                    className="rounded-3xl pl-5 pr-5 font-semibold "
                    type="button"
                    onClick={() => navigate("/apply/status")}
                >Go to Status Page</Button>
                <Link
                    className="cursor-pointer text-lg p-2 m-1 rounded-3xl pl-5 pr-5 font-semibold border-gray-500 border-2 w-[116px]"
                    to={"/"}
                >
                    Home
                </Link>
            </div>
        </div>
    );
}
