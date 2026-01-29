import { PageService } from "~/services/page.service";

export const usePage = () => {
  const getPage = async (id: number) => {
    return await PageService.getPageByNumber(id);
  };

  return {
    getPage,
  };
};
