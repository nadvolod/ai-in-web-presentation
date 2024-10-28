import { TestingData } from "../types";

export const saveToLocalStorage = (key: string, data: any) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(data));
  }
};

export const loadFromLocalStorage = (key: string, defaultValue: any) => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  }
  return defaultValue;
};

export const initialTestingData: TestingData[] = [
  { month: "Jan", tests: 50, hoursSaved: 100 },
  { month: "Feb", tests: 75, hoursSaved: 150 },
  { month: "Mar", tests: 100, hoursSaved: 200 },
];
