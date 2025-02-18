
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useState } from "react";

export const SettingsDialog = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    autoSync: true,
    language: "en",
  });

  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold mb-6">Settings</h2>
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
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
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
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
      </Tabs>
    </div>
  );
};
