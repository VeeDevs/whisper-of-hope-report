import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { findUserByUsername, setCurrentUser } from "@/services/storage";
import { useToast } from "@/hooks/use-toast";
import { useApp } from "@/hooks/use-app";
import { useLanguage } from "@/context/LanguageContext";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setCurrentUser: updateCurrentUser } = useApp();
  const { t } = useLanguage();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Find user by username
      const user = findUserByUsername(username);

      if (!user) {
        toast({
          title: "Login failed",
          description: "Username or password incorrect.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // In a real app, we would verify the password here
      // For this demo, we're just checking the username

      // Set as current user
      setCurrentUser(user);
      updateCurrentUser(user);

      toast({
        title: "Login successful!",
        description: `Welcome back! Your anonymous ID is ${user.anonymousId}`,
      });

      // Redirect to reports page
      navigate("/reports");
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container flex items-center justify-center py-12">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">{t('welcomeBack')}</CardTitle>
            <CardDescription className="text-center">
              {t('loginToContinue')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium">
                  {t('username')}
                </label>
                <Input
                  id="username"
                  placeholder={t('enterUsername')}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  {t('password')}
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={t('enterPassword')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? t('loggingIn') : t('logIn')}
              </Button>
            </form>
            <div className="mt-4 text-center text-sm">
              {t('dontHaveAccount')}{" "}
              <Link to="/register" className="text-whisper-700 hover:underline">
                {t('register')}
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
