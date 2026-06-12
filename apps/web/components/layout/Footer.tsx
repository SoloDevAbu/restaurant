import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full py-12 px-6 flex flex-col md:flex-row justify-between items-center gap-4 bg-muted border-t border-border mt-auto">
      <div className="flex flex-col items-center md:items-start gap-2">
        <span className="font-heading text-2xl font-bold text-primary">Modern Hearth</span>
        <p className="text-muted-foreground text-sm">© {new Date().getFullYear()} Modern Hearth Kitchen Systems</p>
      </div>
      <div className="flex flex-wrap justify-center gap-6">
        <Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Privacy</Link>
        <Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Terms</Link>
        <Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Support</Link>
        <Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Contact</Link>
      </div>
    </footer>
  );
}
