export interface TestingData {
  month: string;
  tests: number;
  hoursSaved: number;
}

export interface ChartData extends TestingData {
  name: string;
}
