"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn, useSession } from "@/lib/auth-client";
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
import { toast } from "sonner";
import { Wrench, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawRedirect = searchParams.get("redirectTo");
  const callbackUrl =
    rawRedirect && rawRedirect.startsWith("/") ? rawRedirect : null;

  const { data: session, isPending } = useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!isPending && session?.user) {
      const role = session?.user?.role || "customer";
      router.replace(callbackUrl || `/dashboard/${role}`);
    }
  }, [session, isPending, router, callbackUrl]);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await signIn.email({
        email: email.trim().toLowerCase(),
        password,
        callbackURL: callbackUrl || "/",
      });

      if (error) {
        toast.error(error.message || "Invalid email or password.");
        return;
      }

      if (data) {
        toast.success("Welcome back to FixMate!");
        const role = data.user?.role || "customer";
        router.replace(callbackUrl || `/dashboard/${role}`);
        router.refresh();
        return;
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Something went wrong during sign in.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signIn.social({
        provider: "google",
        callbackURL: callbackUrl || "/dashboard/customer",
      });
    } catch {
      toast.error("Google sign-in failed.");
    }
  };

  return (
    <Card className="w-full max-w-md rounded-2xl border border-[#C2C0B1] bg-[#EBECE4] shadow-lg overflow-hidden">
      <CardHeader className="space-y-2.5 pb-6 pt-8 text-center bg-[#E2E1D8]/75 border-b border-[#C2C0B1]">
        <Link
          href="/"
          className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-xs border border-primary/25 transition-transform hover:scale-105"
        >
          <Wrench className="h-6 w-6" />
        </Link>
        <div className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
            Welcome back to FixMate
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Sign in to manage your repairs, bookings, or services
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-5 px-6 sm:px-8 pt-6 bg-[#EBECE4]">
        <form onSubmit={handleEmailSignIn} className="space-y-4">
          {/* Email Address */}
          <div className="space-y-1.5">
            <Label
              htmlFor="email"
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Email Address
            </Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="Enter Your Email"
                className="h-11 rounded-xl border border-[#C2C0B1] bg-[#E2E1D8]/65 pl-10 text-foreground placeholder:text-muted-foreground/80 transition-all focus-visible:bg-[#EBECE4] focus-visible:ring-2 focus-visible:ring-primary/30"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password with Toggle */}
          <div className="space-y-1.5">
            <Label
              htmlFor="password"
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Password
            </Label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                autoComplete="new-password"
                className="h-11 rounded-xl border border-[#C2C0B1] bg-[#E2E1D8]/65 pl-10 pr-10 text-foreground placeholder:text-muted-foreground/80 transition-all focus-visible:bg-[#EBECE4] focus-visible:ring-2 focus-visible:ring-primary/30"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="mt-2 h-11 w-full rounded-xl font-semibold shadow-xs transition-all hover:opacity-95 cursor-pointer"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-[#C2C0B1]" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#EBECE4] border border-[#C2C0B1] rounded-full px-3 py-0.5 font-medium text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        {/* Google Social Login */}
        <Button
          type="button"
          variant="outline"
          className="h-11 w-full rounded-xl border border-[#C2C0B1] bg-[#E2E1D8]/75 text-foreground font-medium transition-all hover:bg-[#E2E1D8]"
          onClick={handleGoogleSignIn}
        >
          <svg
            className="mr-2.5 h-4 w-4"
            aria-hidden="true"
            focusable="false"
            data-prefix="fab"
            data-icon="google"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 488 512"
          >
            <path
              fill="currentColor"
              d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
            />
          </svg>
          Continue with Google
        </Button>
      </CardContent>

      <CardFooter className="justify-center border-t border-[#C2C0B1] bg-[#E2E1D8]/75 py-4">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href={
              callbackUrl
                ? `/sign-up?redirectTo=${encodeURIComponent(callbackUrl)}`
                : "/sign-up"
            }
            className="font-semibold text-primary hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}

const SignInPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#EBECE4] px-4 py-12">
      <Suspense
        fallback={
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span>Loading sign-in form...</span>
          </div>
        }
      >
        <SignInForm />
      </Suspense>
    </div>
  );
};

export default SignInPage;