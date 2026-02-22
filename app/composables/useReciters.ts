import recitersJson from "@/assets/data/reciters.json";

export const useReciters = () => {
  const reciters = recitersJson;
  return {
    reciters,
  };
};
