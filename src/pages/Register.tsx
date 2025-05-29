
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { saveUser, setCurrentUser, findUserByUsername, generateUserId, generateAnonymousId } from "@/services/storage";
import { useToast } from "@/hooks/use-toast";
import { useApp } from "@/context/AppContext";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState<'student' | 'working' | 'other'>('student');
  const [institution, setInstitution] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setCurrentUser: updateCurrentUser } = useApp();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
            <CardTitle className="text-2xl text-center">Create an Account</CardTitle>
            <CardDescription className="text-center">
              Register to get your unique anonymous identity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium">
                  Username
                </label>
                <Input
                  id="username"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Choose a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
                <p className="text-xs text-muted-foreground">
                  *Password is stored locally and only used to verify your identity
                </p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={userType === 'student' ? 'default' : 'outline'}
                    onClick={() => setUserType('student')}
                    className="flex-1"
                  >
                    Student
                  </Button>
                  <Button
                    type="button"
                    variant={userType === 'working' ? 'default' : 'outline'}
                    onClick={() => setUserType('working')}
                    className="flex-1"
                  >
                    Working
                  </Button>
                  <Button
                    type="button"
                    variant={userType === 'other' ? 'default' : 'outline'}
                    onClick={() => setUserType('other')}
                    className="flex-1"
                  >
                    Other
                  </Button>
                </div>
              </div>

              {(userType === 'student' || userType === 'working') && (
                <div className="space-y-2">
                  <label htmlFor="institution" className="text-sm font-medium">
                    {userType === 'student' ? 'School/University' : 'Workplace'}
                  </label>
                  <Input
                    id="institution"
                    placeholder={userType === 'student' ? 'e.g., University of Cape Town' : 'e.g., Company Name'}
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    This will be displayed publicly next to your anonymous ID
                  </p>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Registering..." : "Register"}
              </Button>
            </form>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-whisper-700 hover:underline">
                Log in
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
