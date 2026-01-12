"use client";

import { siteConfig } from "@/config/site";
import { usePrivy } from "@privy-io/react-auth";
import { GithubIcon, LogInIcon, LogOutIcon, MenuIcon, ShieldIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { privyUserToEmail } from "@/lib/converters";

export function SiteHeader() {
  const { ready, authenticated, user, login, logout } = usePrivy();

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="container max-w-6xl mx-auto flex h-16 items-center justify-between px-4">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent">
            <ShieldIcon className="w-4.5 h-4.5 text-primary-foreground" />
          </div>
          <span className="text-base font-semibold hidden sm:inline text-foreground">{siteConfig.name}</span>
        </Link>

        {/* Right: Menu */}
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <MenuIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {ready && !authenticated && (
                <DropdownMenuItem onClick={() => login()} className="cursor-pointer">
                  <LogInIcon className="w-4 h-4 mr-2" />
                  Sign In
                </DropdownMenuItem>
              )}
              {ready && authenticated && (
                <>
                  <DropdownMenuItem disabled className="text-xs text-muted-foreground">
                    {privyUserToEmail(user)}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => logout()} className="cursor-pointer text-destructive">
                    <LogOutIcon className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuSeparator />
              <Link href={siteConfig.links.github} target="_blank">
                <DropdownMenuItem className="cursor-pointer">
                  <GithubIcon className="w-4 h-4 mr-2" />
                  GitHub
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
