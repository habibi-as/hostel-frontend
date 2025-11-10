import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { FaEye, FaEyeSlash, FaSun, FaMoon } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    batch: '',
    role: 'student',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const { register, loading } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = 'Invalid email';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.role) newErrors.role = 'Please select a role';
    if (formData.role === 'student' && !formData.batch)
      newErrors.batch = 'Batch is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (typeof register !== 'function') {
        console.error('❌ register is not a function:', register);
        toast.error('Internal error: register function missing.');
        return;
      }

      const result = await register(formData);
      if (result?.success) {
        toast.success(
          `${formData.role.charAt(0).toUpperCase() + formData.role.slice(1)} registered successfully!`
        );
        navigate('/login');
      } else {
        toast.error(result?.message || 'Registration failed');
      }
    } catch (err) {
      console.error('❌ Registration error:', err);
      toast.error('An unexpected error occurred during registration');
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ${
        darkMode ? 'dark bg-gray-900' : 'bg-gray-50'
      }`}
    >
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center items-center mb-6">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {darkMode ? (
                <FaSun className="w-5 h-5" />
              ) : (
                <FaMoon className="w-5 h-5" />
              )}
            </button>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Create an Account
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Join HostelHub and get started
          </p>
        </div>

        {/* Form */}
        <div
          className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl rounded-lg p-8`}
        >
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Name */}
            <div>
              <label htmlFor="name" className="label">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className={`input mt-1 ${errors.name ? 'border-red-500' : ''}`}
                placeholder="Enter your name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="label">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`input mt-1 ${errors.email ? 'border-red-500' : ''}`}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="label">
                Password
              </label>
              <div className="relative mt-1">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  className={`input pr-10 ${errors.password ? 'border-red-500' : ''}`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <FaEyeSlash className="h-4 w-4 text-gray-400" />
                  ) : (
                    <FaEye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="label">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="text"
                value={formData.phone}
                onChange={handleChange}
                className="input mt-1"
                placeholder="Enter phone number"
              />
            </div>

            {/* Role */}
            <div>
              <label htmlFor="role" className="label">
                Register as
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={`input mt-1 ${errors.role ? 'border-red-500' : ''}`}
              >
                <option value="student">Student</option>
                <option value="admin">Admin</option>
              </select>
              {errors.role && (
                <p className="mt-1 text-sm text-red-600">{errors.role}</p>
              )}
            </div>

            {/* Batch */}
            {formData.role === 'student' && (
              <div>
                <label htmlFor="batch" className="label">
                  Batch
                </label>
                <input
                  id="batch"
                  name="batch"
                  type="text"
                  value={formData.batch}
                  onChange={handleChange}
                  className={`input mt-1 ${errors.batch ? 'border-red-500' : ''}`}
                  placeholder="e.g. CSE-2024"
                />
                {errors.batch && (
                  <p className="mt-1 text-sm text-red-600">{errors.batch}</p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full btn-lg"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" /> Registering...
                </>
              ) : (
                'Register'
              )}
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-medium text-primary-600 hover:text-primary-500"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
