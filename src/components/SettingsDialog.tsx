
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Check, Loader2, X } from "lucide-react";

interface AIFeature {
  enabled: boolean;
  label: string;
  description: string;
  model: string;
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
}

export const SettingsDialog = () => {
  const { toast } = useToast();
  const [isTestingConnection, setIsTestingConnection] = useState(false);
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
        systemPrompt: `You are a helpful assistant that analyzes daily updates...`,
      },
      AI_NOTE_POLISH: {
        enabled: true,
        label: "AI Note Polish",
        description: "Quick edit button to improve note formatting and clarity",
        model: "gpt-4o-mini",
        systemPrompt: `You are a helpful assistant that analyzes daily updates...`,
      },
      AI_WEEKLY_REPORT: {
        enabled: true,
        label: "AI Weekly Report",
        description: "Generates weekly summary from daily notes",
        model: "gpt-4o-mini",
        systemPrompt: `You are an assistant that creates weekly summaries...`,
      },
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

  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold mb-6">Settings</h2>
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="ai">AI Features</TabsTrigger>
          <TabsTrigger value="api">API Settings</TabsTrigger>
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
            <div key={key} className="flex items-start justify-between p-4 rounded-lg border">
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
      </Tabs>
    </div>
  );
};
