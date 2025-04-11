import Button from "../Button";
import Navbar from "../Navbar";
import { ApplicationForm} from "../../types/types";

interface ApplicationPreviewProps {
    form: ApplicationForm;
}

const ApplicationPreview: React.FC<ApplicationPreviewProps> = ({form}) => {
    return (
        <>
            <Navbar/>
            <div className="flex flex-col m-8 w-3/4 justify-self-center max-h-[83vh] p-6">
                <span className="text-4xl">Overview</span>
                <div className="mt-4 flex flex-row justify-between items-center">
                    <div className="w-2/5">
                        <span className="text-xl text-[#317FD0]">
                            {form.title}
                        </span>
                    </div>
                    <div>
                        <Button
                            className="bg-[#202020] py-1.5 px-9 rounded-3xl text-md font-bold"
                            label="Apply"
                            enabled={form.isActive}
                            type="button"
                        />
                    </div>
                </div>
                <div className="flex flex-col gap-2.5 mt-7 text-sm overflow-auto">
                   {form.description}
                </div>
            </div>
            
        </>
    );
};

export default ApplicationPreview;
