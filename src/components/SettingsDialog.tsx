import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Check, Loader2, X, Pencil, Save, Settings, Puzzle, Terminal, FileText, ChevronRight } from "lucide-react";
import { Textarea } from "./ui/textarea";

interface AIFeature {
  enabled: boolean;
  label: string;
  description: string;
  model: string;
  customModel: string;
  systemPrompt: string;
}

interface Settings {
  notifications: boolean;
  autoSync: boolean;
  language: string;
  apiUrl: string;
  apiKey: string;
  features: {
    AI_EDITOR_ASSIST: AIFeature;
    AI_NOTE_POLISH: AIFeature;
    AI_WEEKLY_REPORT: AIFeature;
  };
  script: {
    updateInterval: number;
    debugMode: boolean;
    allowExperimental: boolean;
    autoBackup: boolean;
    backupInterval: number;
  };
}

const MODEL_OPTIONS = [
  { value: "gpt-4o-mini", label: "GPT-4O Mini" },
  { value: "gpt-4o", label: "GPT-4O" },
  { value: "custom", label: "Custom Model" }
];

export const SettingsDialog = () => {
  const { toast } = useToast();
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [selectedFeatureKey, setSelectedFeatureKey] = useState<keyof Settings['features'] | null>(null);
  const [tempPrompt, setTempPrompt] = useState("");
  const [settings, setSettings] = useState<Settings>({
    notifications: true,
    autoSync: true,
    language: "en",
    apiUrl: "",
    apiKey: "",
    features: {
      AI_EDITOR_ASSIST: {
        enabled: true,
        label: "AI Editor Assistant",
        description: "Adds a magic wand button to help fill daily updates",
        model: "gpt-4o-mini",
        customModel: "",
        systemPrompt: `You are a helpful assistant that analyzes daily updates...`,
      },
      AI_NOTE_POLISH: {
        enabled: true,
        label: "AI Note Polish",
        description: "Quick edit button to improve note formatting and clarity",
        model: "gpt-4o-mini",
        customModel: "",
        systemPrompt: `You are a helpful assistant that analyzes daily updates...`,
      },
      AI_WEEKLY_REPORT: {
        enabled: true,
        label: "AI Weekly Report",
        description: "Generates weekly summary from daily notes",
        model: "gpt-4o-mini",
        customModel: "",
        systemPrompt: `You are an assistant that creates weekly summaries...`,
      },
    },
    script: {
      updateInterval: 60,
      debugMode: false,
      allowExperimental: false,
      autoBackup: true,
      backupInterval: 24,
    },
  });

  const testConnection = async () => {
    setIsTestingConnection(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Simulated success
      toast({
        title: "Connection Successful",
        description: "API connection has been verified.",
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Unable to connect to the API. Please check your credentials.",
        variant: "destructive",
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  const toggleFeature = (featureKey: keyof Settings['features']) => {
    setSettings((prev) => ({
      ...prev,
      features: {
        ...prev.features,
        [featureKey]: {
          ...prev.features[featureKey],
          enabled: !prev.features[featureKey].enabled,
        },
      },
    }));
  };

  const handleModelChange = (value: string, featureKey: keyof Settings['features']) => {
    setSettings((prev) => ({
      ...prev,
      features: {
        ...prev.features,
        [featureKey]: {
          ...prev.features[featureKey],
          model: value,
        },
      },
    }));
  };

  const handleCustomModelChange = (value: string, featureKey: keyof Settings['features']) => {
    setSettings((prev) => ({
      ...prev,
      features: {
        ...prev.features,
        [featureKey]: {
          ...prev.features[featureKey],
          customModel: value,
        },
      },
    }));
  };

  const handlePromptSave = () => {
    if (!selectedFeatureKey) return;
    
    setSettings((prev) => ({
      ...prev,
      features: {
        ...prev.features,
        [selectedFeatureKey]: {
          ...prev.features[selectedFeatureKey],
          systemPrompt: tempPrompt,
        },
      },
    }));

    toast({
      title: "Prompt Saved",
      description: "Your changes have been saved successfully.",
    });

    setSelectedFeatureKey(null);
  };

  const handleEditPrompt = (key: keyof Settings['features']) => {
    setSelectedFeatureKey(key);
    setTempPrompt(settings.features[key].systemPrompt);
  };

  return (
    <div className="w-full min-h-[600px] flex">
      {/* Sidebar */}
      <div className="w-64 border-r bg-muted/10">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">AI Assistant</h2>
        </div>
        <nav className="p-2 space-y-1">
          <button
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium bg-primary/10 text-primary"
          >
            <Settings className="h-4 w-4" />
            <span>Basic Settings</span>
          </button>
          <button
            className="w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <Puzzle className="h-4 w-4" />
              <span>Features</span>
            </div>
            <ChevronRight className="h-4 w-4" />
          </button>
          <button
            className="w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <Terminal className="h-4 w-4" />
              <span>Advanced</span>
            </div>
            <ChevronRight className="h-4 w-4" />
          </button>
          <button
            className="w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <FileText className="h-4 w-4" />
              <span>Documentation</span>
            </div>
            <ChevronRight className="h-4 w-4" />
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <h3 className="text-xl font-semibold">API Configuration</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Configure your API settings and access credentials
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label>API Key</Label>
              <div className="relative">
                <Input
                  type="password"
                  placeholder="Enter your API key"
                  value={settings.apiKey}
                  onChange={(e) =>
                    setSettings({ ...settings, apiKey: e.target.value })
                  }
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                  onClick={() => setSettings({ ...settings, apiKey: "" })}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/50 border-l-4 border-blue-500 p-4 rounded-r-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700 dark:text-blue-200">
                    Your API key is securely stored and used only for authentication with the AI service.
                  </p>
                  <p className="mt-2 text-sm">
                    <a href="#" className="text-blue-700 dark:text-blue-200 hover:text-blue-600 inline-flex items-center">
                      Learn more about API key security
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </a>
                  </p>
                </div>
              </div>
            </div>

            <Button 
              onClick={testConnection} 
              disabled={isTestingConnection || !settings.apiUrl || !settings.apiKey}
              className="w-full"
            >
              {isTestingConnection ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Testing Connection...
                </>
              ) : (
                "Test Connection"
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Prompt Edit Dialog */}
      <Dialog open={!!selectedFeatureKey} onOpenChange={(open) => {
        if (!open) {
          setSelectedFeatureKey(null);
          setTempPrompt("");
        }
      }}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>
              Edit System Prompt - {selectedFeatureKey && settings.features[selectedFeatureKey].label}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <Textarea
              value={tempPrompt}
              onChange={(e) => setTempPrompt(e.target.value)}
              className="min-h-[60vh] font-mono text-sm"
              placeholder="Enter system prompt rules..."
            />
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setSelectedFeatureKey(null)}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handlePromptSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
