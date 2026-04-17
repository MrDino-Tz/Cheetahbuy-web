import { Button } from "@/components/ui/button";
import { SquareAsterisk } from "lucide-react";

export function SocialLogins() {
  return (
    <div className="flex flex-col gap-3">
      <Button variant="outline" className="w-full py-6 font-bold text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all active:scale-95">
        <SquareAsterisk
          className="me-3 text-[#DB4437] dark:text-[#DB4437]"
          size={18}
          aria-hidden="true"
        />
        Continue with Google
      </Button>
      <Button variant="outline" className="w-full py-6 font-bold text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all active:scale-95">
        <SquareAsterisk
          className="me-3 text-[#14171a] dark:text-white/60"
          size={18}
          aria-hidden="true"
        />
        Continue with X
      </Button>
      <Button variant="outline" className="w-full py-6 font-bold text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all active:scale-95">
        <SquareAsterisk
          className="me-3 text-[#1877f2] dark:text-white/60"
          size={18}
          aria-hidden="true"
        />
        Continue with Facebook
      </Button>
      <Button variant="outline" className="w-full py-6 font-bold text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all active:scale-95">
        <SquareAsterisk
          className="me-3 text-[#333333] dark:text-white/60"
          size={18}
          aria-hidden="true"
        />
        Continue with GitHub
      </Button>
    </div>
  );
}
