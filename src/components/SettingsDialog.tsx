import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Check, Loader2, X, Pencil, Save, Settings, Puzzle, Terminal, FileText, ChevronRight, MessageSquare, Info } from "lucide-react";
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
  { value: "gpt-4", label: "gpt-4" },
  { value: "gpt-4o", label: "gpt-4o" },
  { value: "gpt-4o-mini", label: "gpt-4o-mini" },
  { value: "claude-3-opus", label: "claude-3-opus" },
  { value: "claude-3-sonnet", label: "claude-3-sonnet" },
  { value: "claude-3-haiku", label: "claude-3-haiku" },
  { value: "gemini-pro", label: "gemini-pro" },
  { value: "gemini-ultra", label: "gemini-ultra" },
  { value: "custom", label: "custom" },
];

interface SettingsDialogProps {
  onClose: () => void;
}

export const SettingsDialog = ({ onClose }: SettingsDialogProps) => {
  const { toast } = useToast();
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'none' | 'success' | 'error'>('none');
  const [selectedFeatureKey, setSelectedFeatureKey] = useState<keyof Settings['features'] | null>(null);
  const [tempPrompt, setTempPrompt] = useState("");
  const [activeSection, setActiveSection] = useState("settings");
  const [feedback, setFeedback] = useState({
    type: "",
    message: "",
    contact: "",
    screenshot: null as File | null,
  });

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

  // 重構：將按鈕樣式邏輯抽離出來，使代碼更清晰
  const getVerifyButtonStyles = () => {
    if (isTestingConnection) return 'bg-blue-100 text-blue-700';
    switch (connectionStatus) {
      case 'success':
        return 'bg-green-100 text-green-700';
      case 'error':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-primary/10 text-primary hover:bg-primary/20';
    }
  };

  const testConnection = async () => {
    setIsTestingConnection(true);
    setConnectionStatus('none');
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      setConnectionStatus('success');
      toast({
        title: "Connection Successful",
        description: "API connection has been verified.",
      });
    } catch (error) {
      setConnectionStatus('error');
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

  const handleFeedbackSubmit = async () => {
    if (!feedback.type || !feedback.message) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmittingFeedback(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      toast({
        title: "Feedback Submitted",
        description: "Thank you for your feedback!",
      });
      setFeedback({
        type: "",
        message: "",
        contact: "",
        screenshot: null,
      });
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Unable to submit feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const handleSaveSettings = () => {
    // Save settings logic here
    toast({
      title: "Settings Saved",
      description: "Your API settings have been saved successfully.",
    });
  };

  const sections = [
    { id: "settings", label: "Chat API Settings", icon: Settings },
    { id: "features", label: "Features", icon: Puzzle },
    { id: "feedback", label: "Feedback", icon: MessageSquare },
    { id: "about", label: "About", icon: Info }
  ];

  return (
    <div className="w-full min-h-[600px] flex">
      {/* Sidebar */}
      <div className="w-64 border-r bg-muted/10">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">AI Assistant</h2>
        </div>
        <nav className="p-2 space-y-1">
          {sections.map((section) => (
            <button
              key={section.id}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors
                ${activeSection === section.id 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-muted/50"}`}
              onClick={() => setActiveSection(section.id)}
            >
              <div className="flex items-center space-x-3">
                <section.icon className="h-4 w-4" />
                <span>{section.label}</span>
              </div>
              <ChevronRight className="h-4 w-4" />
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          {activeSection === "settings" && (
            <>
              <div className="mb-6">
                <h3 className="text-xl font-semibold">Chat API Settings</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Configure your OpenAI Chat API settings and access credentials
                </p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>API URL</Label>
                  <Input
                    type="url"
                    placeholder="https://api.openai.com/v1/chat/completions"
                    value={settings.apiUrl}
                    onChange={(e) =>
                      setSettings({ ...settings, apiUrl: e.target.value })
                    }
                  />
                  <p className="text-sm text-muted-foreground">
                    The default endpoint for OpenAI Chat API is: https://api.openai.com/v1/chat/completions
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>API Key</Label>
                  <div className="flex items-center space-x-2">
                    <div className="relative flex-1">
                      <Input
                        type="password"
                        placeholder="sk-..."
                        value={settings.apiKey}
                        onChange={(e) =>
                          setSettings({ ...settings, apiKey: e.target.value })
                        }
                      />
                      {settings.apiKey && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                          onClick={() => setSettings({ ...settings, apiKey: "" })}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <button
                      onClick={testConnection}
                      disabled={isTestingConnection || !settings.apiUrl || !settings.apiKey}
                      className={`
                        px-4 py-2 rounded-lg font-medium
                        transition-colors duration-200
                        disabled:opacity-50 disabled:cursor-not-allowed
                        ${getVerifyButtonStyles()}
                      `}
                    >
                      {isTestingConnection ? (
                        <div className="animate-spin w-5 h-5 border-2 border-blue-700 border-t-transparent rounded-full" />
                      ) : connectionStatus === 'success' ? (
                        <Check className="w-5 h-5" />
                      ) : connectionStatus === 'error' ? (
                        <X className="w-5 h-5" />
                      ) : (
                        <Check className="w-5 h-5" />
                      )}
                    </button>
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
                        To get your API key, visit the OpenAI platform and create a new API key in your account settings.
                      </p>
                      <p className="mt-2 text-sm">
                        <a 
                          href="https://platform.openai.com/docs/api-reference/chat" 
                          target="_blank"
                          rel="noopener noreferrer" 
                          className="text-blue-700 dark:text-blue-200 hover:text-blue-600 inline-flex items-center"
                        >
                          Learn more about Chat API documentation
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </a>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 mt-6">
                  <Button variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveSettings}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </>
          )}

          {activeSection === "features" && (
            <>
              <div className="mb-6">
                <h3 className="text-xl font-semibold">AI Features</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Customize AI features and their behaviors
                </p>
              </div>
              <div className="space-y-4">
                {Object.entries(settings.features).map(([key, feature]) => (
                  <div key={key} className="border rounded-md p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{feature.label}</h4>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                      <Switch
                        checked={feature.enabled}
                        onCheckedChange={() => toggleFeature(key as keyof Settings['features'])}
                      />
                    </div>
                    <div className="mt-4 space-y-2">
                      <Label>Model</Label>
                      <Select
                        value={feature.model}
                        onValueChange={(value) => handleModelChange(value, key as keyof Settings['features'])}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a model" />
                        </SelectTrigger>
                        <SelectContent>
                          {MODEL_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {feature.model === "custom" && (
                        <>
                          <Label>Custom Model URL</Label>
                          <Input
                            type="url"
                            placeholder="Enter custom model URL"
                            value={feature.customModel}
                            onChange={(e) => handleCustomModelChange(e.target.value, key as keyof Settings['features'])}
                          />
                        </>
                      )}
                      <Button
                        variant="outline"
                        className="w-full mt-4"
                        onClick={() => handleEditPrompt(key as keyof Settings['features'])}
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit System Prompt
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeSection === "feedback" && (
            <>
              <div className="mb-6">
                <h3 className="text-xl font-semibold">Send Feedback</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Help us improve by sharing your thoughts
                </p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Feedback Type</Label>
                  <Select
                    value={feedback.type}
                    onValueChange={(value) => setFeedback({ ...feedback, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select feedback type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bug">Bug Report</SelectItem>
                      <SelectItem value="feature">Feature Request</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Message</Label>
                  <Textarea
                    placeholder="Please describe your feedback..."
                    value={feedback.message}
                    onChange={(e) => setFeedback({ ...feedback, message: e.target.value })}
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Contact (optional)</Label>
                  <Input
                    type="email"
                    placeholder="Your email address"
                    value={feedback.contact}
                    onChange={(e) => setFeedback({ ...feedback, contact: e.target.value })}
                  />
                </div>

                <Button 
                  onClick={handleFeedbackSubmit} 
                  className="w-full"
                  disabled={isSubmittingFeedback}
                >
                  {isSubmittingFeedback ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Feedback'
                  )}
                </Button>
              </div>
            </>
          )}

          {activeSection === "about" && (
            <>
              <div className="mb-6">
                <h3 className="text-xl font-semibold">About</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Information about this application
                </p>
              </div>

              <div className="space-y-6">
                <div className="rounded-lg border bg-card p-6">
                  <h4 className="text-lg font-semibold mb-2">AI Assistant v1.0.0</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    A powerful AI-powered assistant to help you with your daily tasks.
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-medium mb-1">Features</h5>
                      <ul className="list-disc list-inside text-sm text-muted-foreground">
                        <li>AI Editor Assistant</li>
                        <li>AI Note Polish</li>
                        <li>AI Weekly Report</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="font-medium mb-1">Technologies</h5>
                      <ul className="list-disc list-inside text-sm text-muted-foreground">
                        <li>React + TypeScript</li>
                        <li>Tailwind CSS</li>
                        <li>GPT-4O Integration</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="text-sm text-center text-muted-foreground">
                  © 2024 AI Assistant. All rights reserved.
                </div>
              </div>
            </>
          )}
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
