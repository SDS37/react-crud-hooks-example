import { useRef } from "react";

let lastId = 0;

const nextId = () => {
  lastId += 1;
  return `id-${lastId}`;
};

const useUniqueIds = (count) => {
  const ids = useRef(null);
  if (ids.current === null) {
    ids.current = [...new Array(count)].map(nextId);
  }
  return ids.current;
};

export default useUniqueIds;
