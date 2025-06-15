
import React from "react";
import { ExtendedOperator } from "@/types/operator";

interface Props {
  operator: ExtendedOperator;
  onImageClick: (src: string) => void;
}

const getInitials = (name: string, surname: string) => ((name?.[0] || "") + (surname?.[0] || "")).toUpperCase();

const OperatorProfileHeader: React.FC<Props> = ({ operator, onImageClick }) => (
  <div className="flex items-center justify-start mb-8 gap-6 w-full">
    <div className="relative flex-shrink-0 w-[175px] h-[175px]">
      {operator.profileImage ? (
        <>
          <img
            src={operator.profileImage}
            alt="Profile"
            className="rounded-full object-cover border-4 border-background shadow w-[175px] h-[175px] cursor-pointer"
            style={{ objectFit: "cover" }}
            onClick={() => onImageClick(operator.profileImage!)}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white text-2xl font-bold drop-shadow-lg bg-black/30 px-4 py-2 rounded-full text-center pointer-events-none">
              {operator.name} {operator.surname}
            </span>
          </div>
        </>
      ) : (
        <>
          <div className="rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold text-gray-500 border-4 border-background shadow w-[175px] h-[175px]">
            {getInitials(operator.name, operator.surname)}
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-gray-700 text-2xl font-bold px-4 py-2 rounded-full bg-white/70 text-center pointer-events-none">
              {operator.name} {operator.surname}
            </span>
          </div>
        </>
      )}
    </div>
  </div>
);
export default OperatorProfileHeader;
