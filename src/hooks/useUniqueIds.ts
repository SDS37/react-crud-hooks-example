import { useId } from "react";

const useUniqueIds = (count: number): string[] => {
  const prefix = useId();
  return Array.from({ length: count }, (_, index) => `${prefix}-${index}`);
};

export default useUniqueIds;
