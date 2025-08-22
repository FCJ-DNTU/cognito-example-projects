export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export type Encodable = JsonValue | [JsonValue, ...JsonValue[]];
