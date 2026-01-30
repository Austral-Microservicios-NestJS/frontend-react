import { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { X, UploadCloud, Image as ImagenIcon } from "lucide-react";

interface ImageUploadProps {
  value?: File | null;
  onChange: (file: File | null) => void;
  previewUrl?: string; // For initial preview if editing
}

export const ImageUpload = ({
  value,
  onChange,
  previewUrl,
}: ImageUploadProps) => {
  const [preview, setPreview] = useState<string | null>(previewUrl || null);

  useEffect(() => {
    if (value) {
      const objectUrl = URL.createObjectURL(value);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else if (!previewUrl) {
      setPreview(null);
    }
  }, [value, previewUrl]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        onChange(file);
      }
    },
    [onChange],
  );

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    setPreview(null);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps()}
      className={`
        relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
        ${
          isDragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400 bg-gray-50"
        }
      `}
    >
      <input {...getInputProps()} />

      {preview ? (
        <div className="relative w-full h-48 flex justify-center items-center overflow-hidden rounded-md">
          <img
            src={preview}
            alt="Preview"
            className="max-w-full max-h-full object-contain"
          />
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors shadow-sm"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 text-gray-500">
          <div className="p-3 bg-white rounded-full shadow-sm">
            <UploadCloud size={24} className="text-blue-500" />
          </div>
          <div className="text-sm">
            <span className="font-semibold text-blue-600">
              Haz clic para subir
            </span>{" "}
            o arrastra y suelta
          </div>
          <p className="text-xs text-gray-400">JPG, PNG, WEBP (Máx. 5MB)</p>
        </div>
      )}
    </div>
  );
};
