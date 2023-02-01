export interface Setting {
  key: string;
  valueInt?: number;
  valueFloat?: number;
  valueString?: string;
  valueJson?: Record<string, any>;
}
