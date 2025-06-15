import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExtendedOperator } from "@/types/operator";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import ImageLightbox from "@/components/ui/image-lightbox";
import { User, FileText } from "lucide-react";

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
const sideMenu = [{
  key: "info",
  title: "Info Operatore",
  icon: User
}, {
  key: "contract",
  title: "Contrattualistica",
  icon: FileText
}];
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
  const getInitials = (name: string, surname: string) => ((name?.[0] || "") + (surname?.[0] || "")).toUpperCase();
  const profileImages: {
    label: string;
    src?: string;
  }[] = [{
    label: "Profilo",
    src: operator.profileImage
  }, {
    label: "Figura intera",
    src: operator.fullBodyPhotoFile
  }, {
    label: "Mezzo busto",
    src: operator.bustPhotoFile
  }, {
    label: "Documento (fronte)",
    src: operator.idCardFrontImage
  }, {
    label: "Documento (retro)",
    src: operator.idCardBackImage
  }].filter(img => img.src);

  // ---- Render Tabs ----
  function renderTabContent() {
    if (activeTab === "info") {
      return <div className="space-y-2">
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
                {typeof operator.visibleTattoos === "boolean" ? operator.visibleTattoos ? "Sì" : "No" : "-"}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">N° Carta d'Identità</div>
              <div className="font-medium">{operator.idCardNumber || "-"}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Cittadinanza</div>
              <div className="font-medium">{operator.citizenship || "-"}</div>
            </div>
            {operator.citizenship === "Straniera" && <>
                <div>
                  <div className="text-xs text-muted-foreground">N° Permesso di Soggiorno</div>
                  <div className="font-medium">{operator.residencePermitNumber || "-"}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Tipo Permesso di Soggiorno</div>
                  <div className="font-medium">{operator.residencePermitType || "-"}</div>
                </div>
              </>}
            <div>
              <div className="text-xs text-muted-foreground">Patente valida</div>
              <div className="font-medium">
                {operator.driversLicense ? "Sì" : "No"}
              </div>
            </div>
            {operator.driversLicense && <>
                <div>
                  <div className="text-xs text-muted-foreground">N° Patente</div>
                  <div className="font-medium">{operator.driversLicenseNumber || "-"}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Automunito</div>
                  <div className="font-medium">
                    {typeof operator.hasVehicle === "boolean" ? operator.hasVehicle ? "Sì" : "No" : "-"}
                  </div>
                </div>
              </>}
          </div>
        </div>;
    }
    if (activeTab === "contract") {
      // Contrattualistica: mostra tutti i dati principali e eventuale contratto
      const cd = operator.contractData || {};
      return <div className="space-y-4">
          <div className="font-semibold mb-2">Dati Contrattuali</div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-muted-foreground">Tipo Contratto</div>
              <div className="font-medium">{cd.contractType || "-"}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">CCNL</div>
              <div className="font-medium">{cd.ccnl || "-"}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Livello</div>
              <div className="font-medium">{cd.level || "-"}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Tipo mansione</div>
              <div className="font-medium">{cd.jobType || "-"}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Inizio contratto</div>
              <div className="font-medium">{cd.startDate ? new Date(cd.startDate).toLocaleDateString('it-IT') : "-"}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Fine contratto</div>
              <div className="font-medium">
                {cd.endDate ? new Date(cd.endDate).toLocaleDateString('it-IT') : "-"}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Retribuzione Lorda</div>
              <div className="font-medium">{cd.grossSalary || "-"}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Retribuzione Netta</div>
              <div className="font-medium">{cd.netSalary || "-"}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Ore settimanali</div>
              <div className="font-medium">{cd.weeklyHours || "-"}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Percentuale Orario</div>
              <div className="font-medium">{cd.normalHoursPercentage || "-"}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Sede Lavoro</div>
              <div className="font-medium">{cd.workLocation || "-"}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Location Lavoro</div>
              <div className="font-medium">{cd.workSite || "-"}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Paga base e contingenza</div>
              <div className="font-medium">{cd.basePayAndContingency || "-"}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">EDR</div>
              <div className="font-medium">{cd.edr || "-"}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Totale retribuzione mese</div>
              <div className="font-medium">{cd.totalMonthlyCompensation || "-"}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Totale annuo</div>
              <div className="font-medium">{cd.totalAnnualCompensation || "-"}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Data firma contratto</div>
              <div className="font-medium">{cd.contractSignDate ? new Date(cd.contractSignDate).toLocaleDateString('it-IT') : "-"}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Dicitura contratto</div>
              <div className="font-medium">{cd.contractClause || "-"}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Dicitura orario di lavoro</div>
              <div className="font-medium">{cd.workingHoursClause || "-"}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Riproporzionamento</div>
              <div className="font-medium">{cd.rebalancing || "-"}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Nominativo Formatore</div>
              <div className="font-medium">{cd.trainerName || "-"}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Inizio formazione</div>
              <div className="font-medium">{cd.trainingStartDate ? new Date(cd.trainingStartDate).toLocaleDateString('it-IT') : "-"}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Fine formazione</div>
              <div className="font-medium">{cd.trainingEndDate ? new Date(cd.trainingEndDate).toLocaleDateString('it-IT') : "-"}</div>
            </div>
          </div>
          <div className="font-semibold mt-4">Contratto firmato:</div>
          {operator.contractPdfName && operator.contractPdf && <div>
              <a href={operator.contractPdf} target="_blank" rel="noopener noreferrer" className="underline text-primary mr-2" download={operator.contractPdfName}>
                {operator.contractPdfName}
              </a>
            </div>}
        </div>;
    }
    return null;
  }
  return <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-5xl p-0 rounded-lg overflow-hidden shadow-2xl">
        <DialogHeader>
          
          
        </DialogHeader>
        <div className="flex flex-col md:flex-row h-[80vh]">
          {/* Sidebar */}
          <div className="bg-muted w-full md:w-64 flex-shrink-0 p-6 space-y-8 border-r py-[4px]">
            <div>
              <h2 className="text-lg font-bold mb-6">Profilo</h2>
              <nav className="space-y-2">
                {sideMenu.map(section => <button key={section.key} className={`block text-left w-full py-2 px-3 rounded hover:bg-primary/10 focus:outline-none font-medium ${activeTab === section.key ? "bg-primary/10 text-primary" : "text-muted-foreground"}`} onClick={() => setActiveTab(section.key)}>
                    <section.icon className="inline-block mr-2 mb-1 h-4 w-4" />
                    {section.title}
                  </button>)}
              </nav>
            </div>
          </div>
          {/* Main content */}
          <div className="flex-1 flex flex-col p-8 overflow-auto">
            {/* Header con immagine profilo e dati anagrafici allineati */}
            <div className="flex items-start mb-8 gap-8">
              {/* Immagine profilo */}
              {operator.profileImage ? (
                <img
                  src={operator.profileImage}
                  alt="Profile"
                  className="rounded-full object-cover border-4 border-background shadow"
                  onClick={() => {
                    setLightboxImg(operator.profileImage!);
                    setLightboxOpen(true);
                  }}
                  style={{
                    cursor: "pointer",
                    width: 350,
                    height: 350,
                  }}
                />
              ) : (
                <div
                  className="rounded-full bg-gray-200 flex items-center justify-center text-5xl font-bold text-gray-500 border-4 border-background shadow"
                  style={{
                    width: 350,
                    height: 350,
                  }}
                >
                  {getInitials(operator.name, operator.surname)}
                </div>
              )}

              {/* Nome e cognome a destra */}
              <div className="flex flex-col justify-center ml-0" style={{ minWidth: 0, flex: 1 }}>
                <div className="text-3xl font-bold break-words">{operator.name} {operator.surname}</div>
                {/* Se vuoi altri dettagli anagrafici qui, aggiungili qui */}
              </div>
            </div>
            {/* Carosello immagini secondarie */}
            {profileImages.length > 1 &&
              <div className="w-full max-w-xs mb-6">
                <Carousel opts={{ align: "start" }}>
                  <CarouselContent>
                    {profileImages.map((img, idx) => <CarouselItem key={idx} className="basis-1/3 flex">
                        <img src={img.src!} alt={img.label} className="w-20 h-20 rounded object-cover border mr-2 cursor-pointer" onClick={() => {
                      setLightboxImg(img.src!);
                      setLightboxOpen(true);
                    }} />
                      </CarouselItem>)}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </div>
            }

            <div className="flex-1">{renderTabContent()}</div>
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
    </Dialog>;
};
export default OperatorProfileOverlay;
