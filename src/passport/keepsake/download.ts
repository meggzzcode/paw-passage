// Tiny, dependency-free save/share helpers. They live apart from the keepsake renderer so free features (calendar and
// backup downloads) can save a file without loading any keepsake code.

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

/**
 * Opens the phone's share sheet with the image attached when the browser supports file sharing.
 * Returns "shared", "cancelled", or "download" (the caller should then call downloadBlob).
 */
export async function shareBlob(
  blob: Blob,
  filename: string,
  text: string,
): Promise<"shared" | "cancelled" | "download"> {
  try {
    const nav = typeof navigator === "undefined" ? undefined : navigator;
    if (!nav || typeof nav.share !== "function" || typeof nav.canShare !== "function")
      return "download";
    const file = new File([blob], filename, { type: blob.type || "image/png" });
    if (!nav.canShare({ files: [file] })) return "download";
    await nav.share(text ? { files: [file], text } : { files: [file] });
    return "shared";
  } catch (e) {
    if (e instanceof DOMException && e.name === "AbortError") return "cancelled";
    return "download";
  }
}
