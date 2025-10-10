import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { saveUser, setCurrentUser, findUserByUsername, generateUserId, generateAnonymousId } from "@/services/storage";
import { useToast } from "@/hooks/use-toast";
import { useApp } from "@/hooks/use-app";
import { useLanguage } from "@/context/LanguageContext";
import { Eye, EyeOff } from "lucide-react";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState<'student' | 'working' | 'other'>('student');
  const [institution, setInstitution] = useState("");
  const [age, setAge] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setCurrentUser: updateCurrentUser } = useApp();
  const { t } = useLanguage();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Check if username exists
      if (findUserByUsername(username)) {
        toast({
          title: "Registration failed",
          description: "Username already exists. Please choose another one.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Create a new user
      const newUser = {
        id: generateUserId(),
        username,
        anonymousId: generateAnonymousId(),
        createdAt: new Date().toISOString(),
        userType,
        institution: institution.trim() || undefined,
        age: age ? parseInt(age) : undefined,
      };

      // Store user in localStorage
      saveUser(newUser);

      // Set as current user
      setCurrentUser(newUser);
      updateCurrentUser(newUser);

      toast({
        title: "Registration successful!",
        description: `Welcome to Whisper of Hope. Your anonymous ID is ${newUser.anonymousId}`,
      });

      // Redirect to reports page
      navigate("/reports");
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
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
            <CardTitle className="text-2xl text-center">{t('createAccount')}</CardTitle>
            <CardDescription className="text-center">
              {t('registerForAnonymousId')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium">
                  {t('username')}
                </label>
                <Input
                  id="username"
                  placeholder={t('chooseUsername')}
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
                    placeholder={t('choosePassword')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  {t('passwordStoredLocally')}
                </p>
              </div>
              <div className="space-y-2">
                <label htmlFor="confirm-password"
                  className="text-sm font-medium">
                  {t('confirmPassword')}
                </label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showPassword ? "text" : "password"}
                    placeholder={t('confirmYourPassword')}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    autoComplete="new-password"
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="userType" className="text-sm font-medium">
                    {t('status')}
                  </label>
                  <select
                    id="userType"
                    value={userType}
                    onChange={(e) => setUserType(e.target.value as 'student' | 'working' | 'other')}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-whisper-500"
                    required
                  >
                    <option value="">{t('selectStatus')}</option>
                    <option value="student">{t('student')}</option>
                    <option value="working">{t('working')}</option>
                    <option value="other">{t('other')}</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="age" className="text-sm font-medium">
                    {t('age')}
                  </label>
                  <input
                    id="age"
                    type="number"
                    min="5"
                    max="100"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-whisper-500"
                    placeholder={t('yourAge')}
                    required
                  />
                </div>
              </div>

              {(userType === 'student' || userType === 'working') && (
                <div className="space-y-2">
                  <label htmlFor="institution" className="text-sm font-medium">
                    {userType === 'student' ? t('schoolUniversity') : t('workplace')}
                  </label>
                  <input
                    id="institution"
                    type="text"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-whisper-500"
                    placeholder={userType === 'student' ? t('schoolPlaceholder') : t('workplacePlaceholder')}
                  />
                  <p className="text-xs text-muted-foreground">
                    {t('institutionNote')}
                  </p>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? t('registering') : t('register')}
              </Button>
            </form>
            <div className="mt-4 text-center text-sm">
              {t('alreadyHaveAccount')}{" "}
              <Link to="/login" className="text-whisper-700 hover:underline">
                {t('login')}
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
