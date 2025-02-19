
import { useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent } from "./ui/dialog";
import { Settings } from "lucide-react";
import { SettingsDialog } from "./SettingsDialog";

export const FloatingButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        size="icon"
        variant="default"
        className="h-14 w-14 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95"
        onClick={() => setIsOpen(true)}
      >
        <Settings className="h-6 w-6" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <SettingsDialog onClose={() => setIsOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};
