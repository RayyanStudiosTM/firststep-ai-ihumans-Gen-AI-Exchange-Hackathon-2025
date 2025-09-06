"use client";
import React, { useState } from 'react';
import { Check, X, Star, Zap, Crown, Users, MessageCircle, Video, Brain, TrendingUp, Sparkles, Menu, Brain as BrainIcon } from 'lucide-react';
import Link from "next/link";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Mini navbar component inside the page
  const PricingNavbar = () => (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg shadow-sm py-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center">
              <BrainIcon className="w-6 h-6 text-violet-600" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              FirstStep AI
            </span>
          </Link>

          {/* Back to Home */}
          <Link href="/" className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-full hover:shadow-lg transition-all">
            Back to Home
          </Link>
        </div>
      </div>
    </nav>
  );

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      description: 'Perfect for individuals starting their career journey',
      icon: MessageCircle,
      prices: { monthly: 19, yearly: 199 },
      features: [
        '10 AI conversations per month',
        'Text-based career guidance',
        'Basic personality assessment',
        'Career path suggestions',
        'Email support',
        'Mobile app access'
      ],
      popular: false
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'Ideal for professionals seeking career advancement',
      icon: Zap,
      prices: { monthly: 49, yearly: 499 },
      features: [
        'Unlimited AI conversations',
        'Voice & video avatar sessions',
        'Advanced personality assessment',
        'Personalized career roadmaps',
        'Industry insights & trends',
        'Resume optimization',
        'Interview preparation',
        'Priority email support'
      ],
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Comprehensive solution for organizations',
      icon: Crown,
      prices: { monthly: 99, yearly: 999 },
      features: [
        'Everything in Professional',
        'Unlimited voice/video sessions',
        '1-on-1 human career counselor',
        'Custom AI training',
        'Team dashboards',
        'Advanced analytics',
        'API access',
        '24/7 priority support'
      ],
      popular: false
    }
  ];

  return (
    <>
      <PricingNavbar />
      <div className="pt-20 min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-6">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 bg-clip-text text-transparent mb-6">
                Choose Your Career Growth Plan
              </h1>
              <p className="text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Unlock your potential with AI-powered career guidance.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Billing Toggle */}
          <div className="flex justify-center mb-16">
            <div className="bg-white rounded-2xl p-2 shadow-lg border">
              <div className="flex">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-8 py-3 rounded-xl font-semibold transition-all ${
                    billingCycle === 'monthly'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'text-gray-600'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle('yearly')}
                  className={`px-8 py-3 rounded-xl font-semibold transition-all relative ${
                    billingCycle === 'yearly'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'text-gray-600'
                  }`}
                >
                  Yearly
                  <span className="absolute -top-3 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    Save 20%
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan) => {
              const PlanIcon = plan.icon;
              const price = plan.prices[billingCycle];

              return (
                <div
                  key={plan.id}
                  className={`bg-white rounded-3xl shadow-xl border-2 transition-all duration-500 hover:-translate-y-4 hover:scale-105 ${
                    plan.popular 
                      ? 'border-purple-300 ring-4 ring-purple-100 scale-105' 
                      : 'border-gray-200'
                  } overflow-hidden flex flex-col h-full`}
                >
                  {plan.popular && (
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-center py-3 font-bold text-sm">
                      <div className="flex items-center justify-center">
                        <Star className="w-4 h-4 mr-2" />
                        Most Popular Choice
                        <Star className="w-4 h-4 ml-2" />
                      </div>
                    </div>
                  )}

                  <div className={`p-8 flex flex-col h-full ${plan.popular ? 'pt-16' : ''}`}>
                    <div className="text-center mb-8">
                      <div className="inline-flex p-4 rounded-2xl mb-6 bg-purple-100">
                        <PlanIcon className="w-8 h-8 text-purple-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">{plan.name}</h3>
                      <p className="text-gray-600 mb-6">{plan.description}</p>
                      
                      <div className="mb-6">
                        <div className="flex items-baseline justify-center mb-2">
                          <span className="text-5xl font-bold text-gray-900">${price}</span>
                          <span className="text-gray-500 ml-2">/{billingCycle === 'monthly' ? 'month' : 'year'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex-grow mb-8">
                      <ul className="space-y-4">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button className="w-full py-4 px-6 rounded-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all">
                      Get Started with {plan.name}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
