import { useParams, useNavigate } from "react-router-dom";
import Section from "../components/form/Section";
import Timeline from "../components/status/Timeline"; // Import Timeline component
import { Button } from "../components/ui/button";
import { useMemo } from "react";
import ReviewCard from "../components/reviewer/ReviewCard";
import { useApplicationForm } from "@/hooks/useApplicationForm";
import Loading from "@/components/Loading";
import { useApplicationResponse } from "@/hooks/useApplicationResponses";
import { useReviewData } from "@/hooks/useReviewData";

const ApplicationPage: React.FC = () => {
  const navigate = useNavigate();
  const { sectionId, formId, responseId, reviewDataId } = useParams<{
    formId: string;
    reviewDataId: string;
    responseId: string;
    sectionId: string;
  }>();

  const {
    data: response,
    isPending: responseLoading,
    error: responseError,
  } = useApplicationResponse(responseId);

  const {
    data: form,
    isPending: formLoading,
    error: formError,
  } = useApplicationForm(formId);

  const {
    data: reviewData,
    isPending: reviewPending,
    error: reviewError,
  } = useReviewData(reviewDataId ?? "");

  const availableSections = useMemo(() => {
    return (
      form?.sections
        .filter((s) => {
          if (s.forRoles) {
            return (
              s.forRoles.filter((r) => response?.rolesApplied?.includes(r))
                .length > 0
            );
          } else {
            return true;
          }
        })
        .map((s) => s.sectionId) ?? []
    );
  }, [response?.rolesApplied, form]);

  const timelineItems = useMemo(
    () =>
      form?.sections
        .filter((section) => availableSections.includes(section.sectionId))
        .map((s) => {
          return {
            id: s.sectionId,
            label: s.sectionName,
          };
        }),
    [availableSections, form],
  );

  const currentSection = useMemo(
    () => form?.sections.find((section) => section.sectionId === sectionId),
    [form, sectionId],
  );

  const responses = useMemo(() => {
    return (
      response?.sectionResponses.find(
        (sectionResp) => sectionResp.sectionId === currentSection?.sectionId,
      )?.questions || []
    );
  }, [response, currentSection]);

  if (formLoading || responseLoading || reviewPending) return <Loading />;
  if (formError || !form)
    return <p>Failed to fetch form: {formError.message}</p>;
  if (responseError || !response)
    return <p>Failed to fetch response: {responseError?.message}</p>;
  if (reviewError || !reviewData)
    return <p>Failed to fetch response: {reviewError.message}</p>;

  if (!currentSection) {
    return (
      <div>Section not found. Please navigate back to the application.</div>
    );
  }

  function nextSection() {
    if (!form) return;
    const idx = availableSections.findIndex((s) => s == sectionId);
    if (idx >= 0 && idx + 1 < availableSections.length) {
      return availableSections[idx + 1];
    } else {
      return sectionId ?? "";
    }
  }

  function previousSection() {
    const idx = availableSections.findIndex((s) => s == sectionId);
    if (idx >= 1) {
      return availableSections[idx - 1];
    } else {
      return sectionId ?? "";
    }
  }

  const handleNext = () => {
    const currentIndex = availableSections.findIndex(
      (section) => section === sectionId,
    );
    if (currentIndex < form.sections.length - 1) {
      navigate(
        `/admin/review/f/${formId}/${responseId}/${nextSection()}/${reviewDataId}`,
      );
    } else {
      //TODO: Handle Submit
    }
  };

  const handlePrevious = () => {
    console.log(previousSection());
    navigate(
      `/admin/review/f/${formId}/${responseId}/${previousSection()}/${reviewDataId}`,
    );
  };

  const currentStep = availableSections.findIndex(
    (section) => section === sectionId,
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
            responseId={response.id}
            section={currentSection}
            responses={responses}
            disabled={true}
          />
        </div>
        <div className="justify-self-start my-0 min-w-[400px] max-w-40">
          <ReviewCard></ReviewCard>
        </div>
      </div>

      <div className="flex gap-1 mt-4">
        {availableSections[0] !== sectionId ? (
          <Button
            className="bg-[#317FD0] text-white px-8 rounded-full flex items-center justify-center"
            disabled={form.sections[0].sectionId === sectionId}
            onClick={handlePrevious}
          >
            Back
          </Button>
        ) : (
          <div></div>
        )}
        {availableSections[availableSections.length - 1] !== sectionId ? (
          <Button
            className="bg-[#317FD0] text-white px-8 rounded-full flex items-center justify-center"
            disabled={
              form.sections[form.sections.length - 1].sectionId === sectionId
            }
            onClick={handleNext}
          >
            Next
          </Button>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};

export default ApplicationPage;
