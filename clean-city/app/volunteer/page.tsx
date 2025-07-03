'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, Upload, ArrowRight, Check } from 'lucide-react'

const VolunteerRegistration = () => {
  const [formStep, setFormStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    dateOfBirth: '',
    occupation: '',
    interests: [] as string[],
    availability: [] as string[],
    previousExperience: '',
    howHeard: '',
    agreeToTerms: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      
      if (name === 'agreeToTerms') {
        setFormData({ ...formData, [name]: checked })
      } else {
        // Handle checkbox groups (interests, availability)
        const array = [...formData[name as 'interests' | 'availability']]
        if (checked) {
          array.push(value)
        } else {
          const index = array.indexOf(value)
          if (index > -1) {
            array.splice(index, 1)
          }
        }
        setFormData({ ...formData, [name]: array })
      }
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      console.log('Form submitted:', formData)
      // Show success state
      setSubmitted(true)
      setSubmitting(false)
    }, 1500)
  }

  const nextStep = () => setFormStep(formStep + 1)
  const prevStep = () => setFormStep(formStep - 1)

  const interestOptions = [
    'Waste Management',
    'Plastic Reduction',
    'Recycling Education',
    'Community Cleanup',
    'Public Awareness',
    'Tree Planting',
  ]

  const availabilityOptions = [
    'Weekday Mornings',
    'Weekday Afternoons',
    'Weekday Evenings',
    'Weekend Mornings',
    'Weekend Afternoons',
    'Weekend Evenings',
  ]

  // Validation checks for each step
  const isStep1Valid = formData.firstName && formData.lastName && formData.email && formData.phone && formData.address && formData.city && formData.zipCode && formData.dateOfBirth
  
  const isStep2Valid = formData.interests.length > 0 && formData.availability.length > 0
  
  const isStep3Valid = formData.agreeToTerms

  // Success component
  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="card p-8 text-center">
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="text-primary-700" size={40} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Registration Successful!</h1>
            <p className="text-lg text-gray-600 mb-8">
              Thank you for volunteering with CleanCity. We've sent a confirmation email with more details.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard" className="btn btn-primary">
                Go to Dashboard
              </Link>
              <Link href="/campaigns" className="btn btn-secondary">
                Browse Campaigns
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-sm text-gray-600 hover:text-primary-700 transition-colors">
            <ChevronLeft size={16} className="mr-1" />
            Back to Home
          </Link>
        </div>

        <div className="card overflow-hidden">
          <div className="bg-primary-700 py-6 px-8">
            <h1 className="text-2xl font-bold text-white">Volunteer Registration</h1>
            <p className="text-primary-100 mt-2">Join our community of volunteers making a difference</p>
          </div>

          {/* Progress Indicator */}
          <div className="bg-white px-8 pt-6">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${formStep >= 1 ? 'bg-primary-700 text-white' : 'bg-gray-200 text-gray-600'}`}>
                  1
                </div>
                <div className={`h-1 w-12 ${formStep >= 2 ? 'bg-primary-700' : 'bg-gray-200'}`}></div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${formStep >= 2 ? 'bg-primary-700 text-white' : 'bg-gray-200 text-gray-600'}`}>
                  2
                </div>
                <div className={`h-1 w-12 ${formStep >= 3 ? 'bg-primary-700' : 'bg-gray-200'}`}></div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${formStep >= 3 ? 'bg-primary-700 text-white' : 'bg-gray-200 text-gray-600'}`}>
                  3
                </div>
              </div>
              <div className="text-sm text-gray-500">Step {formStep} of 3</div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="px-8 pb-8">
            {/* Step 1: Personal Information */}
            {formStep === 1 && (
              <div>
                <h2 className="text-xl font-semibold mb-6 text-gray-800">Personal Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                      First Name*
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name*
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address*
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number*
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Address*
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-6">
                  <div className="col-span-2 md:col-span-1">
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                      City*
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                      Zip Code*
                    </label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth*
                    </label>
                    <input
                      type="date"
                      id="dateOfBirth"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="occupation" className="block text-sm font-medium text-gray-700 mb-1">
                    Occupation
                  </label>
                  <input
                    type="text"
                    id="occupation"
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                
                <div className="flex justify-end mt-8">
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!isStep1Valid}
                    className={`btn ${isStep1Valid ? 'btn-primary' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                  >
                    Next Step <ArrowRight size={16} className="ml-1" />
                  </button>
                </div>
              </div>
            )}
            
            {/* Step 2: Interests and Availability */}
            {formStep === 2 && (
              <div>
                <h2 className="text-xl font-semibold mb-6 text-gray-800">Interests & Availability</h2>
                
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Areas of Interest (select all that apply)*
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {interestOptions.map((interest) => (
                      <div key={interest} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`interest-${interest}`}
                          name="interests"
                          value={interest}
                          checked={formData.interests.includes(interest)}
                          onChange={handleChange}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`interest-${interest}`} className="ml-2 text-gray-700">
                          {interest}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Availability (select all that apply)*
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {availabilityOptions.map((time) => (
                      <div key={time} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`availability-${time}`}
                          name="availability"
                          value={time}
                          checked={formData.availability.includes(time)}
                          onChange={handleChange}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`availability-${time}`} className="ml-2 text-gray-700">
                          {time}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="previousExperience" className="block text-sm font-medium text-gray-700 mb-1">
                    Previous Volunteer Experience (if any)
                  </label>
                  <textarea
                    id="previousExperience"
                    name="previousExperience"
                    value={formData.previousExperience}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Please describe any previous volunteer experience..."
                  ></textarea>
                </div>
                
                <div className="flex justify-between mt-8">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="btn bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    <ChevronLeft size={16} className="mr-1" /> Previous
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!isStep2Valid}
                    className={`btn ${isStep2Valid ? 'btn-primary' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                  >
                    Next Step <ArrowRight size={16} className="ml-1" />
                  </button>
                </div>
              </div>
            )}
            
            {/* Step 3: Additional Information */}
            {formStep === 3 && (
              <div>
                <h2 className="text-xl font-semibold mb-6 text-gray-800">Additional Information</h2>
                
                <div className="mb-8">
                  <label htmlFor="howHeard" className="block text-sm font-medium text-gray-700 mb-1">
                    How did you hear about us?
                  </label>
                  <select
                    id="howHeard"
                    name="howHeard"
                    value={formData.howHeard}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Please select...</option>
                    <option value="Social Media">Social Media</option>
                    <option value="Friend or Family">Friend or Family</option>
                    <option value="Community Event">Community Event</option>
                    <option value="News Article">News Article</option>
                    <option value="School/College">School/College</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Upload ID (optional)
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                        >
                          <span>Upload a file</span>
                          <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="agreeToTerms"
                        name="agreeToTerms"
                        type="checkbox"
                        checked={formData.agreeToTerms}
                        onChange={handleChange}
                        required
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="agreeToTerms" className="font-medium text-gray-700">
                        I agree to the terms and conditions*
                      </label>
                      <p className="text-gray-500">
                        By signing up, you agree to our{" "}
                        <Link href="/terms" className="text-primary-600 hover:underline">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="text-primary-600 hover:underline">
                          Privacy Policy
                        </Link>
                        .
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between mt-8">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="btn bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    <ChevronLeft size={16} className="mr-1" /> Previous
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || !isStep3Valid}
                    className={`btn ${isStep3Valid ? 'btn-primary' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                  >
                    {submitting ? 'Submitting...' : 'Complete Registration'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

export default VolunteerRegistration 