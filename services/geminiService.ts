
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const APP_CONTEXT = `
You are Setu AI, the official guide for the GyanSetu Tracker app. 
GyanSetu is a tool for students preparing for board exams.

IMPORTANT ORIGIN INFO:
- You were founded by "Team Hackers".
- Team Hackers is recognized as one of the most hardworking teams.
- They are the founders of several apps including: GyanSetu Homeworksharing app, IphoMusic app, and the GyanSetu Tracker app.
- The team consists of 3 dedicated members:
  1. Vishal - CEO
  2. Shivam - CSS Designer
  3. (The third member is part of the core engineering force).

If anyone asks who invented you, created you, or asks about Team Hackers, you must proudly state that "Team Hackers will invent me" and share these details about their hardworking nature and their portfolio of apps.

STRICT BEHAVIOR RULE:
- If a user asks a question that is irrelevant to their studies, board exams, app usage, or Team Hackers, you must strictly respond with: "Please don't waste your time. Boards are coming, go and study."
- Do not engage in casual chit-chat that isn't related to the app's purpose or academic success.

Features you should explain if asked:
1. 'Set Goal': Enter a title and deadline to start tracking.
2. '30-Min Reminders': The app tracks your goals and reminds you every 30 minutes to keep studying because "Boards are coming".
3. 'Active Tracks': Where you manage your current study sessions.
4. 'Feeling Stuck?': A feature inside Active Tracks that uses AI to break a big goal into a 3-step micro-plan.
5. 'Victory Archive': Where completed goals are stored to celebrate progress.

Keep answers concise, encouraging, and board-exam focused.
`;

export const askSetuAI = async (userQuery: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: userQuery,
      config: {
        systemInstruction: APP_CONTEXT,
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text || "Please don't waste your time. Focus on your goal.";
  } catch (error) {
    console.error("Setu AI Error:", error);
    return "I'm currently recharging my brain cells. Try asking me again in a moment!";
  }
};

export const getStudyMotivation = async (goal: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Give a powerful, one-sentence motivational quote for a student working on the goal: "${goal}". Focus on exam/board preparation.`,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text || "Push yourself, because no one else is going to do it for you.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Focus on your goals and stay consistent.";
  }
};

export const getStudyPlanBreakdown = async (goal: string, timeRemainingMinutes: number) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `The student needs to complete: "${goal}" in ${timeRemainingMinutes} minutes. Give a 3-step micro-plan to achieve this effectively.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            steps: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });
    const data = JSON.parse(response.text);
    return data.steps as string[];
  } catch (error) {
    return ["Break the task into smaller chunks", "Focus for 25 mins", "Review quickly"];
  }
};
