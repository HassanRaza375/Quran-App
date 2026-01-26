import { SajdaService } from "~/services/sajda.service";
export const useSajda = () => {
  const getAll = async () => {
    return await SajdaService.getAllSajdas();
  };

  return {
    getAll,
  };
};
