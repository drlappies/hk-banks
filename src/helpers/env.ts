export const isNodeDev = (): boolean => process.env.NODE_ENV === "development";

export const isNodeProd = (): boolean => process.env.NODE_ENV === "production";
