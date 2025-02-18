import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Check, Loader2, X, Pencil } from "lucide-react";
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

  const handlePromptChange = (value: string) => {
    if (!selectedFeatureKey) return;
    
    setSettings((prev) => ({
      ...prev,
      features: {
        ...prev.features,
        [selectedFeatureKey]: {
          ...prev.features[selectedFeatureKey],
          systemPrompt: value,
        },
      },
    }));
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold mb-6">Settings</h2>
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="ai">AI Features</TabsTrigger>
          <TabsTrigger value="api">API Settings</TabsTrigger>
          <TabsTrigger value="script">Script</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Enable desktop notifications
              </p>
            </div>
            <Switch
              checked={settings.notifications}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, notifications: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Auto Sync</Label>
              <p className="text-sm text-muted-foreground">
                Automatically sync changes
              </p>
            </div>
            <Switch
              checked={settings.autoSync}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, autoSync: checked })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Language</Label>
            <Select
              value={settings.language}
              onValueChange={(value) =>
                setSettings({ ...settings, language: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="ja">日本語</SelectItem>
                <SelectItem value="zh">中文</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </TabsContent>

        <TabsContent value="ai" className="space-y-6">
          {Object.entries(settings.features).map(([key, feature]) => (
            <div key={key} className="space-y-4 p-4 rounded-lg border">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <Label>{feature.label}</Label>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
                <Switch
                  checked={feature.enabled}
                  onCheckedChange={() => toggleFeature(key as keyof Settings['features'])}
                />
              </div>

              {feature.enabled && (
                <div className="space-y-4 mt-4 pt-4 border-t">
                  <div className="space-y-2">
                    <Label>Model</Label>
                    <div className="space-y-2">
                      <Select
                        value={feature.model}
                        onValueChange={(value) => handleModelChange(value, key as keyof Settings['features'])}
                      >
                        <SelectTrigger>
                          <SelectValue />
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
                        <Input
                          placeholder="Enter custom model name..."
                          value={feature.customModel}
                          onChange={(e) => handleCustomModelChange(e.target.value, key as keyof Settings['features'])}
                          className="mt-2"
                        />
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>System Prompt</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedFeatureKey(key as keyof Settings['features'])}
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit Prompt
                      </Button>
                    </div>
                    <div className="bg-muted p-2 rounded-md">
                      <p className="text-xs font-mono truncate">
                        {feature.systemPrompt.substring(0, 100)}...
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <div className="space-y-2">
            <Label>API URL</Label>
            <Input
              placeholder="Enter API URL"
              value={settings.apiUrl}
              onChange={(e) =>
                setSettings({ ...settings, apiUrl: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>API Key</Label>
            <Input
              type="password"
              placeholder="Enter API Key"
              value={settings.apiKey}
              onChange={(e) =>
                setSettings({ ...settings, apiKey: e.target.value })
              }
            />
          </div>

          <Button 
            onClick={testConnection} 
            disabled={isTestingConnection || !settings.apiUrl || !settings.apiKey}
            className="w-full relative"
          >
            {isTestingConnection ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Testing Connection...
              </>
            ) : (
              <>
                Test Connection
              </>
            )}
          </Button>
        </TabsContent>

        <TabsContent value="script" className="space-y-6">
          <div className="space-y-2">
            <Label>Update Interval (minutes)</Label>
            <Input
              type="number"
              min="1"
              max="1440"
              value={settings.script.updateInterval}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  script: {
                    ...settings.script,
                    updateInterval: parseInt(e.target.value) || 60,
                  },
                })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Debug Mode</Label>
              <p className="text-sm text-muted-foreground">
                Enable console logging for debugging
              </p>
            </div>
            <Switch
              checked={settings.script.debugMode}
              onCheckedChange={(checked) =>
                setSettings({
                  ...settings,
                  script: { ...settings.script, debugMode: checked },
                })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Experimental Features</Label>
              <p className="text-sm text-muted-foreground">
                Enable experimental script features
              </p>
            </div>
            <Switch
              checked={settings.script.allowExperimental}
              onCheckedChange={(checked) =>
                setSettings({
                  ...settings,
                  script: { ...settings.script, allowExperimental: checked },
                })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Auto Backup</Label>
              <p className="text-sm text-muted-foreground">
                Automatically backup user data
              </p>
            </div>
            <Switch
              checked={settings.script.autoBackup}
              onCheckedChange={(checked) =>
                setSettings({
                  ...settings,
                  script: { ...settings.script, autoBackup: checked },
                })
              }
            />
          </div>

          {settings.script.autoBackup && (
            <div className="space-y-2">
              <Label>Backup Interval (hours)</Label>
              <Input
                type="number"
                min="1"
                max="168"
                value={settings.script.backupInterval}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    script: {
                      ...settings.script,
                      backupInterval: parseInt(e.target.value) || 24,
                    },
                  })
                }
              />
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={!!selectedFeatureKey} onOpenChange={() => setSelectedFeatureKey(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>
              Edit System Prompt - {selectedFeatureKey && settings.features[selectedFeatureKey].label}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <Textarea
              value={selectedFeatureKey ? settings.features[selectedFeatureKey].systemPrompt : ""}
              onChange={(e) => handlePromptChange(e.target.value)}
              className="min-h-[60vh] font-mono text-sm"
              placeholder="Enter system prompt rules..."
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
