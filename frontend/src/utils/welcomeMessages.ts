type WeightedMessage = {
  message: string;
  weight: number;
};

const defaultMessages: WeightedMessage[] = [
  { message: "@Krishnan Tholkappian sniped", weight: 5 },
  { message: "Commit that code!", weight: 5 },
  { message: "cookbokd", weight: 5 },
  { message: "cook book dot tisk", weight: 5 },
  { message: "Help us become a YC-backed B2B AI SaaS startup!", weight: 3 },
  { message: "(Git) commitment issues", weight: 5 },
  { message: "Git push aye, we committin' it!", weight: 5 },
  { message: "tweak week!", weight: 5 },
  { message: "let's just get ramy to fix it", weight: 5 },
  { message: "I'm not retired, I'm deprecated.", weight: 5 },
  { message: "E = mc^2 + AI", weight: 3 },
  { message: "Please commit responsibly.", weight: 3 },
  { message: "Spin the wheel!", weight: 5 },
  { message: "don't push to main 😡", weight: 3 },
  { message: "Javid Fathi", weight: 1 },
  { message: "this week, imma see hita 5 times for h4i", weight: 5 },
  { message: "ayyy you (show and) tell em, @Steven Ha!! 🗣️🗣️🗣️", weight: 5 },
  { message: "first ever gaming coffee chat", weight: 5 },
  { message: "Always pixel farming at Looneys", weight: 5 },
  { message: "Turns out the dinosaurs aren't extinct", weight: 1 },
  {
    message: "👋 everyone, it's time to take a new randomcoffee 🎉",
    weight: 1,
  },
  { message: "Building Software for Social Good", weight: 25 },
  { message: "https://www.youtube.com/shorts/65eGmmvS_OE", weight: 1 },
];

export const loggedInMessages: WeightedMessage[] = [
  ...defaultMessages,
  { message: "Welcome back!", weight: 50 },
];

export const loggedOutMessages: WeightedMessage[] = [
  ...defaultMessages,
  { message: "Apply to be a Hack4Impact-UMD member!", weight: 100 },
];

export function pickWeightedMessage(messages: WeightedMessage[]): string {
  const totalWeight = messages.reduce((sum, msg) => sum + msg.weight, 0);

  let random = Math.random() * totalWeight;

  for (const msg of messages) {
    random -= msg.weight;
    if (random <= 0) {
      return msg.message;
    }
  }

  // fallback to make typing happy
  return messages[0].message;
}
