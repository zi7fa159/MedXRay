import Link from "next/link";
import { Button } from "./ui/button";
import {
  Home,
  Stethoscope,
  History,
  Settings,
  HelpCircle,
  Bell,
  Search,
} from "lucide-react";
import { Input } from "./ui/input";
import { ThemeSwitcher } from "./theme-switcher";
import KeyboardShortcuts from "./keyboard-shortcuts";

export default function DashboardNavbar() {
  return (
    <nav className="w-full border-b border-gray-200 bg-white dark:bg-gray-950 py-4 sticky top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Link href="/" prefetch className="flex items-center gap-2">
            <Stethoscope className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold">MedXRay AI</span>
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
          >
            <Home className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
          <Link
            href="#"
            className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
          >
            <History className="h-5 w-5" />
            <span>History</span>
          </Link>
          <Link
            href="#"
            className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
          >
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </Link>
          <Link
            href="#"
            className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
          >
            <HelpCircle className="h-5 w-5" />
            <span>Help</span>
          </Link>
        </div>

        <div className="flex gap-4 items-center">
          <div className="relative hidden md:flex items-center mr-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-8 w-[200px] lg:w-[300px] bg-gray-50 dark:bg-gray-900"
            />
          </div>

          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>

          <KeyboardShortcuts />

          <ThemeSwitcher />

          <Link href="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
