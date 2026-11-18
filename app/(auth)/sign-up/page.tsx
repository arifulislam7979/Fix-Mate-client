"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUp, signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { Wrench, User, Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"customer" | "technician">("customer");
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validatePassword = (pass: string) => {
    if (pass.length < 6) return "Password must be at least 6 characters long.";
    if (!/[A-Z]/.test(pass)) return "Password must contain at least one uppercase letter.";
    if (!/[a-z]/.test(pass)) return "Password must contain at least one lowercase letter.";
    return null;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      toast.error(passwordError);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await signUp.email({
        email,
        password,
        name,
        role,
      });

      if (error) {
        toast.error(error.message || "Failed to sign up. Email might already exist.");
        return;
      }

      if(data) {
        toast.success("Account created successfully!");
        router.push('/')
        return
      }
      
      if (role === "technician") {
        router.push("/dashboard/technician");
      } else {
        router.push("/dashboard/customer");
      }
    } catch {
      toast.error( "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/dashboard/customer",
      });
    } catch {
      toast.error("Google sign-up failed.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-12">
      <Card className="w-full max-w-md shadow-lg border-border">
        <CardHeader className="text-center space-y-2 pb-6">
          <Link href="/" className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
            <Wrench className="h-6 w-6" />
          </Link>
          <CardTitle className="text-2xl font-bold tracking-tight">Create a FixMate Account</CardTitle>
          <CardDescription>
            Join as a Customer to request repairs or as a Technician to offer services
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <form onSubmit={handleSignUp} className="space-y-4">
            
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter Your Name"
                  className="pl-10"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter Your Email"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="New Password"
                  className="pl-10 pr-10"
                  value={password}
                  autoComplete="new-password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Must be 6+ chars with at least one uppercase & lowercase letter.
              </p>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  className="pl-10 pr-10"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-2 pt-1">
              <Label>Select Your Role</Label>
              <RadioGroup
                defaultValue="customer"
                value={role}
                onValueChange={(val) => setRole(val as "customer" | "technician")}
                className="grid grid-cols-2 gap-4"
              >
                <div className="flex items-center space-x-2 border rounded-xl p-3 cursor-pointer hover:bg-muted/50 transition has-checked:border-primary has-checked:bg-primary/5">
                  <RadioGroupItem value="customer" id="customer" />
                  <Label htmlFor="customer" className="cursor-pointer font-medium">Customer</Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-xl p-3 cursor-pointer hover:bg-muted/50 transition has-checked:border-primary has-checked:bg-primary/5">
                  <RadioGroupItem value="technician" id="technician" />
                  <Label htmlFor="technician" className="cursor-pointer font-medium">Technician</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full mt-2 cursor-pointer" disabled={loading}>
              {loading ? "Creating Account..." : "Sign Up"}
            </Button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full cursor-pointer"
            onClick={handleGoogleSignUp}
          >
            <svg className="mr-2 h-4 w-4 " aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
              <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
            </svg>
            Continue with Google
          </Button>
        </CardContent>

        <CardFooter className="justify-center border-t py-4">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-primary font-medium hover:underline">
              Sign In
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}