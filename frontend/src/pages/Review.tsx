import { useState } from "react";
import Navbar from "../components/Navbar";
import Timeline from "../components/status/Timeline";
import ReviewCard from "../components/reviewer/ReviewCard";

const engineerQuestions = [
  {
    question: "Why do you want to become an engineer at Hack4Impact - UMD?",
    isRequired: true,
  },
  {
    question: "Why are you a strong fit for the engineer role?",
    isRequired: true,
  },
  {
    question: "Tell us about your experience with Git and Github.",
    isRequired: true,
  },
  {
    question:
      "Please talk about the different languages or frameworks (Ex. Node, React, etc.) you have experience in and give a brief description of the experience you have in each.",
    isRequired: true,
  },
  {
    question:
      "Tell us about a mistake you made while working on a coding project (in class, internship, research, or for fun). How did you handle it?",
    isRequired: true,
  },
  {
    question:
      "Describe your experience working in engineering teams and/or working in sprints, if any. This is NOT a prerequisite for joining but gives us an idea of the experience level.",
    isRequired: true,
  },
];

const reviewCategories = [
  {
    label: "Interest in Club",
    key: "interestInClub",
  },
  {
    label: "Interest in Social Good",
    key: "interestInSocialGood",
  },
  {
    label: "Technical Expertise",
    key: "technicalExpertise",
  },
];

const assessmentCategories = [
  { label: "Functionality", key: "functionality" },
  { label: "Visual", key: "visual" },
  { label: "Coding Practices", key: "codingPractices" },
  { label: "Coding Style", key: "codingStyle" },
];

// Add this type for all possible score keys
const allScoreKeys = [
  "interestInClub",
  "interestInSocialGood",
  "technicalExpertise",
  "functionality",
  "visual",
  "codingPractices",
  "codingStyle",
] as const;
type ScoreKey = typeof allScoreKeys[number];

type Scores = Record<ScoreKey, number | null>;

export default function Review() {
  const [answers, setAnswers] = useState(Array(engineerQuestions.length).fill(""));
  const [scores, setScores] = useState<Scores>({
    interestInClub: null,
    interestInSocialGood: null,
    technicalExpertise: null,
    functionality: null,
    visual: null,
    codingPractices: null,
    codingStyle: null,
  });
  const [notes, setNotes] = useState("");

  const handleAnswerChange = (idx: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[idx] = value;
    setAnswers(newAnswers);
  };

  const handleScoreChange = (key: ScoreKey, value: number) => {
    setScores((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Submit logic here
    alert("Submitted!");
  };

  // Custom OptionButton for scoring section
  const ScoreButton = ({ score, selected, onClick }: { score: number; selected: boolean; onClick: () => void }) => (
    <button
      type="button"
      onClick={onClick}
      className={`w-24 h-14 flex items-center justify-center rounded-md text-sm transition border-none outline-none focus:ring-2 focus:ring-blue-400
        ${selected ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-600"}`}
      style={{ boxShadow: "none" }}
    >
      {score}
    </button>
  );

  const timelineItems = [
    { label: "Personal Information" },
    { label: "Demographic Questions" },
    { label: "Choose your role" }
  ];

  return (
    <div className="w-full min-h-screen bg-white">
      <Navbar />
      <Timeline
        items={timelineItems}
        currentStep={2}
        maxStepReached={2}
      />
      <div onSubmit={handleSubmit} className="flex flex-row max-w-6xl mx-auto mt-8 gap-8">
        {/* Left column: Responsibilities and Questions */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">Engineer Responsibilities</h2>
            <p className="text-base text-gray-600 mb-4">
              - responsible for implementation of all technological aspects of product<br />
              - attend team meetings<br />
              - complete assigned tasks by the given deadline<br />
              - update Tech Lead and PM with any relevant issues
            </p>
            <p className="text-base mb-8 text-gray-600">
              Note: Those applying for the engineer and/or tech lead role must also complete a technical assessment (estimated 2 hours) included in this application form. Please limit your responses to a short paragraph (250 words)
            </p>
            <div className="flex flex-col gap-8">
              {engineerQuestions.map((q, idx) => (
                <div key={idx}>
                  <label className="text-gray-800 text-base block mb-1">
                    {q.question} {q.isRequired && <span className="text-red-500">*</span>}
                  </label>
                  <textarea
                    className="p-3 w-full h-32 border border-gray-400 focus:border-gray-400 focus:outline-none bg-transparent text-base rounded-md resize-none"
                    required={q.isRequired}
                    value={answers[idx]}
                    onChange={e => handleAnswerChange(idx, e.target.value)}
                  />
                </div>
              ))}

              {/* Technical Assessment Section */}
              <div className="flex flex-col gap-4 mt-2">
                <label className="text-gray-800 text-base block mb-1">
                  Did you already submit a technical assessment in the previous section?
                </label>
                <select className="border border-gray-300 rounded-md p-2 w-64 bg-white text-gray-700" defaultValue="">
                  <option value="" disabled>Select an Option</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>

                <div className="mt-4">
                  <span className="font-semibold text-gray-800 text-base block mb-1">Technical Application Assessment <span className="text-red-500">*</span></span>
                  <p className="text-gray-700 text-base mb-2">
                    All applicants applying for the engineer and/or tech lead role must complete this technical assessment which should take an estimated 2 hours. Note: This assessment is not timed, and you are welcome to take as long as you need until you submit your application.
                  </p>
                  <p className="text-gray-700 text-base mb-2">
                    Instructions can be found in the following document:<br />
                    <a href="https://docs.google.com/document/d/1GiyVpVNNr4GkEoPWG6WUnqzEM4yUlw70oX5u-jpy7e0/edit?usp=sharing" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline break-all">
                      https://docs.google.com/document/d/1GiyVpVNNr4GkEoPWG6WUnqzEM4yUlw70oX5u-jpy7e0/edit?usp=sharing
                    </a>
                  </p>
                  <p className="text-gray-700 text-base mb-2">
                    If you encounter technical difficulties or have any other questions regarding the assessment, please send an email to <a href="mailto:umd-tech@hack4impact.org" className="text-blue-600 underline">umd-tech@hack4impact.org</a>
                  </p>
                </div>

                <div className="mt-2">
                  <span className="font-semibold text-gray-800 text-base block mb-1">Completed Assessment GitHub Repo URL <span className="text-red-500">*</span></span>
                  <p className="text-gray-700 text-base mb-1">e.g. https://github.com/username/FirstnameLastname-h4i-assessment-fall2024</p>
                  <p className="text-gray-700 text-base mb-1">Please ensure that your repository is private and that Hack4ImpactUMD is added as a collaborator</p>
                  <p className="text-gray-700 text-base mb-2">Only submit the application once you have completed the assessment and DO NOT continue working after the deadline. Thank you!</p>
                  <input
                    type="text"
                    className="border border-gray-400 rounded-md p-3 w-full text-base"
                  />
                </div>

                <div className="mt-2">
                  <label className="text-gray-800 text-base block mb-1">Comments/notes</label>
                  <textarea
                    className="p-3 w-full h-32 border border-gray-400 focus:border-gray-400 focus:outline-none bg-transparent text-base rounded-md resize-none"
                  />
                </div>

                <div className="flex flex-row items-center mt-6 gap-3 mb-8">
                  <button
                    type="button"
                    className="h-8 rounded-full text-sm font-semibold px-3 bg-blue-500 text-white flex items-center justify-center"
                  >
                    Review Application
                    <span className="ml-2 text-base">&#8594;</span>
                  </button>
                  <button
                    type="button"
                    className="h-8 rounded-full text-sm font-semibold px-3 bg-white text-black border border-black flex items-center justify-center"
                  >
                    Back
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Right column: Review Rubric and Scores */}
        <ReviewCard></ReviewCard>
      </div>
    </div>
  );
}
