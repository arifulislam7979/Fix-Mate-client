"use client";

import { useState } from "react";
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

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, isPending } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const user = session?.user as
    | {
        name?: string;
        email?: string;
        image?: string;
        role?: string;
      }
    | undefined;
  const userRole = user?.role || "customer";

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
    <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2 sm:gap-2.5 group">
          <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform group-hover:scale-105">
            <Wrench className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <span className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
            Fix<span className="text-primary">Mate</span>
          </span>
        </Link>

        {/* Desktop & Tablet Navigation Links */}
        <nav className="hidden md:flex items-center gap-5 lg:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary whitespace-nowrap",
                isActive(link.href)
                  ? "text-primary font-semibold"
                  : "text-muted-foreground"
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop & Tablet Right Side Actions */}
        <div className="hidden md:flex items-center gap-3">
          {isPending ? (
            <div className="h-10 w-28 animate-pulse rounded-full bg-muted" />
          ) : session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <div className="flex items-center gap-2 rounded-full border border-border/80 bg-background/60 px-2.5 py-1.5 shadow-xs transition-all hover:bg-muted/60 hover:border-border cursor-pointer">
                  <Avatar className="h-7 w-7 lg:h-8 lg:w-8 border border-border/60">
                    <AvatarImage
                      src={user?.image || ""}
                      alt={user?.name || "User"}
                    />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                      {user?.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="max-w-[100px] lg:max-w-[150px] truncate text-sm font-medium text-foreground">
                    {user?.name}
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground mr-0.5" />
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className="w-60 p-2 rounded-2xl shadow-xl border-border/80 bg-card backdrop-blur"
                align="end"
              >
                <DropdownMenuGroup>
                  <div className="flex flex-col space-y-1.5 p-2.5 rounded-xl bg-muted/40 mb-1 border border-border/40">
                    <p className="text-sm font-semibold leading-none text-foreground truncate">
                      {user?.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground truncate">
                      {user?.email}
                    </p>
                    <div className="pt-1">
                      <Badge
                        variant="secondary"
                        className="capitalize text-[10px] font-semibold px-2 py-0.5 bg-primary/10 text-primary border-primary/20"
                      >
                        {userRole}
                      </Badge>
                    </div>
                  </div>
                </DropdownMenuGroup>

                <DropdownMenuSeparator className="my-1 bg-border/60" />

                <DropdownMenuItem
                  className="rounded-xl py-2 px-2.5 transition-colors focus:bg-primary/10 focus:text-primary"
                >
                  <Link
                    href={getDashboardRoute()}
                    className="cursor-pointer flex items-center gap-2.5 w-full font-medium text-sm"
                  >
                    <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="rounded-xl py-2 px-2.5 transition-colors focus:bg-primary/10 focus:text-primary"
                >
                  <Link
                    href="/dashboard/profile"
                    className="cursor-pointer flex items-center gap-2.5 w-full font-medium text-sm"
                  >
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>Update Profile</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="my-1 bg-border/60" />

                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="cursor-pointer rounded-xl py-2 px-2.5 text-red-600 focus:text-red-600 focus:bg-red-50 flex items-center gap-2.5 font-semibold text-sm transition-colors border-t border-red-100/60 mt-1"
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
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "rounded-xl font-medium"
                )}
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className={cn(
                  buttonVariants({ size: "sm" }),
                  "rounded-xl shadow-sm font-medium"
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
              className="rounded-full focus:outline-none"
            >
              <Avatar className="h-8 w-8 border border-border">
                <AvatarImage src={user?.image || ""} alt={user?.name || "User"} />
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
                "h-9 w-9 rounded-xl"
              )}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-[85vw] max-w-[340px] flex flex-col justify-between p-5 overflow-y-auto"
            >
              <div className="space-y-6">
                <SheetHeader className="text-left border-b border-border/60 pb-4">
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
                          ? "bg-primary/10 text-primary font-semibold"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      {link.name}
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Mobile Bottom User / Auth Section */}
              <div className="border-t border-border/60 pt-4 mt-6 space-y-2.5">
                {session?.user ? (
                  <>
                    <div className="flex items-center gap-3 p-3 bg-muted/40 border border-border/50 rounded-xl mb-3">
                      <Avatar className="h-10 w-10 border border-border shrink-0">
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
                          {user?.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user?.email}
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
                        "w-full justify-start rounded-xl h-10"
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
                        "w-full justify-start rounded-xl h-10"
                      )}
                    >
                      <User className="mr-2.5 h-4 w-4 text-muted-foreground" />
                      Update Profile
                    </Link>

                    <Button
                      variant="ghost"
                      className="w-full justify-start rounded-xl h-10 text-red-600 hover:text-red-600 hover:bg-red-50 border border-red-100/80 mt-1 font-semibold"
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
                        "w-full rounded-xl h-10"
                      )}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/sign-up"
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        buttonVariants({ variant: "default" }),
                        "w-full rounded-xl h-10"
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