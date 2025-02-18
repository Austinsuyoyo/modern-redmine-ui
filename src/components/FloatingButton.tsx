
import { useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Settings, MessageSquare, X } from "lucide-react";
import { SettingsDialog } from "./SettingsDialog";
import { FeedbackDialog } from "./FeedbackDialog";

export const FloatingButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="relative">
        <Button
          size="icon"
          variant="default"
          className="h-14 w-14 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Settings className="h-6 w-6" />}
        </Button>

        {isOpen && (
          <div className="absolute bottom-16 right-0 flex flex-col gap-2 animate-fade-in">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-12 w-12 rounded-full shadow-md"
                >
                  <Settings className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <SettingsDialog />
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-12 w-12 rounded-full shadow-md"
                >
                  <MessageSquare className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <FeedbackDialog />
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    </div>
  );
};
