import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { User, Bell, Settings as SettingsIcon, Shield, Globe, CreditCard, CheckCircle } from 'lucide-react';

const Settings = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-secondary mb-6">Settings</h1>
      
      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="bg-white p-1 border border-secondary-light rounded-lg">
          <TabsTrigger value="account" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            <User className="h-4 w-4 mr-2" />
            Account
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="preferences" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            <SettingsIcon className="h-4 w-4 mr-2" />
            Preferences
          </TabsTrigger>
          <TabsTrigger value="billing" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            <CreditCard className="h-4 w-4 mr-2" />
            Billing
          </TabsTrigger>
        </TabsList>
        
        {/* Account Tab */}
        <TabsContent value="account">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your account details and profile picture</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center text-white text-xl">
                        JD
                      </div>
                      <button className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-2 shadow">
                        <User className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="space-y-2 flex-1">
                      <p className="text-sm text-secondary/70">
                        Upload a new profile picture or avatar. Recommended size is 200x200px.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm">
                          Upload Image
                        </Button>
                        <Button variant="ghost" size="sm">
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-secondary mb-1">
                          First Name
                        </label>
                        <input
                          id="firstName"
                          type="text"
                          defaultValue="John"
                          className="w-full px-3 py-2 rounded-md border border-secondary-light focus:ring-2 focus:ring-primary/20 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-secondary mb-1">
                          Last Name
                        </label>
                        <input
                          id="lastName"
                          type="text"
                          defaultValue="Doe"
                          className="w-full px-3 py-2 rounded-md border border-secondary-light focus:ring-2 focus:ring-primary/20 focus:outline-none"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-secondary mb-1">
                        Email Address
                      </label>
                      <input
                        id="email"
                        type="email"
                        defaultValue="john@example.com"
                        className="w-full px-3 py-2 rounded-md border border-secondary-light focus:ring-2 focus:ring-primary/20 focus:outline-none"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-secondary mb-1">
                        Company
                      </label>
                      <input
                        id="company"
                        type="text"
                        defaultValue="CM Assistance Agency"
                        className="w-full px-3 py-2 rounded-md border border-secondary-light focus:ring-2 focus:ring-primary/20 focus:outline-none"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="position" className="block text-sm font-medium text-secondary mb-1">
                        Job Title
                      </label>
                      <input
                        id="position"
                        type="text"
                        defaultValue="Community Manager"
                        className="w-full px-3 py-2 rounded-md border border-secondary-light focus:ring-2 focus:ring-primary/20 focus:outline-none"
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <Button>Save Changes</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>Manage your password and security settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="current-password" className="block text-sm font-medium text-secondary mb-1">
                        Current Password
                      </label>
                      <input
                        id="current-password"
                        type="password"
                        className="w-full px-3 py-2 rounded-md border border-secondary-light focus:ring-2 focus:ring-primary/20 focus:outline-none"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="new-password" className="block text-sm font-medium text-secondary mb-1">
                        New Password
                      </label>
                      <input
                        id="new-password"
                        type="password"
                        className="w-full px-3 py-2 rounded-md border border-secondary-light focus:ring-2 focus:ring-primary/20 focus:outline-none"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="confirm-password" className="block text-sm font-medium text-secondary mb-1">
                        Confirm New Password
                      </label>
                      <input
                        id="confirm-password"
                        type="password"
                        className="w-full px-3 py-2 rounded-md border border-secondary-light focus:ring-2 focus:ring-primary/20 focus:outline-none"
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <Button>Update Password</Button>
                    </div>
                  </div>
                  
                  <div className="h-px bg-secondary-light"></div>
                  
                  <div>
                    <h3 className="text-md font-medium text-secondary">Two-Factor Authentication</h3>
                    <p className="text-sm text-secondary/70 mt-1">
                      Add an extra layer of security to your account by requiring more than just a password to sign in.
                    </p>
                    <div className="mt-4">
                      <Button variant="outline" className="flex items-center">
                        <Shield className="h-4 w-4 mr-2" />
                        Enable 2FA
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Control how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-md font-medium text-secondary">Email Notifications</h3>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <p className="text-sm font-medium text-secondary">New Ticket Alerts</p>
                        <p className="text-xs text-secondary/70">Get notified when a new support ticket is created</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-secondary-light peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-light after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <p className="text-sm font-medium text-secondary">Post Schedule Reminders</p>
                        <p className="text-xs text-secondary/70">Receive reminders before your scheduled posts go live</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-secondary-light peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-light after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <p className="text-sm font-medium text-secondary">Analytics Reports</p>
                        <p className="text-xs text-secondary/70">Weekly and monthly performance reports</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-secondary-light peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-light after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <p className="text-sm font-medium text-secondary">Client Communications</p>
                        <p className="text-xs text-secondary/70">Updates when clients send messages or feedback</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-secondary-light peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-light after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="h-px bg-secondary-light"></div>
                
                <div className="space-y-4">
                  <h3 className="text-md font-medium text-secondary">In-App Notifications</h3>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <p className="text-sm font-medium text-secondary">Real-Time Alerts</p>
                        <p className="text-xs text-secondary/70">Show notifications for new activity as it happens</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-secondary-light peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-light after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <p className="text-sm font-medium text-secondary">Sound Alerts</p>
                        <p className="text-xs text-secondary/70">Play sound when new notifications arrive</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-secondary-light peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-light after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button>Save Preferences</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Preferences Tab */}
        <TabsContent value="preferences">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>System Preferences</CardTitle>
              <CardDescription>Customize your workspace experience</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-md font-medium text-secondary">Display</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="language" className="block text-sm font-medium text-secondary mb-1">
                        Language
                      </label>
                      <select
                        id="language"
                        className="w-full px-3 py-2 rounded-md border border-secondary-light focus:ring-2 focus:ring-primary/20 focus:outline-none"
                        defaultValue="en"
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="timezone" className="block text-sm font-medium text-secondary mb-1">
                        Timezone
                      </label>
                      <select
                        id="timezone"
                        className="w-full px-3 py-2 rounded-md border border-secondary-light focus:ring-2 focus:ring-primary/20 focus:outline-none"
                        defaultValue="utc"
                      >
                        <option value="utc">UTC</option>
                        <option value="est">Eastern Time (ET)</option>
                        <option value="pst">Pacific Time (PT)</option>
                        <option value="cet">Central European Time (CET)</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm font-medium text-secondary">Compact Mode</p>
                      <p className="text-xs text-secondary/70">Display more information with less spacing</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-secondary-light peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-light after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
                
                <div className="h-px bg-secondary-light"></div>
                
                <div className="space-y-4">
                  <h3 className="text-md font-medium text-secondary">Social Media Integration</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-md p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#1877F2] flex items-center justify-center text-white">
                          <Globe className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-secondary">Facebook</p>
                          <p className="text-xs text-secondary/70">Connected</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">Disconnect</Button>
                    </div>
                    
                    <div className="border rounded-md p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#1DA1F2] flex items-center justify-center text-white">
                          <Globe className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-secondary">Twitter</p>
                          <p className="text-xs text-secondary/70">Connected</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">Disconnect</Button>
                    </div>
                    
                    <div className="border rounded-md p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#E4405F] flex items-center justify-center text-white">
                          <Globe className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-secondary">Instagram</p>
                          <p className="text-xs text-secondary/70">Not connected</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Connect</Button>
                    </div>
                    
                    <div className="border rounded-md p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#0A66C2] flex items-center justify-center text-white">
                          <Globe className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-secondary">LinkedIn</p>
                          <p className="text-xs text-secondary/70">Connected</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">Disconnect</Button>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button>Save Preferences</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Billing Tab */}
        <TabsContent value="billing">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Subscription & Billing</CardTitle>
              <CardDescription>Manage your subscription and payment methods</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-secondary-light rounded-lg p-4 border border-secondary-light/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-lg text-secondary">Pro Plan</span>
                        <span className="bg-primary text-white text-xs py-1 px-2 rounded-full">Current</span>
                      </div>
                      <p className="text-secondary/70 mt-1">$29/month, billed monthly</p>
                    </div>
                    <Button variant="outline">Change Plan</Button>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-secondary">Unlimited tickets</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-secondary">Advanced analytics</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-secondary">10 team members</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-secondary">Priority support</span>
                    </div>
                  </div>
                </div>
                
                <div className="h-px bg-secondary-light"></div>
                
                <div>
                  <h3 className="text-md font-medium text-secondary mb-4">Payment Methods</h3>
                  
                  <div className="space-y-3">
                    <div className="border rounded-md p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-8 bg-secondary/10 rounded flex items-center justify-center">
                          <CreditCard className="h-4 w-4 text-secondary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-secondary">•••• •••• •••• 4242</p>
                          <p className="text-xs text-secondary/70">Expires 04/25</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="bg-secondary-light text-secondary text-xs py-1 px-2 rounded-full">Default</span>
                        <Button variant="ghost" size="sm">Edit</Button>
                      </div>
                    </div>
                    
                    <Button variant="outline" className="w-full">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Add Payment Method
                    </Button>
                  </div>
                </div>
                
                <div className="h-px bg-secondary-light"></div>
                
                <div>
                  <h3 className="text-md font-medium text-secondary mb-4">Billing History</h3>
                  
                  <div className="border rounded-md overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-secondary-light/50">
                          <th className="text-left px-4 py-3 text-xs font-medium text-secondary/70">Date</th>
                          <th className="text-left px-4 py-3 text-xs font-medium text-secondary/70">Description</th>
                          <th className="text-left px-4 py-3 text-xs font-medium text-secondary/70">Amount</th>
                          <th className="text-left px-4 py-3 text-xs font-medium text-secondary/70">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-secondary-light">
                        <tr>
                          <td className="px-4 py-3 text-sm text-secondary">May 1, 2023</td>
                          <td className="px-4 py-3 text-sm text-secondary">Pro Plan Subscription</td>
                          <td className="px-4 py-3 text-sm text-secondary">$29.00</td>
                          <td className="px-4 py-3">
                            <span className="bg-green-100 text-green-700 text-xs py-1 px-2 rounded-full">Paid</span>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm text-secondary">Apr 1, 2023</td>
                          <td className="px-4 py-3 text-sm text-secondary">Pro Plan Subscription</td>
                          <td className="px-4 py-3 text-sm text-secondary">$29.00</td>
                          <td className="px-4 py-3">
                            <span className="bg-green-100 text-green-700 text-xs py-1 px-2 rounded-full">Paid</span>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm text-secondary">Mar 1, 2023</td>
                          <td className="px-4 py-3 text-sm text-secondary">Pro Plan Subscription</td>
                          <td className="px-4 py-3 text-sm text-secondary">$29.00</td>
                          <td className="px-4 py-3">
                            <span className="bg-green-100 text-green-700 text-xs py-1 px-2 rounded-full">Paid</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
