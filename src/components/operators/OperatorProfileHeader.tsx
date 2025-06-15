
import React from "react";
import { ExtendedOperator } from "@/types/operator";

interface Props {
  operator: ExtendedOperator;
  onImageClick: (src: string) => void;
}

const getInitials = (name: string, surname: string) =>
  ((name?.[0] || "") + (surname?.[0] || "")).toUpperCase();

const OperatorProfileHeader: React.FC<Props> = ({ operator, onImageClick }) => (
  <div className="flex items-center justify-start mb-8 w-full">
    <div className="relative flex-shrink-0 w-[175px] h-[175px]">
      {operator.profileImage ? (
        <img
          src={operator.profileImage}
          alt="Profile"
          className="rounded-full object-cover border-4 border-background shadow w-[175px] h-[175px] cursor-pointer"
          style={{ objectFit: "cover" }}
          onClick={() => onImageClick(operator.profileImage!)}
        />
      ) : (
        <div className="rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold text-gray-500 border-4 border-background shadow w-[175px] h-[175px]">
          {getInitials(operator.name, operator.surname)}
        </div>
      )}
    </div>
    <div className="pl-5 flex flex-col justify-center">
      <span className="text-2xl font-bold text-gray-900">
        {operator.name} {operator.surname}
      </span>
    </div>
  </div>
);

export default OperatorProfileHeader;
