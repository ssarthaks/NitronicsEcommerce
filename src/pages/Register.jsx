"use client"

import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  })

  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })

    if (errors[name]) {
      setErrors({ ...errors, [name]: '' })
    }
  }

  const validateForm = () => {
    let formErrors = {}

    if (!formData.firstName) formErrors.firstName = 'First Name is required'
    if (!formData.lastName) formErrors.lastName = 'Last Name is required'
    if (!formData.email) formErrors.email = 'Email is required'
    if (!formData.phoneNumber) formErrors.phoneNumber = 'Phone Number is required'
    if (!formData.password) formErrors.password = 'Password is required'
    if (!formData.confirmPassword) formErrors.confirmPassword = 'Confirm Password is required'

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (formData.email && !emailPattern.test(formData.email)) {
      formErrors.email = 'Invalid email format'
    }

    const phonePattern = /^[0-9]{10}$/
    if (formData.phoneNumber && !phonePattern.test(formData.phoneNumber)) {
      formErrors.phoneNumber = 'Phone Number should be 10 digits'
    }

    if (formData.password !== formData.confirmPassword) {
      formErrors.confirmPassword = 'Passwords do not match'
    }

    return formErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
  
    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await axios.post('/api/users/register', formData)
        console.log(response.data.message)
        if (response.data.message === 'User registered successfully. Please verify your email using the OTP sent.') {
          navigate('/otp-verification', { state: { userId: response.data.userId } })
        } 
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'An error occurred'
        toast.error(errorMessage)
      }
    } else {
      setErrors(validationErrors)
    }
  }

  return (
    <motion.div 
      className="min-h-screen flex items-center justify-center bg-nitro-black"
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
    >
      <motion.div 
        className="w-full max-w-md bg-nitro-gray-800 shadow-md rounded-lg p-8"
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Register</h2>
        <form onSubmit={handleSubmit}>
          {['firstName', 'lastName', 'email', 'phoneNumber', 'password', 'confirmPassword'].map((field) => (
            <div key={field} className="mb-4">
              <label className="block text-nitro-gray-300 font-semibold mb-2" htmlFor={field}>
                {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
              </label>
              <input
                type={field.includes('password') ? 'password' : field === 'email' ? 'email' : 'text'}
                id={field}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-nitro-gray-700 text-white border border-nitro-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-nitro-accent"
              />
              {errors[field] && <p className="text-red-500 text-sm mt-1">{errors[field]}</p>}
            </div>
          ))}
          <p className='mb-2 text-nitro-gray-300'>
            Already have an account? 
            <Link to={'/login'} className='ml-1 text-nitro-accent hover:underline'>
              Sign In
            </Link>
          </p>
          <motion.button
            type="submit"
            className="w-full bg-nitro-accent text-nitro-black py-2 rounded-lg hover:bg-nitro-gray-200 focus:outline-none focus:bg-nitro-gray-200 transition duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Register
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  )
}

export default Register
