import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { sendEmailVerification } from "firebase/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const { signIn, signUp, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }
    setError("");
    try {
      if (isSignUp) {
        const userCred = await signUp(email, password);
        if (userCred.user) {
          try {
            await setDoc(doc(db, "users", userCred.user.uid), {
              email,
              role: "pending",
              approved: false,
              createdAt: new Date().toISOString(),
            });
            await sendEmailVerification(userCred.user);
            setError(
              "Account created. Please check your email to verify your account.",
            );
            await signOut();
          } catch (error) {
            console.error("Error setting up user:", error);
            setError(
              "Account created but there was an error setting up your profile. Please contact support.",
            );
          }
        }
      } else {
        const userCred = await signIn(email, password);
        if (userCred.user) {
          if (!userCred.user.emailVerified) {
            setError("Please verify your email before signing in");
            await sendEmailVerification(userCred.user);
            await signOut();
            return;
          }
          try {
            const userDoc = await getDoc(doc(db, "users", userCred.user.uid));
            const userData = userDoc.data();
            if (!userData?.approved) {
              setError("Your account is pending approval");
              await signOut();
              return;
            }
            navigate("/");
          } catch (error) {
            console.error("Error checking user status:", error);
            setError("Error checking account status. Please try again.");
            await signOut();
          }
        }
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      if (error.code === "auth/invalid-credential") {
        setError("Invalid email or password");
      } else if (error.code === "auth/email-already-in-use") {
        setError("Email already in use");
      } else if (error.code === "auth/invalid-email") {
        setError("Invalid email address");
      } else if (error.code === "auth/weak-password") {
        setError("Password should be at least 6 characters");
      } else {
        setError(error.message || "An error occurred");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Inventory Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              {isSignUp ? "Sign Up" : "Sign In"}
            </Button>
            <div className="text-center mt-4">
              <Button
                type="button"
                variant="link"
                onClick={() => setIsSignUp(!isSignUp)}
              >
                {isSignUp
                  ? "Already have an account? Sign In"
                  : "Need an account? Sign Up"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
