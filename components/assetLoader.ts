const RAW_BASE = "https://raw.githubusercontent.com/SHAA52/october1993/main/assets";

function partName(index: number) {
  return `part-${String(index).padStart(3, "0")}.txt`;
}

async function fetchBase64Parts(asset: string, parts: number) {
  const values = await Promise.all(
    Array.from({ length: parts }, async (_, index) => {
      const response = await fetch(`${RAW_BASE}/${asset}/${partName(index)}`);
      if (!response.ok) {
        throw new Error(`Не удалось загрузить ${asset}: ${response.status}`);
      }
      return response.text();
    }),
  );
  return values.join("").trim();
}

function decodeBase64(base64: string) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

export async function loadImageAsset(asset: string, parts: number, mimeType: string) {
  const base64 = await fetchBase64Parts(asset, parts);
  return URL.createObjectURL(new Blob([decodeBase64(base64)], { type: mimeType }));
}

export async function loadGzippedAsset(asset: string, parts: number, mimeType: string) {
  const base64 = await fetchBase64Parts(asset, parts);
  const compressed = decodeBase64(base64);
  const stream = new Blob([compressed]).stream().pipeThrough(new DecompressionStream("gzip"));
  const buffer = await new Response(stream).arrayBuffer();
  return URL.createObjectURL(new Blob([buffer], { type: mimeType }));
}
