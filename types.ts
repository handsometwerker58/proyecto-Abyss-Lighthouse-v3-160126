
export enum TargetID {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
  E = 'E'
}

export interface Target {
  id: TargetID;
  label: string;
  description: string;
}

export interface DailyData {
  day: number;
  hoursWorked: number;
  outputUnits: number; // Quantitative measure based on target
  hoursSlept: number;
  emotionalInterference: number; // Percentage 0-100
  medication: boolean;
}

export interface AuditData {
  target: TargetID;
  sevenDayData: DailyData[];
  thirtyDayStructural: string;
}

export enum AppStep {
  ONBOARDING = 'ONBOARDING',
  INITIALIZATION = 'INITIALIZATION',
  DATA_AUDIT = 'DATA_AUDIT',
  SENTENCE = 'SENTENCE'
}
