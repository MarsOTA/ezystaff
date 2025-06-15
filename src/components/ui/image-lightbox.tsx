
import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ImageLightboxProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  src: string;
  alt?: string;
}

const ImageLightbox: React.FC<ImageLightboxProps> = ({ open, onOpenChange, src, alt }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="bg-transparent p-2 flex items-center justify-center max-w-3xl">
      <img src={src} alt={alt} className="max-h-[80vh] max-w-full rounded shadow-lg" />
    </DialogContent>
  </Dialog>
);

export default ImageLightbox;
