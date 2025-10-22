import React, { useState } from "react";

interface CustomerFormData {
  recordNumber: string;
  clientName: string;
  eventType: string;
  startDate: string;
  endDate: string;
  expectedNumber: number;
  budget: number;
  decoration: boolean;
  food: boolean;
  drings: boolean;
  photo: boolean;
  parties: boolean;
}

const CustomerFormView: React.FC = () => {
  const [formData, setFormData] = useState<CustomerFormData>({
    recordNumber: "",
    clientName: "",
    eventType: "",
    startDate: "",
    endDate: "",
    expectedNumber: 0,
    budget: 0,
    decoration: false,
    food: false,
    drinks: false,
    photo: false,
    parties: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  }
  return (
<div className="max-w-md mx-auto flex flex-col items-center justify-center min-h-screen">
  <form onSubmit="{handleSubmit}" className="flex gap-4 flex-col">
    <div className="flex flex-col">
      <div>
        <label className="px-5 border" htmlFor="RecordNumber">RecordNumber: </label>
        <input className="px-3 py-2 border border-gray-400 rounded focus:outline-none focus:border-blue-500" id="RecordNumber" name="RecordNumber" />
        <label className="px-5 border" htmlFor="ClientName">ClientName: </label>
        <input className="px-3 py-2 border border-gray-400 rounded focus:outline-none focus:border-blue-500" id="ClientName" name="ClientName" required />
        <label className="px-5 border" htmlFor="type">EventType: </label>
        <input className="px-3 py-2 border border-gray-400 rounded focus:outline-none focus:border-blue-500" id="type" name="type" required />
      </div>
    </div>
  </form>
</div>
  );
};

export default CustomerFormView;
