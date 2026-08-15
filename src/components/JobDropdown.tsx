"use client";

import React from "react";

const JobDropdown = () => {
  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const url = e.target.value;
    if (url) {
      window.open(url, "_blank");
    }
  };

  return (
    <div className="relative inline-block text-left mt-4 w-full max-w-xs">
      <label className="block mb-1 text-sm font-medium text-white">
        Find and Apply for a Job
      </label>
      <div className="relative">
        <select
          className="appearance-none w-full bg-[#0f0f0f] border border-gray-700 text-white text-sm rounded-xl focus:ring-purple-500 focus:border-purple-500 block px-4 py-2.5 shadow-sm"
          onChange={handleSelect}
        >
          <option value="">Select a job site</option>
          <option value="https://internshala.com/">Internshala</option>
          <option value="https://www.indeed.com/">Indeed</option>
          <option value="https://www.naukri.com/">Naukri.com</option>
          <option value="https://www.linkedin.com/jobs/">LinkedIn</option>
          <option value="https://www.upwork.com/">Upwork</option>
        </select>

        {/* Dropdown icon */}
        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default JobDropdown;
