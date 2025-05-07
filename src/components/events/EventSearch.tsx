
import React from 'react';
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface EventSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const EventSearch: React.FC<EventSearchProps> = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="relative w-full max-w-sm">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search className="w-4 h-4 text-gray-400" />
      </div>
      <Input
        placeholder="Cerca evento"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-10"
      />
    </div>
  );
};

export default EventSearch;
