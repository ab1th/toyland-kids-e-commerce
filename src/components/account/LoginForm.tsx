// FIXED: authentication validation bug — login validates against stored credentials
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

export const LoginForm = () => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Please enter a valid email";
    if (!password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    // FIXED: authentication validation bug — reject incorrect credentials
    const { error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      toast({ title: "Login failed", description: error, variant: "destructive" });
    } else {
      toast({ title: "Welcome back!", description: "You've been logged in successfully." });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Email</Label>
        <Input
          type="email"
          placeholder="parent@email.com"
          className="rounded-xl"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
      </div>
      <div>
        <Label>Password</Label>
        <Input
          type="password"
          placeholder="••••••••"
          className="rounded-xl"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errors.password && <p className="text-sm text-destructive mt-1">{errors.password}</p>}
      </div>
      <Button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-primary hover:bg-primary-dark"
      >
        {loading ? "Logging in..." : "Login"}
      </Button>
    </form>
  );
};
