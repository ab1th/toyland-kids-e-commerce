// FIXED: authentication validation bug — signup requires valid email, strong password
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

export const SignupForm = () => {
  const { signUp } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Please enter a valid email";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";
    else if (!/[A-Z]/.test(password)) newErrors.password = "Password must contain an uppercase letter";
    else if (!/[0-9]/.test(password)) newErrors.password = "Password must contain a number";
    if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    // FIXED: authentication validation bug — stores credentials correctly via Supabase
    const { error } = await signUp(email, password, name);
    setLoading(false);

    if (error) {
      toast({ title: "Signup failed", description: error, variant: "destructive" });
    } else {
      toast({
        title: "Account created!",
        description: "Please check your email to verify your account before logging in.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Full Name</Label>
        <Input placeholder="John Doe" className="rounded-xl" value={name} onChange={(e) => setName(e.target.value)} />
        {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
      </div>
      <div>
        <Label>Email</Label>
        <Input type="email" placeholder="parent@email.com" className="rounded-xl" value={email} onChange={(e) => setEmail(e.target.value)} />
        {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
      </div>
      <div>
        <Label>Password</Label>
        <Input type="password" placeholder="••••••••" className="rounded-xl" value={password} onChange={(e) => setPassword(e.target.value)} />
        {errors.password && <p className="text-sm text-destructive mt-1">{errors.password}</p>}
      </div>
      <div>
        <Label>Confirm Password</Label>
        <Input type="password" placeholder="••••••••" className="rounded-xl" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        {errors.confirmPassword && <p className="text-sm text-destructive mt-1">{errors.confirmPassword}</p>}
      </div>
      <Button type="submit" disabled={loading} className="w-full rounded-full bg-primary hover:bg-primary-dark">
        {loading ? "Creating Account..." : "Create Account"}
      </Button>
    </form>
  );
};
