interface VistaPreviaDniProps {
  previewUrl: string | null;
}

export const VistaPreviaDni = ({ previewUrl }: VistaPreviaDniProps) => {
  if (!previewUrl) return null;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <img
        src={previewUrl}
        alt="Preview DNI"
        className="w-full h-auto rounded-lg border-2 border-gray-200 shadow-md"
      />
    </div>
  );
};
