import Link from "next/link";
import { Footer } from "@/components/global/footer";
import { Button } from "@workspace/ui/components/button";
import {
  ArrowLeft,
  FileImage,
  Zap,
  GitPullRequest,
  Shield,
  ExternalLink,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="container mx-auto flex-1 px-4 py-10">
        <div className="mx-auto max-w-6xl">
          <div className="space-y-12">
            {/* Hero section */}
            <div className="space-y-4 text-center">
              <div className="mb-4 inline-flex items-center justify-center rounded-xl bg-amber-100 p-2 dark:bg-amber-900/30">
                <div className="relative flex h-16 w-16 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 shadow-md">
                  <span className="text-2xl font-bold text-white">Q</span>
                  <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-md bg-zinc-800 shadow-sm dark:bg-white">
                    <span className="text-xs font-bold text-white dark:text-zinc-900">
                      PNG
                    </span>
                  </div>
                </div>
              </div>
              <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">
                About QuickPNG
              </h1>
              <p className="mx-auto max-w-3xl text-xl text-zinc-600 dark:text-zinc-400">
                A simple, fast, and free tool to convert SVG files to PNG format
              </p>
            </div>

            {/* Main content */}
            <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-md dark:border-zinc-800 dark:bg-zinc-900">
              <div className="p-8 md:p-12">
                <div className="mx-auto max-w-4xl">
                  <p className="mb-8 text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
                    QuickPNG is a browser-based tool designed to make SVG to PNG
                    conversion as simple as possible. Whether you need to
                    convert a single SVG file or batch process multiple files,
                    QuickPNG provides a straightforward solution with both quick
                    and custom conversion options.
                  </p>
                </div>

                <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div className="rounded-xl bg-zinc-50 p-8 dark:bg-zinc-800">
                    <div className="mb-4 w-fit rounded-full bg-amber-100 p-3 dark:bg-amber-900/30">
                      <FileImage className="h-6 w-6 text-amber-500" />
                    </div>
                    <h3 className="mb-3 text-xl font-medium text-zinc-900 dark:text-zinc-50">
                      Simple Conversion
                    </h3>
                    <p className="text-zinc-600 dark:text-zinc-400">
                      Upload your SVG files and convert them to PNG with just a
                      few clicks. The intuitive interface makes the process
                      quick and easy.
                    </p>
                  </div>

                  <div className="rounded-xl bg-zinc-50 p-8 dark:bg-zinc-800">
                    <div className="mb-4 w-fit rounded-full bg-amber-100 p-3 dark:bg-amber-900/30">
                      <Zap className="h-6 w-6 text-amber-500" />
                    </div>
                    <h3 className="mb-3 text-xl font-medium text-zinc-900 dark:text-zinc-50">
                      Fast Processing
                    </h3>
                    <p className="text-zinc-600 dark:text-zinc-400">
                      Quick conversion with optimal settings or customize to
                      your specific needs. Batch processing makes handling
                      multiple files efficient.
                    </p>
                  </div>

                  <div className="rounded-xl bg-zinc-50 p-8 dark:bg-zinc-800">
                    <div className="mb-4 w-fit rounded-full bg-amber-100 p-3 dark:bg-amber-900/30">
                      <Shield className="h-6 w-6 text-amber-500" />
                    </div>
                    <h3 className="mb-3 text-xl font-medium text-zinc-900 dark:text-zinc-50">
                      Privacy First
                    </h3>
                    <p className="text-zinc-600 dark:text-zinc-400">
                      All processing happens in your browser - your files never
                      leave your device. No data is stored on servers, ensuring
                      complete privacy.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-12 border-t border-zinc-200 pt-12 md:grid-cols-2 dark:border-zinc-800">
                  <div>
                    <h2 className="mb-6 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                      Technical Details
                    </h2>
                    <p className="mb-6 text-zinc-700 dark:text-zinc-300">
                      QuickPNG is built with modern web technologies to provide
                      a fast, reliable conversion experience:
                    </p>
                    <ul className="space-y-4 text-zinc-600 dark:text-zinc-400">
                      <li className="flex items-start">
                        <span className="mr-3 mt-1 text-amber-500">•</span>
                        <span>
                          Built with Next.js and TypeScript for a robust,
                          type-safe application
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-3 mt-1 text-amber-500">•</span>
                        <span>
                          Uses the HTML Canvas API for high-quality SVG to PNG
                          conversion
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-3 mt-1 text-amber-500">•</span>
                        <span>
                          Client-side processing ensures your files remain
                          private and secure
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-3 mt-1 text-amber-500">•</span>
                        <span>
                          Responsive design works on desktop, tablet, and mobile
                          devices
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h2 className="mb-6 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                      Why Convert SVG to PNG?
                    </h2>
                    <p className="mb-6 text-zinc-700 dark:text-zinc-300">
                      While SVG files are excellent for scalable graphics, PNG
                      files offer broader compatibility:
                    </p>
                    <ul className="space-y-4 text-zinc-600 dark:text-zinc-400">
                      <li className="flex items-start">
                        <span className="mr-3 mt-1 text-amber-500">•</span>
                        <span>
                          Universal compatibility across all platforms and
                          applications
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-3 mt-1 text-amber-500">•</span>
                        <span>
                          Better support in older software and systems
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-3 mt-1 text-amber-500">•</span>
                        <span>
                          Consistent rendering across different browsers and
                          devices
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-3 mt-1 text-amber-500">•</span>
                        <span>
                          Ideal for use in presentations, documents, and social
                          media
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Open source section */}
            <div className="rounded-xl border border-zinc-200 bg-gradient-to-r from-zinc-100 to-zinc-50 p-8 shadow-sm dark:border-zinc-800 dark:from-zinc-800 dark:to-zinc-900">
              <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
                <div className="flex items-center gap-6">
                  <div className="rounded-full bg-zinc-200 p-4 dark:bg-zinc-700">
                    <GitPullRequest className="h-8 w-8 text-zinc-700 dark:text-zinc-300" />
                  </div>
                  <div>
                    <h3 className="mb-2 text-2xl font-medium text-zinc-900 dark:text-zinc-50">
                      Open Source Project
                    </h3>
                    <p className="text-lg text-zinc-600 dark:text-zinc-400">
                      QuickPNG is free and open source. Contributions welcome!
                    </p>
                  </div>
                </div>
                <Button size="lg" className="px-8 py-6 text-base" asChild>
                  <Link
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaGithub className="mr-2 h-5 w-5" />
                    View on GitHub
                    <ExternalLink className="ml-2 h-4 w-4 opacity-70" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
