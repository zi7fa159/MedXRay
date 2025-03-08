"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Keyboard } from "lucide-react";

interface ShortcutProps {
  keys: string[];
  description: string;
}

function Shortcut({ keys, description }: ShortcutProps) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
      <span className="text-sm">{description}</span>
      <div className="flex gap-1">
        {keys.map((key, index) => (
          <kbd
            key={index}
            className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
          >
            {key}
          </kbd>
        ))}
      </div>
    </div>
  );
}

export default function KeyboardShortcuts() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Example keyboard shortcut handling
      if (e.key === "?" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        // Open shortcuts dialog
        document.getElementById("shortcuts-trigger")?.click();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          id="shortcuts-trigger"
          variant="ghost"
          size="icon"
          className="relative"
          title="Keyboard Shortcuts (Ctrl+?)"
        >
          <Keyboard className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
          <DialogDescription>
            Use these keyboard shortcuts to navigate the application more
            efficiently.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-1 mt-4">
          <Shortcut
            keys={["Ctrl", "?"]}
            description="Show keyboard shortcuts"
          />
          <Shortcut keys={["Z", "+"]} description="Zoom in" />
          <Shortcut keys={["Z", "-"]} description="Zoom out" />
          <Shortcut keys={["R"]} description="Rotate image" />
          <Shortcut keys={["G"]} description="Toggle grid" />
          <Shortcut keys={["F"]} description="Fullscreen image" />
          <Shortcut keys={["P"]} description="Print report" />
          <Shortcut keys={["S"]} description="Save results" />
          <Shortcut keys={["Tab"]} description="Navigate between sections" />
          <Shortcut keys={["Esc"]} description="Close dialogs" />
        </div>
      </DialogContent>
    </Dialog>
  );
}
