import DashboardNavbar from "@/components/dashboard-navbar";
import { InfoIcon, Stethoscope } from "lucide-react";
import EnhancedDashboard from "@/components/enhanced-dashboard";
import GuidedTour from "@/components/guided-tour";

export default async function Dashboard() {
  return (
    <>
      <DashboardNavbar />
      <GuidedTour />
      <main className="w-full bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="container mx-auto px-4 py-8 flex flex-col gap-8">
          {/* Header Section */}
          <header className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div className="flex items-center gap-3">
                <Stethoscope className="h-8 w-8 text-blue-600" />
                <h1 className="text-3xl font-bold">X-Ray Analysis Dashboard</h1>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                  Demo Mode
                </div>
                <div className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                  API: Online
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 dark:bg-blue-950 text-sm p-4 rounded-lg text-blue-700 dark:text-blue-300 flex gap-2 items-center border border-blue-100 dark:border-blue-900 col-span-2">
                <InfoIcon size="16" />
                <span>
                  Upload a chest X-ray image to receive AI-powered analysis and
                  detailed classification results. For batch processing, use the
                  Batch Analysis tab.
                </span>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 text-sm p-4 rounded-lg border flex flex-col justify-center items-center">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  CREDITS REMAINING
                </div>
                <div className="text-2xl font-bold">∞</div>
                <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  Demo Account
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <EnhancedDashboard />
        </div>
      </main>
    </>
  );
}
