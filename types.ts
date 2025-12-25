export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  TUTOR = 'TUTOR',
  CALCULATORS = 'CALCULATORS',
  SIMULATION = 'SIMULATION',
  STANDARDS = 'STANDARDS',
  AUTOCAD = 'AUTOCAD',
  BIM = 'BIM',
  DESIGN = 'DESIGN',
  LIGHTING = 'LIGHTING',
  POWER_SYSTEMS = 'POWER_SYSTEMS'
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
  timestamp: number;
}

export interface CalculationTool {
  id: string;
  name: string;
  description: string;
  category: 'Basic' | 'Power' | 'Components';
  inputs: { 
    name: string; 
    label: string; 
    unit?: string;
    options?: { label: string; value: number }[];
  }[];
  calculate: (values: Record<string, number>) => { result: number; unit: string; steps: string };
}

export interface ChartDataPoint {
  time: number;
  value: number;
  value2?: number;
}