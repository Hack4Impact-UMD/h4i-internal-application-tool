import { useLocation, useParams, useNavigate } from "react-router-dom";
import Section from "../components/form/Section";
import Timeline from "../components/status/Timeline"; // Import Timeline component
import useForm from "../hooks/useForm";
import Button from "../components/Button";

const ApplicationPage: React.FC = () => {
  //TODO: Some parts of this component should be moved to the form provider,
  //including the timeline. Form provider should basically serve as the layout shell
  const location = useLocation();
  const navigate = useNavigate();
  const { sectionId } = useParams<{ sectionId: string }>();

  const { form, response, updateQuestionResponse } = useForm()

  if (!form) return <p>Failed to fetch form...</p>
  if (!response) return <p>Failed to fetch response...</p>

  const applicationResponseId = location.state?.applicationResponseId;
  const userId = location.state?.userId;



  const currentSection = form.sections.find(
    (section) => section.sectionId === sectionId
  );

  if (!currentSection) {
    return (
      <div>Section not found. Please navigate back to the application.</div>
    );
  }

  const handleResponseChange = (questionId: string, value: string | string[]) => {
    updateQuestionResponse(currentSection.sectionId, questionId, value)
  };

  const handleNext = () => {
    const currentIndex = form.sections.findIndex(
      (section) => section.sectionId === sectionId
    );
    if (currentIndex < form.sections.length - 1) {
      const nextSectionId = form.sections[currentIndex + 1].sectionId;
      navigate(`/apply/${form.id}/${nextSectionId}`, {
        state: { form, applicationResponseId, userId },
      });
    } else {
      //TODO: Handle Submit
    }
  };

  const handlePrevious = () => {
    const currentIndex = form.sections.findIndex(
      (section) => section.sectionId === sectionId
    );
    if (currentIndex > 0) {
      const previousSectionId = form.sections[currentIndex - 1].sectionId;
      navigate(`/apply/${form.id}/${previousSectionId}`, {
        state: { form, applicationResponseId, userId },
      });
    }
  };

  const timelineItems = form.sections.map((section) => ({
    label: section.sectionName,
  }));

  const currentStep = form.sections.findIndex(
    (section) => section.sectionId === sectionId
  );

  return (
    <div className="flex flex-col items-center justify-center p-3">
      <Timeline
        className={"py-5"}
        items={timelineItems}
        currentStep={currentStep}
        maxStepReached={currentStep}
        onStepClick={(index) => {
          const targetSectionId = form.sections[index].sectionId;
          navigate(`/apply/${form.id}/${targetSectionId}`, {
            state: { form, applicationResponseId, userId },
          });
        }}
      />
      <div className="flex flex-col justify-self-center w-full max-w-3xl m-3 pt-16 pb-8 px-16 rounded-xl shadow-sm border border-gray-200 bg-white">

        <Section
          section={currentSection}
          responses={
            response.sectionResponses.find(
              (sectionResp) => sectionResp.sectionId === currentSection.sectionId
            )?.questions || []
          }
          onChangeResponse={handleResponseChange}
        />

        <div className="flex gap-1 mt-4">
          <Button
            className="border border-gray-400 text-black bg-white hover:bg-gray-100 px-8 rounded-full"
            enabled={form.sections[0].sectionId !== sectionId}
            onClick={handlePrevious}
          > Back </Button>
          {
            form.sections[form.sections.length - 1].sectionId !== sectionId ?
              <Button
                className="bg-[#317FD0] text-white px-8 rounded-full flex items-center justify-center"
                enabled={form.sections[form.sections.length - 1].sectionId !== sectionId}
                onClick={handleNext}
              > Next </Button> :
              <Button className="bg-[#317FD0] text-white px-8 rounded-full flex items-center justify-center"> Submit </Button>
          }
        </div>
      </div>
    </div>
  );
};

export default ApplicationPage;
