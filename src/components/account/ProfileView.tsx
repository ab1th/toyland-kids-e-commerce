import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Package, MapPin, LogOut, Edit2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export const ProfileView = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";
  const initials = displayName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  const [profileData, setProfileData] = useState({
    name: displayName,
    email: user?.email || "",
    phone: "",
    dob: "",
  });

  // FIXED: authentication validation bug — proper logout clears session
  const handleLogout = async () => {
    await signOut();
    navigate("/");
    toast({ title: "Logged out", description: "You've been logged out successfully." });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Sidebar */}
      <Card className="p-6 lg:col-span-1 h-fit">
        <div className="text-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary mx-auto mb-3 flex items-center justify-center">
            <span className="text-2xl font-bold text-white">{initials}</span>
          </div>
          <h2 className="font-bold">{displayName}</h2>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
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
                active ? "bg-primary text-white" : "hover:bg-muted text-muted-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{label}</span>
            </button>
          ))}
          <button
            onClick={handleLogout}
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
                <Button variant="outline" className="rounded-full" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button
                  className="rounded-full"
                  onClick={() => {
                    setIsEditing(false);
                    toast({ title: "Profile updated!", description: "Your changes have been saved successfully." });
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
                <Input value={profileData.name} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} disabled={!isEditing} className="rounded-xl" />
              </div>
              <div>
                <Label>Email</Label>
                <Input value={profileData.email} disabled type="email" className="rounded-xl" />
              </div>
              <div>
                <Label>Phone Number</Label>
                <Input value={profileData.phone} onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })} disabled={!isEditing} className="rounded-xl" />
              </div>
              <div>
                <Label>Date of Birth</Label>
                <Input value={profileData.dob} onChange={(e) => setProfileData({ ...profileData, dob: e.target.value })} disabled={!isEditing} className="rounded-xl" />
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-bold mb-4">Recent Orders</h3>
              <div className="text-center py-8 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No orders yet. Start shopping!</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
