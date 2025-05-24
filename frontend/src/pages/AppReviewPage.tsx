import { useParams, useNavigate } from "react-router-dom";
import Section from "../components/form/Section";
import Timeline from "../components/status/Timeline"; // Import Timeline component
import useForm from "../hooks/useForm";
import { Button } from "../components/ui/button";
import { useMemo } from "react";
import ReviewCard from "../components/reviewer/ReviewCard";

const ApplicationPage: React.FC = () => {
  //TODO: Some parts of this component should be moved to the form provider,
  //including the timeline. Form provider should basically serve as the layout shell
  // const location = useLocation();
  const navigate = useNavigate();
  const { sectionId } = useParams<{ sectionId: string }>();

  const { form, response, availableSections, previousSection, nextSection } = useForm()

  const timelineItems = useMemo(() => form?.sections.filter((section) => availableSections.includes(section.sectionId)).map(s => {
    return {
      id: s.sectionId,
      label: s.sectionName
    }
  }), [availableSections, form]);


  const currentSection = useMemo(() => form?.sections.find(
    (section) => section.sectionId === sectionId
  ), [form, sectionId])

  const responses = useMemo(() => {
    return response?.sectionResponses.find(
      (sectionResp) => sectionResp.sectionId === currentSection?.sectionId
    )?.questions || []
  }, [response, currentSection])

  if (!form) return <p>Failed to fetch form...</p>
  if (!response) return <p>Failed to fetch response...</p>

  // const applicationResponseId = location.state?.applicationResponseId;
  // const userId = location.state?.userId;



  if (!currentSection) {
    return (
      <div>Section not found. Please navigate back to the application.</div>
    );
  }

  const handleNext = () => {
    const currentIndex = availableSections.findIndex(
      (section) => section === sectionId
    );
    if (currentIndex < form.sections.length - 1) {
      navigate(`/review/f/${form.id}/${nextSection()}`);
    } else {
      //TODO: Handle Submit
    }
  };

  const handlePrevious = () => {
    console.log(previousSection())
    navigate(`/review/f/${form.id}/${previousSection()}`);
  };


  const currentStep = availableSections.findIndex(
    (section) => section === sectionId
  );

  return (
    <div className="flex flex-col items-center justify-center p-3">
      <Timeline
        className={"py-5"}
        items={timelineItems ?? []}
        currentStep={currentStep}
        maxStepReached={currentStep}
        onStepClick={(_, item) => {
          navigate(`/review/f/${form.id}/${item.id}`);
        }}
      />
      <div className="flex justify-center items-start">
        <div className="flex flex-col justify-self-center m-3 pt-16 pb-8 px-16 rounded-xl shadow-sm border border-gray-200 bg-white min-w-[600px] max-w-60">
          <Section
            section={currentSection}
            responses={
              responses
            }
            // onChangeResponse={() => { }} // TODO: make this optional? yes
            disabled={true}
          />
        </div>
        <div className="justify-self-start my-0 min-w-[400px] max-w-40">
          <ReviewCard></ReviewCard>
        </div>
      </div>

      <div className="flex gap-1 mt-4">
        {
          availableSections[0] !== sectionId ?
            <Button
              className="bg-[#317FD0] text-white px-8 rounded-full flex items-center justify-center"
              disabled={form.sections[0].sectionId === sectionId}
              onClick={handlePrevious}
            > Back </Button> : <div></div>
        }
        {
          availableSections[availableSections.length - 1] !== sectionId ?
            <Button
              className="bg-[#317FD0] text-white px-8 rounded-full flex items-center justify-center"
              disabled={form.sections[form.sections.length - 1].sectionId === sectionId}
              onClick={handleNext}
            > Next </Button> : <div></div>
        }
      </div>
    </div>
  );
};

export default ApplicationPage;
