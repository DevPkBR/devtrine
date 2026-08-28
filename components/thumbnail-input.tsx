"use client";

import { useState } from "react";

const acceptedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

export function ThumbnailInput() {
  const [error, setError] = useState<string>();
  const [fileName, setFileName] = useState<string>();

  return (
    <div className="project-field file-field">
      <label htmlFor="thumbnail">Thumbnail</label>
      <input
        id="thumbnail"
        name="thumbnail"
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        aria-describedby="thumbnail-help thumbnail-error"
        onChange={(event) => {
          const file = event.currentTarget.files?.[0];
          setError(undefined);
          setFileName(undefined);
          if (!file) return;
          if (!acceptedTypes.has(file.type)) {
            event.currentTarget.value = "";
            setError("Formato não aceito. Use JPEG, PNG, WebP ou AVIF.");
            return;
          }
          if (file.size > 512000) {
            event.currentTarget.value = "";
            setError("Arquivo não selecionado: a imagem ultrapassa o limite de 500 KB.");
            return;
          }
          setFileName(`${file.name} · ${Math.ceil(file.size / 1024)} KB`);
        }}
        required
      />
      <small id="thumbnail-help">JPEG, PNG, WebP ou AVIF. Tamanho máximo: 500 KB.</small>
      {fileName ? <span className="file-success">{fileName}</span> : null}
      {error ? <span className="file-error" id="thumbnail-error" role="alert">{error}</span> : null}
    </div>
  );
}
