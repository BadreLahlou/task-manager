import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings as SettingsIcon, UserCircle, Bell, Download, Trash2, LogOut } from 'lucide-react';
import { toast } from 'sonner';

const Settings = () => {
  const [theme, setTheme] = useState('system');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [desktopNotifications, setDesktopNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  
  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all tasks? This action cannot be undone.')) {
      localStorage.removeItem('tasks');
      toast.success('All tasks have been cleared');
      // Refresh the page to see changes
      window.location.reload();
    }
  };
  
  const handleExportData = () => {
    const tasks = localStorage.getItem('tasks');
    if (tasks) {
      const blob = new Blob([tasks], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'chronos-tasks.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Tasks exported successfully');
    } else {
      toast.error('No tasks to export');
    }
  };
  
  const handleSaveSettings = () => {
    toast.success('Settings saved successfully');
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your app preferences</p>
        </div>
      </div>
      
      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3 mb-8">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
        </TabsList>
        
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Manage your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Your name" defaultValue="Demo User" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" placeholder="Your email" defaultValue="demo@example.com" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="timezone">Timezone</Label>
                <Select defaultValue="utc">
                  <SelectTrigger>
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pst">Pacific Time (UTC-8)</SelectItem>
                    <SelectItem value="mst">Mountain Time (UTC-7)</SelectItem>
                    <SelectItem value="cst">Central Time (UTC-6)</SelectItem>
                    <SelectItem value="est">Eastern Time (UTC-5)</SelectItem>
                    <SelectItem value="utc">UTC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Cancel</Button>
              <Button onClick={() => toast.success("Account updated successfully")}>Save Changes</Button>
            </CardFooter>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>Update your password</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" placeholder="••••••••" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" placeholder="••••••••" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" placeholder="••••••••" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Cancel</Button>
              <Button onClick={() => toast.success("Password updated successfully")}>Update Password</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize the look and feel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="theme">Theme</Label>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="compact-mode" 
                  checked={false} 
                  onCheckedChange={() => toast.info("This feature is coming soon")}
                />
                <Label htmlFor="compact-mode">Compact Mode</Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings}>Save Preferences</Button>
            </CardFooter>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Configure your notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-col space-y-0.5">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <span className="text-xs text-muted-foreground">Receive task reminders via email</span>
                </div>
                <Switch 
                  id="email-notifications" 
                  checked={emailNotifications} 
                  onCheckedChange={setEmailNotifications}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex flex-col space-y-0.5">
                  <Label htmlFor="desktop-notifications">Desktop Notifications</Label>
                  <span className="text-xs text-muted-foreground">Receive task reminders on your desktop</span>
                </div>
                <Switch 
                  id="desktop-notifications" 
                  checked={desktopNotifications} 
                  onCheckedChange={setDesktopNotifications}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex flex-col space-y-0.5">
                  <Label htmlFor="auto-save">Auto-Save</Label>
                  <span className="text-xs text-muted-foreground">Automatically save your changes</span>
                </div>
                <Switch 
                  id="auto-save" 
                  checked={autoSave} 
                  onCheckedChange={setAutoSave}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings}>Save Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="data">
          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>Export or clear your task data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Download className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">Export Data</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Export all your tasks and settings as a JSON file
                </p>
                <Button variant="outline" className="w-full" onClick={handleExportData}>
                  Export Data
                </Button>
              </div>
              
              <div className="border rounded-lg p-4 border-destructive/20 space-y-2">
                <div className="flex items-center gap-2">
                  <Trash2 className="h-5 w-5 text-destructive" />
                  <h3 className="font-medium text-destructive">Danger Zone</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Clear all your tasks and reset the application data. This action cannot be undone.
                </p>
                <Button variant="destructive" className="w-full" onClick={handleClearData}>
                  Clear All Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
