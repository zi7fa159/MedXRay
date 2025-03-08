import Link from "next/link";
import { Button } from "./ui/button";
import { Stethoscope } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="w-full border-b border-gray-200 bg-white py-4 sticky top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" prefetch className="flex items-center gap-2">
          <Stethoscope className="h-6 w-6 text-blue-600" />
          <span className="text-xl font-bold">MedXRay AI</span>
        </Link>

        <div className="hidden md:flex space-x-6">
          <Link
            href="#features"
            className="text-gray-600 hover:text-blue-600 font-medium"
          >
            Features
          </Link>
          <Link
            href="#"
            className="text-gray-600 hover:text-blue-600 font-medium"
          >
            How It Works
          </Link>
          <Link
            href="#"
            className="text-gray-600 hover:text-blue-600 font-medium"
          >
            Research
          </Link>
          <Link
            href="#"
            className="text-gray-600 hover:text-blue-600 font-medium"
          >
            About
          </Link>
        </div>

        <div className="flex gap-4 items-center">
          <Link
            href="/dashboard"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Start Demo
          </Link>
        </div>
      </div>
    </nav>
  );
}
