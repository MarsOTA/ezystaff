
import React from "react";
import { ExtendedOperator } from "@/types/operator";

interface Props {
  operator: ExtendedOperator;
  onImageClick: (src: string) => void;
}

const OperatorGallery: React.FC<Props> = ({ operator, onImageClick }) => {
  // Crea array con tutte le immagini disponibili dell'operatore
  const galleryImages: { label: string; src: string }[] = [
    ...(operator.profileImage ? [{ label: "Profilo", src: operator.profileImage }] : []),
    ...(operator.fullBodyPhotoFile ? [{ label: "Figura intera", src: operator.fullBodyPhotoFile }] : []),
    ...(operator.bustPhotoFile ? [{ label: "Mezzo busto", src: operator.bustPhotoFile }] : []),
    ...(operator.idCardFrontImage ? [{ label: "Documento (fronte)", src: operator.idCardFrontImage }] : []),
    ...(operator.idCardBackImage ? [{ label: "Documento (retro)", src: operator.idCardBackImage }] : []),
    ...(operator.healthCardFrontImage ? [{ label: "Tessera sanitaria (fronte)", src: operator.healthCardFrontImage }] : []),
    ...(operator.healthCardBackImage ? [{ label: "Tessera sanitaria (retro)", src: operator.healthCardBackImage }] : []),
    ...(operator.facePhotoFile ? [{ label: "Primo piano", src: operator.facePhotoFile }] : []),
    ...(operator.resumeFile ? [{ label: "CV", src: operator.resumeFile }] : []),
    ...(operator.residencePermitPhoto ? [{ label: "Permesso di soggiorno", src: operator.residencePermitPhoto }] : []),
  ].filter(img => !!img.src);

  return (
    <div className="w-full flex flex-col items-center justify-center gap-6 pt-2">
      {galleryImages.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full">
          {galleryImages.map((img, idx) => (
            <div key={idx} className="flex flex-col items-center group">
              <img
                src={img.src}
                alt={img.label}
                className="rounded-lg border shadow-lg object-cover w-[225px] h-[225px] cursor-pointer transition-transform group-hover:scale-105"
                style={{ aspectRatio: "1/1" }}
                onClick={() => onImageClick(img.src!)}
              />
              <span className="mt-2 text-xs text-gray-700 font-medium">{img.label}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-muted-foreground text-sm py-12">Nessuna foto da mostrare</div>
      )}
    </div>
  );
};

export default OperatorGallery;
