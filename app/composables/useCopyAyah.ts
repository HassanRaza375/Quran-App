export const useCopyAyah = (ayah: any) => {
  const { toast } = useToast();
  const copyText = async (textToCopy: any) => {
    if (!process.client || !textToCopy) return;

    try {
      await navigator.clipboard.writeText(textToCopy);
      toast("Copied to clipboard!", { color: "success" });
    } catch (err) {
      toast("Failed to copy", { color: "error" });
    }
  };

  return {
    copyText,
  };
};
