
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { ExtendedOperator } from "@/types/operator";

interface SizesCardProps {
  operator: ExtendedOperator;
  onSizeToggle: (size: string) => void;
}

const clothingSizes = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

const SizesCard: React.FC<SizesCardProps> = ({ operator, onSizeToggle }) => (
  <div>
    <Label className="text-sm font-medium">Taglie</Label>
    <div className="flex flex-wrap gap-2 mt-2">
      {clothingSizes.map((size) => (
        <Badge
          key={size}
          variant={operator.sizes?.includes(size) ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => onSizeToggle(size)}
        >
          {size}
        </Badge>
      ))}
    </div>
  </div>
);

export default SizesCard;
