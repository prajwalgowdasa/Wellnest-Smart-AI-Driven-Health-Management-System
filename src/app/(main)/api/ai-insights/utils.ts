// A shared variable to store the latest mock data between requests
let latestMockInsights: any = null;

// Mock data for AI insights when backend returns empty array
export const MOCK_INSIGHTS = {
  healthRisks: [
    {
      id: "1",
      category: "cardiovascular",
      name: "Cardiovascular Risk",
      level: "low",
      description:
        "Based on your blood pressure and cholesterol levels, your cardiovascular risk is low.",
      icon: "heart",
    },
    {
      id: "2",
      category: "metabolic",
      name: "Metabolic Risk",
      level: "moderate",
      description:
        "Your glucose levels indicate a moderate metabolic risk. Consider reducing sugar intake.",
      icon: "activity",
    },
    {
      id: "3",
      category: "stress",
      name: "Stress Level",
      level: "moderate",
      description:
        "Your stress indicators show moderate levels. Consider stress management techniques.",
      icon: "bar-chart-2",
    },
    {
      id: "4",
      category: "bmi",
      name: "BMI Status",
      level: "normal",
      description:
        "Your BMI is within the normal range for your height and age.",
      icon: "scale",
    },
  ],
  healthGoals: [
    {
      id: "1",
      name: "Increase daily steps",
      target: "8,000 steps daily",
      current: "5,460 steps daily",
      priority: 1,
    },
    {
      id: "2",
      name: "Reduce sodium intake",
      target: "<2,300mg daily",
      current: "~2,800mg daily",
      priority: 2,
    },
    {
      id: "3",
      name: "Sleep improvement",
      target: "7-8 hours of quality sleep",
      current: "6.2 hours average",
      priority: 3,
    },
  ],
  recommendations: [
    {
      id: "1",
      category: "diet",
      title: "Diet Suggestions",
      content:
        "Based on your recent blood test results, consider increasing foods rich in iron and vitamin B12 such as lean meats, beans, and leafy greens. Your ferritin levels are slightly below optimal range.",
    },
    {
      id: "2",
      category: "exercise",
      title: "Exercise Recommendations",
      content:
        "Your cardiovascular fitness has improved by 12% in the last 3 months. Consider adding 2 days of strength training to your current routine to improve muscle mass and metabolic health.",
    },
    {
      id: "3",
      category: "sleep",
      title: "Sleep Optimization",
      content:
        "Your sleep data shows disrupted sleep between 2-4 AM. Consider limiting fluid intake 2 hours before bedtime and maintaining a consistent sleep schedule to improve sleep quality.",
    },
  ],
  lastUpdated: new Date().toISOString(),
};

// Access functions to handle insights data
export function getLatestMockInsights() {
  return latestMockInsights;
}

export function updateLatestMockInsights(data: any) {
  latestMockInsights = data;
}

// Generate random mock insights data for updates
export function generateMockInsights() {
  const riskLevels = ["low", "moderate", "high", "normal"];
  const currentTime = new Date().toISOString();

  // Generate random risk levels with seed based on current minute to make them change
  const minute = new Date().getMinutes();
  const seed = minute % 3; // 0, 1, or 2

  return {
    healthRisks: [
      {
        id: "1",
        category: "cardiovascular",
        name: "Cardiovascular Risk",
        level: seed === 0 ? "moderate" : "low",
        description:
          "Based on your blood pressure and cholesterol levels, your cardiovascular risk is carefully monitored.",
        icon: "heart",
      },
      {
        id: "2",
        category: "metabolic",
        name: "Metabolic Risk",
        level: seed === 1 ? "high" : "moderate",
        description:
          "Your glucose levels should be watched. Consider reducing sugar intake.",
        icon: "activity",
      },
      {
        id: "3",
        category: "stress",
        name: "Stress Level",
        level: seed === 2 ? "low" : "moderate",
        description:
          "Your stress indicators show some improvement. Continue with stress management techniques.",
        icon: "bar-chart-2",
      },
      {
        id: "4",
        category: "bmi",
        name: "BMI Status",
        level: "normal",
        description:
          "Your BMI is within the normal range for your height and age.",
        icon: "scale",
      },
    ],
    healthGoals: [
      {
        id: "1",
        name: "Increase daily steps",
        target: "8,000 steps daily",
        current: `${5000 + minute * 30} steps daily`,
        priority: 1,
      },
      {
        id: "2",
        name: "Reduce sodium intake",
        target: "<2,300mg daily",
        current: "~2,800mg daily",
        priority: 2,
      },
      {
        id: "3",
        name: "Sleep improvement",
        target: "7-8 hours of quality sleep",
        current: `${5.5 + seed * 0.3} hours average`,
        priority: 3,
      },
    ],
    recommendations: [
      {
        id: "1",
        category: "diet",
        title: "Diet Suggestions",
        content:
          seed === 0
            ? "Based on your recent food log, consider increasing fiber intake with more whole grains and vegetables."
            : "Based on your recent blood test results, consider increasing foods rich in iron and vitamin B12 such as lean meats, beans, and leafy greens.",
      },
      {
        id: "2",
        category: "exercise",
        title: "Exercise Recommendations",
        content:
          seed === 1
            ? "Try adding more flexibility exercises like yoga to complement your cardio routine."
            : "Your cardiovascular fitness has improved by 12% in the last 3 months. Consider adding 2 days of strength training to your current routine.",
      },
      {
        id: "3",
        category: "sleep",
        title: "Sleep Optimization",
        content:
          seed === 2
            ? "Your sleep consistency has improved. Continue maintaining regular sleep and wake times."
            : "Your sleep data shows disrupted sleep between 2-4 AM. Consider limiting fluid intake 2 hours before bedtime.",
      },
    ],
    lastUpdated: currentTime,
  };
}
