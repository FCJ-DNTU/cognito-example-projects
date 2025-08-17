export type TBaseErrorDetail = { source: string; desc: string };
export type TErrorDetails = {
  reasons?: Array<TBaseErrorDetail & Record<string, any>>;
};
