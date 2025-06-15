
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExtendedOperator } from "@/types/operator";

/**
 * Utility per calcolare età da stringa YYYY-MM-DD (o simili)
 */
function calculateAge(birthDateStr?: string): number | null {
  if (!birthDateStr) return null;
  const date = new Date(birthDateStr);
  if (isNaN(date.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - date.getFullYear();
  const m = today.getMonth() - date.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < date.getDate())) {
    age--;
  }
  return age;
}

interface OperatorProfileOverlayProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  operator: ExtendedOperator | null;
  onEditProfile: (operatorId: number) => void;
}

const menuSections = [
  { title: "Informazioni Personali" },
  { title: "Contatti" },
  { title: "Documenti" },
  { title: "Competenze" },
  { title: "Note" }
];

const OperatorProfileOverlay: React.FC<OperatorProfileOverlayProps> = ({
  open,
  onOpenChange,
  operator,
  onEditProfile
}) => {
  if (!operator) return null;

  // Avatar fallback lettera
  const getInitials = (name: string, surname: string) =>
    ((name?.[0] || "") + (surname?.[0] || "")).toUpperCase();

  const eta = calculateAge(operator.birthDate);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-2xl p-0 rounded-lg overflow-hidden">
        <div className="flex flex-col md:flex-row h-[70vh]">
          {/* Sidebar */}
          <div className="bg-muted w-full md:w-56 flex-shrink-0 p-6 space-y-6 border-r">
            <div>
              <h2 className="text-lg font-bold mb-6">Profilo</h2>
              <nav className="space-y-4">
                {menuSections.map((section) => (
                  <button
                    key={section.title}
                    className="block text-left w-full py-1.5 px-2 rounded hover:bg-primary/10 focus:outline-none text-muted-foreground font-medium"
                  >
                    {section.title}
                  </button>
                ))}
              </nav>
            </div>
          </div>
          {/* Main content */}
          <div className="flex-1 flex flex-col p-8 overflow-auto">
            <div className="flex flex-col items-center space-y-3 mb-6">
              {operator.profileImage ? (
                <img
                  src={operator.profileImage}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-background shadow"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-500 border-4 border-background shadow">
                  {getInitials(operator.name, operator.surname)}
                </div>
              )}
              <div className="text-xl font-bold">{operator.name} {operator.surname}</div>
              <div className="text-sm text-muted-foreground">{operator.profession || "N/A"}</div>
            </div>

            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-muted-foreground">Email</div>
                  <div className="font-medium">{operator.email || "-"}</div>
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
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OperatorProfileOverlay;
