
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ExtendedOperator } from "@/types/operator";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ChevronLeft, Star, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface OperatorHeaderProps {
  operator: ExtendedOperator;
  onRatingChange: (rating: number) => void;
  onSave: () => void;
  onDelete?: (id: number) => void;
}

const OperatorHeader: React.FC<OperatorHeaderProps> = ({ 
  operator, 
  onRatingChange,
  onSave,
  onDelete
}) => {
  const navigate = useNavigate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = () => {
    if (onDelete) {
      onDelete(operator.id);
      navigate("/operators");
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Button 
          variant="outline" 
          onClick={() => navigate("/operators")}
          className="mb-4"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Torna alla lista
        </Button>
        <div className="flex gap-2 mb-4">
          <Button onClick={onSave}>Salva modifiche</Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Profilo di {operator.name}</CardTitle>
          <CardDescription>
            <div className="flex items-center mt-2">
              <span className="mr-2">Valutazione globale:</span>
              <div className="flex items-center">
                <Slider
                  value={[operator.rating]}
                  min={1}
                  max={5}
                  step={0.5}
                  onValueChange={(value) => onRatingChange(value[0])}
                  className="w-48"
                />
                <span className="ml-2 flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  {operator.rating}
                </span>
              </div>
            </div>
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Delete button moved to bottom left */}
      <div className="mt-8 flex justify-start">
        {onDelete && (
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Cancella operatore
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Sei sicuro di voler cancellare l'operatore?</AlertDialogTitle>
                <AlertDialogDescription>
                  Tutti i dati e gli eventi a lui legati saranno persi! Questa azione non può essere annullata.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annulla</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Cancella operatore
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </>
  );
};

export default OperatorHeader;
