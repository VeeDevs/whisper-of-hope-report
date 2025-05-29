
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage, SupportedLanguage } from "@/context/LanguageContext";
import { Globe } from "lucide-react";

const languageNames = {
  en: "English",
  af: "Afrikaans", 
  zu: "isiZulu",
  xh: "isiXhosa",
  st: "Sesotho",
  ve: "Tshivenda",
  ts: "Xitsonga", 
  nr: "isiNdebele"
};

export function LanguageSelector() {
  const { currentLanguage, setLanguage } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{languageNames[currentLanguage]}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.entries(languageNames).map(([code, name]) => (
          <DropdownMenuItem
            key={code}
            onClick={() => setLanguage(code as SupportedLanguage)}
            className={currentLanguage === code ? "bg-accent" : ""}
          >
            {name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
