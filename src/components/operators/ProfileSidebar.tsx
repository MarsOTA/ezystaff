
import React from "react";
import { User, FileText, GalleryHorizontal } from "lucide-react";

const sideMenu = [
  {
    key: "info",
    title: "Info Operatore",
    icon: User,
  },
  {
    key: "contract",
    title: "Contrattualistica",
    icon: FileText,
  },
  {
    key: "gallery",
    title: "Gallery",
    icon: GalleryHorizontal,
  }
];

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}
const ProfileSidebar: React.FC<Props> = ({ activeTab, setActiveTab }) => (
  <div className="bg-muted w-full md:w-64 flex-shrink-0 p-6 space-y-8 border-r py-[4px]">
    <div>
      <h2 className="text-lg font-bold mb-6">Profilo</h2>
      <nav className="space-y-2">
        {sideMenu.map((section) => (
          <button
            key={section.key}
            className={`block text-left w-full py-2 px-3 rounded hover:bg-primary/10 focus:outline-none font-medium ${
              activeTab === section.key
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground"
            }`}
            onClick={() => setActiveTab(section.key)}
          >
            <section.icon className="inline-block mr-2 mb-1 h-4 w-4" />
            {section.title}
          </button>
        ))}
      </nav>
    </div>
  </div>
);

export default ProfileSidebar;
