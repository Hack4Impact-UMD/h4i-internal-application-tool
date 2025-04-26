import { useLocation, useParams, useNavigate } from "react-router-dom";
import Section from "../components/form/Section";
import Timeline from "../components/status/Timeline"; // Import Timeline component
import useForm from "../hooks/useForm";

const ApplicationPage: React.FC = () => {
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

      <Section
        section={currentSection}
        responses={
          response.sectionResponses.find(
            (sectionResp) => sectionResp.sectionId === currentSection.sectionId
          )?.questions || []
        }
        onChangeResponse={handleResponseChange}
        onNext={handleNext}
        onPrevious={handlePrevious}
        isNextDisabled={
          form.sections[form.sections.length - 1].sectionId === sectionId
        }
        isPreviousDisabled={form.sections[0].sectionId === sectionId}
      />

    </div>
  );
};

export default ApplicationPage;
