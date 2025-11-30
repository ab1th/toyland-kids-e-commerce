import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileNav } from "@/components/MobileNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { User, Package, MapPin, LogOut, Edit2 } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { BackButton } from "@/components/BackButton";

const Account = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    email: "parent@email.com",
    phone: "+1 234 567 8900",
    dob: "01/01/1990"
  });

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center pb-20 md:pb-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md mx-4"
          >
            <Card className="p-8">
              <div className="text-center mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary mx-auto mb-4 flex items-center justify-center">
                  <User className="h-10 w-10 text-white" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Welcome to ToyLand!</h1>
                <p className="text-muted-foreground">Login or create an account</p>
              </div>

              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="space-y-4">
                  <div>
                    <Label>Email</Label>
                    <Input type="email" placeholder="parent@email.com" className="rounded-xl" />
                  </div>
                  <div>
                    <Label>Password</Label>
                    <Input type="password" placeholder="••••••••" className="rounded-xl" />
                  </div>
                  <Button
                    onClick={() => setIsLoggedIn(true)}
                    className="w-full rounded-full bg-primary hover:bg-primary-dark"
                  >
                    Login
                  </Button>
                  <button className="w-full text-sm text-primary hover:underline">
                    Forgot password?
                  </button>
                </TabsContent>

                <TabsContent value="signup" className="space-y-4">
                  <div>
                    <Label>Full Name</Label>
                    <Input placeholder="John Doe" className="rounded-xl" />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input type="email" placeholder="parent@email.com" className="rounded-xl" />
                  </div>
                  <div>
                    <Label>Password</Label>
                    <Input type="password" placeholder="••••••••" className="rounded-xl" />
                  </div>
                  <div>
                    <Label>Confirm Password</Label>
                    <Input type="password" placeholder="••••••••" className="rounded-xl" />
                  </div>
                  <Button
                    onClick={() => setIsLoggedIn(true)}
                    className="w-full rounded-full bg-primary hover:bg-primary-dark"
                  >
                    Create Account
                  </Button>
                </TabsContent>
              </Tabs>
            </Card>
          </motion.div>
        </main>
        <Footer />
        <MobileNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pb-20 md:pb-0">
        <div className="container mx-auto px-4 py-8">
          <BackButton />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold mb-2">My Account</h1>
            <p className="text-muted-foreground">Manage your profile and orders</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <Card className="p-6 lg:col-span-1 h-fit">
              <div className="text-center mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary mx-auto mb-3 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">JD</span>
                </div>
                <h2 className="font-bold">John Doe</h2>
                <p className="text-sm text-muted-foreground">parent@email.com</p>
              </div>

              <nav className="space-y-2">
                {[
                  { icon: User, label: "Profile", active: true },
                  { icon: Package, label: "Orders", active: false },
                  { icon: MapPin, label: "Addresses", active: false },
                ].map(({ icon: Icon, label, active }) => (
                  <button
                    key={label}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                      active
                        ? "bg-primary text-white"
                        : "hover:bg-muted text-muted-foreground"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{label}</span>
                  </button>
                ))}
                <button
                  onClick={() => setIsLoggedIn(false)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-destructive/10 text-destructive transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="font-medium">Logout</span>
                </button>
              </nav>
            </Card>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <Card className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Profile Information</h2>
                  {!isEditing ? (
                    <Button variant="outline" className="rounded-full" onClick={() => setIsEditing(true)}>
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        className="rounded-full" 
                        onClick={() => {
                          setIsEditing(false);
                          // Reset to original values on cancel (optional)
                        }}
                      >
                        Cancel
                      </Button>
                      <Button 
                        className="rounded-full" 
                        onClick={() => {
                          setIsEditing(false);
                          toast({ 
                            title: "Profile updated!", 
                            description: "Your changes have been saved successfully." 
                          });
                        }}
                      >
                        Save Changes
                      </Button>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label>Full Name</Label>
                      <Input 
                        value={profileData.name} 
                        onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                        disabled={!isEditing}
                        className="rounded-xl" 
                      />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input 
                        value={profileData.email} 
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        disabled={!isEditing}
                        type="email" 
                        className="rounded-xl" 
                      />
                    </div>
                    <div>
                      <Label>Phone Number</Label>
                      <Input 
                        value={profileData.phone} 
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                        disabled={!isEditing}
                        className="rounded-xl" 
                      />
                    </div>
                    <div>
                      <Label>Date of Birth</Label>
                      <Input 
                        value={profileData.dob} 
                        onChange={(e) => setProfileData({...profileData, dob: e.target.value})}
                        disabled={!isEditing}
                        className="rounded-xl" 
                      />
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="text-lg font-bold mb-4">Recent Orders</h3>
                    <div className="space-y-4">
                      {[1, 2, 3].map((order) => (
                        <div
                          key={order}
                          className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
                              <Package className="h-8 w-8 text-primary" />
                            </div>
                            <div>
                              <p className="font-semibold">Order #{1000 + order}</p>
                              <p className="text-sm text-muted-foreground">
                                Placed on Dec {20 + order}, 2024
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-primary">$129.99</p>
                            <span className="text-xs px-3 py-1 rounded-full bg-success/10 text-success">
                              Delivered
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
};

export default Account;
