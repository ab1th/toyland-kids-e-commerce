// FIXED: authentication validation bug — complete rewrite with real Supabase auth
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileNav } from "@/components/MobileNav";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { BackButton } from "@/components/BackButton";
import { LoginForm } from "@/components/account/LoginForm";
import { SignupForm } from "@/components/account/SignupForm";
import { ProfileView } from "@/components/account/ProfileView";

const Account = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </main>
        <Footer />
        <MobileNav />
      </div>
    );
  }

  // FIXED: authentication validation bug — show login only when not authenticated
  if (!user) {
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
                <TabsContent value="login">
                  <LoginForm />
                </TabsContent>
                <TabsContent value="signup">
                  <SignupForm />
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
          <ProfileView />
        </div>
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
};

export default Account;
