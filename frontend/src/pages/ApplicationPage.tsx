import { useParams, useNavigate } from "react-router-dom";
import Section from "../components/form/Section";
import Timeline from "../components/status/Timeline"; // Import Timeline component
import useForm from "../hooks/useForm";
import { Button } from "../components/ui/button";
import { useMemo } from "react";

const ApplicationPage: React.FC = () => {
  //TODO: Some parts of this component should be moved to the form provider,
  //including the timeline. Form provider should basically serve as the layout shell
  // const location = useLocation();
  const navigate = useNavigate();
  const { sectionId } = useParams<{ sectionId: string }>();

  const { form, response, updateQuestionResponse, availableSections, previousSection, nextSection, save } = useForm()

  const timelineItems = useMemo(() => form?.sections.filter((section) => availableSections.includes(section.sectionId)).map(s => {
    return {
      label: s.sectionName,
      id: s.sectionId
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


  if (!currentSection) {
    return (
      <div>Section not found. Please navigate back to the application.</div>
    );
  }

  const handleResponseChange = (questionId: string, value: string | string[]) => {
    updateQuestionResponse(currentSection.sectionId, questionId, value)
  };

  const handleNext = async () => {
    const currentIndex = availableSections.findIndex(
      (section) => section === sectionId
    );
    if (currentIndex < form.sections.length - 1) {
      await save();
      navigate(`/apply/f/${form.id}/${nextSection()}`);
    }
  };

  const handlePrevious = async () => {
    console.log(previousSection())
    await save();
    navigate(`/apply/f/${form.id}/${previousSection()}`);
  };


  const currentStep = availableSections.findIndex(
    (section) => section === sectionId
  );

  const handleSubmit = async () => {
    await save();
    navigate(`/apply/submit/${form.id}`)
  }


  return (
    <div className="flex flex-col items-center justify-center p-3">
      <div className="w-full max-w-3xl overflow-x-auto p-2">
        <Timeline
          className={"py-5"}
          items={timelineItems ?? []}
          currentStep={currentStep}
          maxStepReached={currentStep}
          onStepClick={(_, item) => {
            const targetSectionId = item.id;
            navigate(`/apply/f/${form.id}/${targetSectionId}`);
          }}
        />
      </div>
      <div className="flex flex-col justify-self-center w-full max-w-3xl m-3 p-4 md:pt-16 md:pb-8 md:px-16 rounded-xl shadow-sm border border-gray-200 bg-white">
        <Section
          section={currentSection}
          responses={responses}
          onChangeResponse={handleResponseChange}
        />

        <div className="flex gap-1 mt-4">
          <Button
            className="border border-gray-400 text-black bg-white hover:bg-gray-100 px-8 rounded-full"
            disabled={form.sections[0].sectionId === sectionId}
            onClick={handlePrevious}
          > Back </Button>
          {
            availableSections[availableSections.length - 1] !== sectionId ?
              <Button
                className="bg-[#317FD0] text-white px-8 rounded-full flex items-center justify-center"
                disabled={form.sections[form.sections.length - 1].sectionId === sectionId}
                onClick={handleNext}
              > Next </Button> :
              <Button onClick={handleSubmit} className="bg-[#317FD0] text-white px-8 rounded-full flex items-center justify-center"> Submit </Button>
          }
        </div>
      </div>
    </div>
  );
};

export default ApplicationPage;
