/** Shared "download audio to device" helper — used anywhere a play button
 * for surah/ayah recitation exists (Duas' AyahReferenceCard, the Surah
 * reader, Surah listing). Fetches the mp3 as a blob so the browser always
 * saves a file (an `<a download>` pointed straight at a cross-origin CDN
 * url is not guaranteed to download rather than navigate); falls back to
 * opening the direct url if the fetch is blocked (e.g. no CORS header on
 * the CDN response) so the user can still save it manually. */
export const useAudioDownload = () => {
  const { toast } = useToast();
  const downloadingUrl = useState<string | null>("audio-downloading-url", () => null);

  const downloadAudio = async (url: string | null | undefined, filename: string) => {
    if (!url) return;
    downloadingUrl.value = url;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("fetch failed");
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename.endsWith(".mp3") ? filename : `${filename}.mp3`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(url, "_blank");
      toast("Opened audio in a new tab — save it from there", { color: "info" });
    } finally {
      if (downloadingUrl.value === url) downloadingUrl.value = null;
    }
  };

  const isDownloading = (url: string | null | undefined) => !!url && downloadingUrl.value === url;

  return { downloadAudio, isDownloading };
};
