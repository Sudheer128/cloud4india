import React from 'react'
import { Link } from 'react-router-dom'
import { 
  ArrowRightIcon,
  StarIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  ClockIcon,
  GlobeAltIcon,
  BanknotesIcon,
  CpuChipIcon,
  KeyIcon,
  ScaleIcon,
  RocketLaunchIcon,
  LightBulbIcon,
  HandRaisedIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarIcon,
  PlayIcon,
  BookOpenIcon,
  UserGroupIcon,
  ChartBarSquareIcon,
  ShieldExclamationIcon,
  CurrencyEuroIcon,
  CreditCardIcon,
  BuildingLibraryIcon,
  IdentificationIcon
} from '@heroicons/react/24/outline'
import { useSolutionSections } from '../hooks/useSolutionSections'
import DynamicSection from '../components/DynamicSection'

const FinancialServices = () => {
  const { sections, loading, error } = useSolutionSections(1); // Financial Services solution ID is 1

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Financial Services page...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Error loading page: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
              Transform Your Financial Future
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Accelerate innovation, enhance security, and scale with confidence using Cloud4India's 
              comprehensive financial services platform trusted by leading institutions worldwide.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <button className="group bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-xl text-lg font-semibold transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/25 flex items-center">
                Start Your Journey
                <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="border-2 border-gray-400 hover:border-white text-gray-300 hover:text-white px-10 py-4 rounded-xl text-lg font-semibold transition-all duration-300 hover:bg-white/10">
                Watch Demo
              </button>
            </div>
            
            {/* Trust Indicators */}
            <div className="mt-16 pt-8 border-t border-gray-700">
              <p className="text-gray-400 text-sm mb-6">Trusted by leading financial institutions</p>
              <div className="flex justify-center items-center space-x-8 opacity-60">
                <div className="text-gray-300 font-semibold">HSBC</div>
                <div className="text-gray-300 font-semibold">Goldman Sachs</div>
                <div className="text-gray-300 font-semibold">JP Morgan</div>
                <div className="text-gray-300 font-semibold">Bank of America</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Sections */}
      {sections.map((section) => (
        <DynamicSection 
          key={section.id} 
          section={section} 
          solutionId={1} 
        />
      ))}

    </div>
  )
}

export default FinancialServices