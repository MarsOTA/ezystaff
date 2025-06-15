
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { ExtendedOperator } from "@/types/operator";

interface LanguagesCardProps {
  operator: ExtendedOperator;
  onLanguageToggle: (language: string, type: "fluent" | "basic") => void;
}

const languages = [
  "Italiano", "Inglese", "Francese", "Spagnolo", "Tedesco", 
  "Russo", "Cinese", "Arabo", "Giapponese", "Turco", "Portoghese", "Singalese", "Altro"
];

const LanguagesCard: React.FC<LanguagesCardProps> = ({ operator, onLanguageToggle }) => (
  <div className="space-y-4">
    <div>
      <Label className="text-sm font-medium">Lingue Fluenti</Label>
      <div className="flex flex-wrap gap-2 mt-2">
        {languages.map((language) => (
          <Badge
            key={`fluent-${language}`}
            variant={operator.fluentLanguages?.includes(language) ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => onLanguageToggle(language, 'fluent')}
          >
            {language}
          </Badge>
        ))}
      </div>
    </div>
    
    <div>
      <Label className="text-sm font-medium">Lingue Base</Label>
      <div className="flex flex-wrap gap-2 mt-2">
        {languages.map((language) => (
          <Badge
            key={`basic-${language}`}
            variant={operator.basicLanguages?.includes(language) ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => onLanguageToggle(language, 'basic')}
          >
            {language}
          </Badge>
        ))}
      </div>
    </div>
  </div>
);

export default LanguagesCard;
