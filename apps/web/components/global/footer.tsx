export function Footer() {
  return (
    <footer className="mt-12 border-t border-zinc-200 py-6 dark:border-zinc-800">
      <div className="container mx-auto px-4">
        <div className="text-center text-sm text-zinc-500 dark:text-zinc-400">
          <p>© {new Date().getFullYear()} QuickPNG. All rights reserved.</p>
          <p className="mt-2">Convert SVG to PNG in seconds</p>
        </div>
      </div>
    </footer>
  );
}
