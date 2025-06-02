"use client";

import Link from "next/link";
import { Menu, X, ExternalLink } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { Button } from "@workspace/ui/components/button";
import { useState } from "react";
import { ThemeToggle } from "./theme-toggle";
import { motion, AnimatePresence } from "motion/react";
import { Badge } from "@workspace/ui/components/badge";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="container mx-auto px-4 py-3">
        <nav className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="mr-6 flex items-center gap-2">
              <span className="hidden items-baseline text-xl font-bold text-zinc-900 sm:flex dark:text-zinc-50">
                <span className="mr-1 text-amber-500">Quick</span>PNG
                <Badge variant="secondary" className="ml-2 text-xs">
                  v1.0
                </Badge>
              </span>
            </Link>
          </div>

          <div className="hidden items-center space-x-3 md:flex">
            <ThemeToggle />

            <Button
              variant="outline"
              size="default"
              className="rounded-md border-zinc-300 text-zinc-700 dark:border-zinc-700 dark:text-zinc-300"
              asChild
            >
              <Link href="/about">About</Link>
            </Button>

            <Button
              variant="outline"
              size="default"
              className="rounded-md border-zinc-300 text-zinc-700 dark:border-zinc-700 dark:text-zinc-300"
              asChild
            >
              <Link
                href="https://github.com/devharshthakur/quickpng"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaGithub className="mr-2 h-4 w-4" />
                Repo
                <ExternalLink className="ml-1 h-3 w-3 opacity-70" />
              </Link>
            </Button>
          </div>

          <div className="flex items-center md:hidden">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="ml-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </nav>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="container mx-auto border-t border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950">
              <div className="flex flex-col space-y-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="justify-start rounded-md border-zinc-300 text-zinc-700 dark:border-zinc-700 dark:text-zinc-300"
                  asChild
                >
                  <Link href="/about" onClick={() => setMobileMenuOpen(false)}>
                    About
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="justify-start rounded-md border-zinc-300 text-zinc-700 dark:border-zinc-700 dark:text-zinc-300"
                  asChild
                >
                  <Link
                    href="https://github.com/devharshthakur/quickpng"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FaGithub className="mr-2 h-4 w-4" />
                    Repo
                    <ExternalLink className="ml-1 h-3 w-3 opacity-70" />
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
