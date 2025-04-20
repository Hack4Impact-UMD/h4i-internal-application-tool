import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Section from "../components/form/Section";
import Timeline from "../components/status/Timeline"; // Import Timeline component
import { ApplicationForm, QuestionType, SectionResponse } from "../types/types";
import { getApplicationResponseByFormId } from "../services/applicationResponsesService";

const ApplicationPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { sectionId } = useParams<{ sectionId: string }>();

  const form = location.state?.form as ApplicationForm;
  const applicationResponseId = location.state?.applicationResponseId;
  const userId = location.state?.userId;

  const [responses, setResponses] = useState<SectionResponse[]>(
    form.sections.map((section) => ({
      sectionName: section.sectionName,
      questions: section.questions.map((question) => ({
        questionId: question.questionId,
        questionType: question.questionType,
        applicationFormId: form.id,
        response:
          question.questionType === QuestionType.MultipleSelect ? [] : "",
      })),
    }))
  );

  useEffect(() => {
    const initializeApplicationResponse = async () => {
      const existingApplicationResponse = await getApplicationResponseByFormId(
        userId,
        form.id
      );
      setResponses(
        (existingApplicationResponse?.sectionResponses as SectionResponse[]) ||
          responses
      );
    };

    initializeApplicationResponse();
  }, [applicationResponseId, form, userId]);

  const currentSection = form.sections.find(
    (section) => section.sectionId === sectionId
  );

  if (!currentSection) {
    return (
      <div>Section not found. Please navigate back to the application.</div>
    );
  }

  const handleResponseChange = (questionId: string, value: any) => {
    setResponses((prev) =>
      prev.map((sectionResponse) =>
        sectionResponse.sectionName === currentSection.sectionName
          ? {
              ...sectionResponse,
              questions: sectionResponse.questions.map((questionResponse) =>
                questionResponse.questionId === questionId
                  ? { ...questionResponse, response: value }
                  : questionResponse
              ),
            }
          : sectionResponse
      )
    );
  };

  const handleNext = () => {
    const currentIndex = form.sections.findIndex(
      (section) => section.sectionId === sectionId
    );
    if (currentIndex < form.sections.length - 1) {
      const nextSectionId = form.sections[currentIndex + 1].sectionId;
      navigate(`/apply/${applicationResponseId}/${nextSectionId}`, {
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
      navigate(`/apply/${applicationResponseId}/${previousSectionId}`, {
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
    <div className="flex flex-col items-center justify-center p-8">
      <Timeline
        items={timelineItems}
        currentStep={currentStep}
        maxStepReached={currentStep}
        onStepClick={(index) => {
          const targetSectionId = form.sections[index].sectionId;
          navigate(`/apply/${applicationResponseId}/${targetSectionId}`, {
            state: { form, applicationResponseId, userId },
          });
        }}
      />

      <Section
        section={currentSection}
        responses={
          responses.find(
            (response) => response.sectionName === currentSection.sectionName
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
