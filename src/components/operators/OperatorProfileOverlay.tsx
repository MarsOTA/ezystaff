import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExtendedOperator } from "@/types/operator";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import ImageLightbox from "@/components/ui/image-lightbox";
import { User, FileText, DollarSign } from "lucide-react";

// Utility per età
function calculateAge(birthDateStr?: string): number | null {
  if (!birthDateStr) return null;
  const date = new Date(birthDateStr);
  if (isNaN(date.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - date.getFullYear();
  const m = today.getMonth() - date.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < date.getDate())) age--;
  return age;
}

const sideMenu = [
  { key: "info", title: "Info Operatore", icon: User },
  { key: "contract", title: "Contrattualistica", icon: FileText },
  { key: "payroll", title: "Payroll", icon: DollarSign },
];

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
  // Tab management
  const [activeTab, setActiveTab] = useState("info");

  // Carousel/Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImg, setLightboxImg] = useState<string>("");

  if (!operator) return null;
  const eta = calculateAge(operator.birthDate);

  // Avatar fallback lettera
  const getInitials = (name: string, surname: string) =>
    ((name?.[0] || "") + (surname?.[0] || "")).toUpperCase();

  const profileImages: { label: string; src?: string }[] = [
    { label: "Profilo", src: operator.profileImage },
    { label: "Documento (fronte)", src: operator.idCardFrontImage },
    { label: "Documento (retro)", src: operator.idCardBackImage },
  ].filter(img => img.src);

  // Schede contenuto
  function renderTabContent() {
    if (activeTab === "info") {
      return (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-muted-foreground">Email</div>
              <div className="font-medium break-words">{operator.email || "-"}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Telefono</div>
              <div className="font-medium">{operator.phone || "-"}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Genere</div>
              <div className="font-medium">{operator.gender || "-"}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Codice Fiscale</div>
              <div className="font-medium">{operator.fiscalCode || "-"}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Data di nascita</div>
              <div className="font-medium">{operator.birthDate || "-"}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Età</div>
              <div className="font-medium">{eta !== null ? eta : "-"}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Nazionalità</div>
              <div className="font-medium">{operator.nationality || "-"}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Indirizzo</div>
              <div className="font-medium">{operator.address || "-"}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Altezza (cm)</div>
              <div className="font-medium">{operator.height ? operator.height : "-"}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Peso (kg)</div>
              <div className="font-medium">{operator.weight ? operator.weight : "-"}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">N° Scarpe</div>
              <div className="font-medium">{operator.shoeSize ? operator.shoeSize : "-"}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Tatuaggi visibili</div>
              <div className="font-medium">
                {typeof operator.visibleTattoos === "boolean"
                  ? operator.visibleTattoos ? "Sì" : "No"
                  : "-"}
              </div>
            </div>
          </div>
        </div>
      );
    }
    if (activeTab === "contract") {
      // Contrattualistica: se c'è contratto caricato mostra nome, link, bottone per re-upload
      return (
        <div className="space-y-4">
          <div className="font-semibold">Contratto firmato:</div>
          {operator.contractPdfName && (
            <div>
              <a
                href={operator.contractPdf}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-primary mr-2"
              >
                {operator.contractPdfName}
              </a>
            </div>
          )}
        </div>
      );
    }
    if (activeTab === "payroll") {
      return (
        <div>
          <div className="text-muted-foreground">Modulo payroll</div>
        </div>
      );
    }
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-5xl p-0 rounded-lg overflow-hidden shadow-2xl">
        <div className="flex flex-col md:flex-row h-[80vh]">
          {/* Sidebar */}
          <div className="bg-muted w-full md:w-64 flex-shrink-0 p-6 space-y-8 border-r">
            <div>
              <h2 className="text-lg font-bold mb-6">Profilo</h2>
              <nav className="space-y-2">
                {sideMenu.map((section) => (
                  <button
                    key={section.key}
                    className={`block text-left w-full py-2 px-3 rounded hover:bg-primary/10 focus:outline-none font-medium ${activeTab === section.key ? "bg-primary/10 text-primary" : "text-muted-foreground"}`}
                    onClick={() => setActiveTab(section.key)}
                  >
                    <section.icon className="inline-block mr-2 mb-1 h-4 w-4" />
                    {section.title}
                  </button>
                ))}
              </nav>
            </div>
          </div>
          {/* Main content */}
          <div className="flex-1 flex flex-col p-8 overflow-auto">
            <div className="flex flex-col items-center space-y-3 mb-6">
              {/* Profilo */}
              {operator.profileImage ? (
                <img
                  src={operator.profileImage}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-background shadow"
                  onClick={() => {
                    setLightboxImg(operator.profileImage!);
                    setLightboxOpen(true);
                  }}
                  style={{ cursor: "pointer" }}
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-500 border-4 border-background shadow">
                  {getInitials(operator.name, operator.surname)}
                </div>
              )}
              {/* Carosello immagini */}
              {profileImages.length > 1 && (
                <div className="w-full max-w-xs">
                  <Carousel opts={{ align: "start" }}>
                    <CarouselContent>
                      {profileImages.map((img, idx) => (
                        <CarouselItem key={idx} className="basis-1/3 flex">
                          <img
                            src={img.src!}
                            alt={img.label}
                            className="w-20 h-20 rounded object-cover border mr-2 cursor-pointer"
                            onClick={() => {
                              setLightboxImg(img.src!);
                              setLightboxOpen(true);
                            }}
                          />
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                </div>
              )}
              <div className="text-xl font-bold">{operator.name} {operator.surname}</div>
              <div className="text-sm text-muted-foreground">{operator.profession || "N/A"}</div>
            </div>
            <div className="flex-1">{renderTabContent()}</div>
            <div className="flex justify-end mt-8 gap-2">
              <DialogClose asChild>
                <Button variant="outline">Chiudi</Button>
              </DialogClose>
              <Button 
                variant="default"
                onClick={() => onEditProfile(operator.id)}
              >
                Aggiorna Profilo
              </Button>
            </div>
            <ImageLightbox
              open={lightboxOpen}
              onOpenChange={setLightboxOpen}
              src={lightboxImg}
              alt="Immagine profilo"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OperatorProfileOverlay;
