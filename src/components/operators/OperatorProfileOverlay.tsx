
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExtendedOperator } from "@/types/operator";
import ProfileSidebar from "./ProfileSidebar";
import OperatorProfileHeader from "./OperatorProfileHeader";
import OperatorGallery from "./OperatorGallery";
import OperatorInfoTab from "./OperatorInfoTab";
import OperatorContractTab from "./OperatorContractTab";
import ImageLightbox from "@/components/ui/image-lightbox";

interface OperatorProfileOverlayProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  operator: ExtendedOperator | null;
  onEditProfile: (operatorId: number) => void;
}
const OperatorProfileOverlay: React.FC<OperatorProfileOverlayProps> = ({
  open,
  onOpenChange,
  operator,
  onEditProfile
}) => {
  const [activeTab, setActiveTab] = useState("info");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImg, setLightboxImg] = useState<string>("");

  if (!operator) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-5xl p-0 rounded-lg overflow-hidden shadow-2xl">
        <DialogHeader />
        <div className="flex flex-col md:flex-row h-[80vh]">
          {/* Sidebar */}
          <ProfileSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Main */}
          <div className="flex-1 flex flex-col p-8 overflow-auto">
            <OperatorProfileHeader
              operator={operator}
              onImageClick={src => {
                setLightboxImg(src);
                setLightboxOpen(true);
              }}
            />
            <div className="flex-1">
              {activeTab === "info" && (
                <OperatorInfoTab operator={operator} />
              )}
              {activeTab === "contract" && (
                <OperatorContractTab operator={operator} />
              )}
              {activeTab === "gallery" && (
                <OperatorGallery
                  operator={operator}
                  onImageClick={src => {
                    setLightboxImg(src);
                    setLightboxOpen(true);
                  }}
                />
              )}
            </div>
            <div className="flex justify-end mt-8 gap-2">
              <DialogClose asChild>
                <Button variant="outline">Chiudi</Button>
              </DialogClose>
              <Button variant="default" onClick={() => onEditProfile(operator.id)}>
                Aggiorna Profilo
              </Button>
            </div>
            <ImageLightbox open={lightboxOpen} onOpenChange={setLightboxOpen} src={lightboxImg} alt="Immagine profilo" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default OperatorProfileOverlay;
