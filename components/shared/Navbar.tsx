"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { Button, buttonVariants } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import {
  Wrench,
  Menu,
  LayoutDashboard,
  User,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface SessionUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string | null;
}

function NavbarContent() {
  const pathname = usePathname();
  const { data: session, isPending } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const user = session?.user as SessionUser | undefined;
  const userRole = (user?.role || "customer").toLowerCase();

  const getDashboardRoute = () => {
    if (userRole === "admin") return "/dashboard/admin";
    if (userRole === "technician") return "/dashboard/technician";
    return "/dashboard/customer";
  };

  const handleSignOut = async () => {
    try {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success("Signed out successfully");
            window.location.href = "/sign-in";
          },
        },
      });
    } catch {
      toast.error("Failed to sign out");
    }
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "How It Works", href: "/about" },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-200/90 bg-[#F6F6F1]/90 backdrop-blur-md shadow-[0_1px_12px_rgba(15,23,42,0.04)]">
      <div className="w-full max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5 group focus:outline-none"
        >
          <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs ring-1 ring-black/5 transition-transform duration-200 group-hover:scale-105">
            <Wrench className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <span className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
            Fix<span className="text-primary">Mate</span>
          </span>
        </Link>

        {/* Desktop & Tablet Navigation Links */}
        <nav className="hidden md:flex items-center gap-2 lg:gap-4 rounded-full bg-[#ECECE4]/80 px-2 py-1 border border-stone-200/70">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-150 whitespace-nowrap",
                  active
                    ? "bg-white text-primary font-semibold shadow-2xs ring-1 ring-stone-200/80"
                    : "text-stone-600 hover:text-foreground hover:bg-white/50",
                )}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Desktop & Tablet Right Side Actions */}
        <div className="hidden md:flex items-center gap-3">
          {isPending ? (
            <div className="h-10 w-32 animate-pulse rounded-full bg-stone-200/80" />
          ) : session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <div className="flex items-center gap-2.5 rounded-full border border-stone-200/90 bg-white/90 px-2.5 py-1.5 shadow-2xs transition-all hover:bg-white hover:border-stone-300 cursor-pointer">
                  <Avatar className="h-7 w-7 lg:h-8 lg:w-8 border border-stone-200">
                    <AvatarImage
                      src={user?.image || ""}
                      alt={user?.name || "User"}
                    />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                      {user?.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="max-w-[110px] lg:max-w-[150px] truncate text-sm font-medium text-foreground">
                    {user?.name || "Account"}
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground mr-0.5" />
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className="w-64 p-2 rounded-2xl shadow-lg border-stone-200/90 bg-[#FAF9F5]"
                align="end"
              >
                <DropdownMenuGroup>
                  <div className="flex flex-col space-y-1.5 p-3 rounded-xl bg-[#EFEFE8]/80 mb-1.5 border border-stone-200/60">
                    <p className="text-sm font-semibold leading-none text-foreground truncate">
                      {user?.name || "User"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground truncate">
                      {user?.email || ""}
                    </p>
                    <div className="pt-1">
                      <Badge
                        variant="secondary"
                        className="capitalize text-[10px] font-semibold px-2 py-0.5 bg-primary/10 text-primary border border-primary/20"
                      >
                        {userRole}
                      </Badge>
                    </div>
                  </div>
                </DropdownMenuGroup>

                <DropdownMenuItem className="p-0 rounded-xl focus:bg-transparent">
                  <Link
                    href={getDashboardRoute()}
                    className="flex items-center gap-2.5 w-full rounded-xl py-2.5 px-3 font-medium text-sm text-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                  >
                    <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem className="p-0 rounded-xl focus:bg-transparent">
                  <Link
                    href="/dashboard/profile"
                    className="flex items-center gap-2.5 w-full rounded-xl py-2.5 px-3 font-medium text-sm text-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                  >
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>Update Profile</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="my-1.5 bg-stone-200/80" />

                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="cursor-pointer rounded-xl py-2.5 px-3 text-red-600 focus:text-red-600 focus:bg-red-50 flex items-center gap-2.5 font-semibold text-sm transition-colors"
                >
                  <LogOut className="h-4 w-4 text-red-500" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link
                href="/sign-in"
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "rounded-xl font-medium bg-white/80 border-stone-200 hover:bg-white",
                )}
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className={cn(
                  buttonVariants({ size: "sm" }),
                  "rounded-xl shadow-xs font-medium",
                )}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Section (< 768px) */}
        <div className="flex md:hidden items-center gap-2">
          {!isPending && session?.user && (
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              aria-label="Open user menu"
              className="rounded-full focus:outline-none ring-1 ring-stone-200"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={user?.image || ""}
                  alt={user?.name || "User"}
                />
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </button>
          )}

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger
              className={cn(
                buttonVariants({ variant: "outline", size: "icon" }),
                "h-9 w-9 rounded-xl bg-white/85 border-stone-200 hover:bg-white",
              )}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-[85vw] max-w-[340px] flex flex-col justify-between p-5 overflow-y-auto bg-[#F6F6F1] border-l border-stone-200"
            >
              <div className="space-y-6">
                <SheetHeader className="text-left border-b border-stone-200/80 pb-4">
                  <SheetTitle>
                    <Link
                      href="/"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2.5"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                        <Wrench className="h-4 w-4" />
                      </div>
                      <span className="text-lg font-bold text-foreground">
                        Fix<span className="text-primary">Mate</span>
                      </span>
                    </Link>
                  </SheetTitle>
                </SheetHeader>

                {/* Mobile Navigation Links */}
                <nav className="flex flex-col space-y-1.5">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "text-sm font-medium px-3.5 py-2.5 rounded-xl transition-colors",
                        isActive(link.href)
                          ? "bg-white text-primary font-semibold shadow-2xs ring-1 ring-stone-200/80"
                          : "text-stone-600 hover:bg-white/60 hover:text-foreground",
                      )}
                    >
                      {link.name}
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Mobile Bottom User / Auth Section */}
              <div className="border-t border-stone-200/80 pt-4 mt-6 space-y-2.5">
                {session?.user ? (
                  <>
                    <div className="flex items-center gap-3 p-3 bg-white/80 border border-stone-200/80 rounded-xl mb-3">
                      <Avatar className="h-10 w-10 border border-stone-200 shrink-0">
                        <AvatarImage
                          src={user?.image || ""}
                          alt={user?.name || "User"}
                        />
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                          {user?.name?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-foreground truncate">
                          {user?.name || "User"}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user?.email || ""}
                        </p>
                        <Badge
                          variant="secondary"
                          className="mt-1 text-[10px] capitalize bg-primary/10 text-primary"
                        >
                          {userRole}
                        </Badge>
                      </div>
                    </div>

                    <Link
                      href={getDashboardRoute()}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        buttonVariants({ variant: "outline" }),
                        "w-full justify-start rounded-xl h-10 bg-white/80 border-stone-200 hover:bg-white",
                      )}
                    >
                      <LayoutDashboard className="mr-2.5 h-4 w-4 text-muted-foreground" />
                      Dashboard
                    </Link>

                    <Link
                      href="/dashboard/profile"
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        buttonVariants({ variant: "outline" }),
                        "w-full justify-start rounded-xl h-10 bg-white/80 border-stone-200 hover:bg-white",
                      )}
                    >
                      <User className="mr-2.5 h-4 w-4 text-muted-foreground" />
                      Update Profile
                    </Link>

                    <Button
                      variant="ghost"
                      className="w-full justify-start rounded-xl h-10 text-red-600 hover:text-red-600 hover:bg-red-50 border border-red-200/70 mt-1 font-semibold"
                      onClick={() => {
                        setIsOpen(false);
                        handleSignOut();
                      }}
                    >
                      <LogOut className="mr-2.5 h-4 w-4 text-red-500" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-2.5 pt-1">
                    <Link
                      href="/sign-in"
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        buttonVariants({ variant: "outline" }),
                        "w-full rounded-xl h-10 bg-white/80 border-stone-200",
                      )}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/sign-up"
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        buttonVariants({ variant: "default" }),
                        "w-full rounded-xl h-10",
                      )}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export default function Navbar() {
  return (
    <Suspense
      fallback={
        <header className="sticky top-0 z-50 w-full border-b border-stone-200/90 bg-[#F6F6F1]/90 h-16" />
      }
    >
      <NavbarContent />
    </Suspense>
  );
}