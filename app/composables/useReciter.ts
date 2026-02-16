export const useReciter = () => {
  const selected = useState<any | null>("selectedReciter", () => null);

  // load saved reciter once (client only)
  if (process.client && !selected.value) {
    const saved = localStorage.getItem("reciter");
    if (saved) selected.value = JSON.parse(saved);
  }

  const setReciter = (reciter: any) => {
    selected.value = reciter;

    if (process.client) {
      localStorage.setItem("reciter", JSON.stringify(reciter));
    }
  };

  return { selected, setReciter };
};
