import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import {
  ArrowUpRight,
  Brain,
  FileText,
  Microscope,
  Stethoscope,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-12 md:mb-0 md:pr-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-gray-900">
                AI-Powered Chest X-Ray Analysis for Medical Professionals
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Instant detection of abnormalities with detailed classification
                results. Enhance your diagnostic workflow with our advanced AI
                technology.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium"
                >
                  Start Demo
                  <ArrowUpRight className="ml-2 w-5 h-5" />
                </Link>
                <Link
                  href="#features"
                  className="inline-flex items-center px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-lg font-medium"
                >
                  Learn More
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 relative">
              <div className="bg-white p-4 rounded-xl shadow-lg">
                <Image
                  src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80"
                  alt="Chest X-ray analysis"
                  width={600}
                  height={400}
                  className="rounded-lg object-cover"
                  priority
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-blue-100 p-3 rounded-lg shadow-md">
                <div className="text-blue-800 font-semibold">
                  AI-Powered Analysis
                </div>
                <div className="text-blue-600 text-sm">
                  Fast & Accurate Results
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Advanced X-Ray Analysis Features
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our AI-powered platform provides medical professionals with
              powerful tools for chest X-ray analysis and reporting.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Brain className="w-6 h-6" />,
                title: "AI Detection",
                description:
                  "Advanced algorithms detect abnormalities with high accuracy",
              },
              {
                icon: <Microscope className="w-6 h-6" />,
                title: "Detailed Analysis",
                description:
                  "Comprehensive classification of detected conditions",
              },
              {
                icon: <FileText className="w-6 h-6" />,
                title: "PDF Reports",
                description:
                  "Generate detailed reports with findings and recommendations",
              },
              {
                icon: <Stethoscope className="w-6 h-6" />,
                title: "Clinical Support",
                description:
                  "Designed for medical professionals in clinical settings",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className="text-blue-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">99.8%</div>
              <div className="text-blue-100">Detection Accuracy</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">3 sec</div>
              <div className="text-blue-100">Average Analysis Time</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">15+</div>
              <div className="text-blue-100">Detectable Conditions</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform makes X-ray analysis simple and efficient for medical
              professionals.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                number: "01",
                title: "Upload X-Ray",
                description:
                  "Drag and drop or select a chest X-ray image to upload",
              },
              {
                number: "02",
                title: "AI Analysis",
                description:
                  "Our advanced AI analyzes the image and detects abnormalities",
              },
              {
                number: "03",
                title: "Review Results",
                description:
                  "View detailed results and generate comprehensive reports",
              },
            ].map((step, index) => (
              <div key={index} className="relative p-8 bg-gray-50 rounded-xl">
                <div className="text-6xl font-bold text-blue-100 absolute top-4 right-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold mb-4 relative z-10">
                  {step.title}
                </h3>
                <p className="text-gray-600 relative z-10">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Enhance Your Diagnostic Workflow?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join medical professionals who trust our AI-powered platform for
            chest X-ray analysis.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start Demo
            <ArrowUpRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
