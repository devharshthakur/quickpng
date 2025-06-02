import UploadArea from "@/components/upload/upload";

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="container mx-auto flex-1 px-4 py-8 md:py-12">
        {/* Changed max-w-2xl to max-w-4xl */}
        <div className="mx-auto max-w-4xl space-y-8">
          <div className="mb-12 space-y-4 text-center">
            <h1 className="text-3xl font-bold text-zinc-900 md:text-5xl dark:text-zinc-50">
              QuickPNG
            </h1>
            <p className="text-lg text-zinc-700 md:text-xl dark:text-zinc-300">
              Simple SVG to PNG Converter
            </p>
          </div>
          {/* Upload Area */}
          <UploadArea uploadUrl="api/upload" />
        </div>
      </main>
    </div>
  );
}
