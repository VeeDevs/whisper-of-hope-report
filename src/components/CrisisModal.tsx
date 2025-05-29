
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getSouthAfricanEmergencyContacts } from "@/utils/crisisDetection";
import { useLanguage } from "@/context/LanguageContext";
import { Heart, Phone } from "lucide-react";

interface CrisisModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CrisisModal({ isOpen, onClose }: CrisisModalProps) {
  const contacts = getSouthAfricanEmergencyContacts();
  const { t } = useLanguage();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <Heart className="h-5 w-5" />
            {t('youAreNotAlone')}
          </DialogTitle>
          <DialogDescription>
            {t('crisisDetected')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {Object.values(contacts).map((contact, index) => (
            <div key={index} className="p-3 border rounded-lg bg-green-50">
              <div className="flex items-center gap-2 mb-1">
                <Phone className="h-4 w-4 text-green-600" />
                <h3 className="font-medium text-green-800">{contact.name}</h3>
              </div>
              <p className="text-2xl font-bold text-green-700 mb-1">{contact.number}</p>
              <p className="text-sm text-green-600">{contact.description}</p>
            </div>
          ))}
          
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>{t('remember')}:</strong> {t('youMatter')}
            </p>
          </div>
          
          <Button onClick={onClose} className="w-full">
            {t('iUnderstand')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
