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
  drinks: boolean;
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
    //if (error) setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };
  return (
    <div className="max-w-md mx-auto flex flex-col items-center justify-center min-h-screen">
      <div className="bg-gray-300 p-10 rounded-lg shadow-lg">
        <form onSubmit={handleSubmit} className="flex gap-4 flex-col">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <label className="w-32 " htmlFor="RecordNumber">
                Record Number:{" "}
              </label>
              <input
                className="px-3 border border-gray-400 rounded focus:outline-none focus:border-blue-500"
                id="RecordNumber"
                name="RecordNumber"
              />
            </div>
            <div className="flex items-center gap-4 mb-4">
              <label className="w-32 " htmlFor="ClientName">
                Client Name:{" "}
              </label>
              <input
                className="px-3  border border-gray-400 rounded focus:outline-none focus:border-blue-500"
                id="ClientName"
                name="ClientName"
                required
              />
            </div>
            <div className="flex items-center gap-4 mb-10">
              <label className="w-32" htmlFor="type">
                Event Type:{" "}
              </label>
              <input
                className="px-3 border border-gray-400 rounded focus:outline-none focus:border-blue-500"
                id="type"
                name="type"
                required
              />
            </div>
          </div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <label className="w-32" htmlFor="Start">
                From:{" "}
              </label>
              <input
                className="border rounded"
                type="date"
                id="Start"
                name="Start"
                required
              />
            </div>
            <div>
              <label className="w-32" htmlFor="End">
                To:{" "}
              </label>
              <input
                className="border rounded"
                type="date"
                id="End"
                name="End"
                required
              />
            </div>
          </div>
          <div className="flex items-center justify-between mb-5">
            <label htmlFor="Attendees">Expected number of attendees: </label>
            <input
              className="border max-w-16 rounded text-right"
              type="number"
              id="Attendees"
              name="Attendees"
              min="1"
              required
            />
          </div>
          <div className="border grid h-40 grid-cols-2 content-center gap-6 mb-5">
            <div className="pl-5">
              <input
                id="Decorations"
                name="Decorations"
                type="checkbox"
              ></input>
              <label className="pl-2" htmlFor="Decorations">
                Decorations
              </label>
            </div>
            <div className="pl-5">
              <input id="Food" name="Food" type="checkbox"></input>
              <label className="pl-2" htmlFor="Food">
                Breakfast, Lunch, Dinner
              </label>
            </div>
            <div className="pl-5">
              <input id="Parties" name="Parties" type="checkbox"></input>
              <label className="pl-2" htmlFor="Parties">
                Parties
              </label>
            </div>
            <div className="pl-5">
              <input id="Drinks" name="Drinks" type="checkbox"></input>
              <label className="pl-2" htmlFor="Drinks">
                Soft/Hot drinks
              </label>
            </div>
            <div className="pl-5">
              <input id="Photo" name="Photo" type="checkbox"></input>
              <label className="pl-2" htmlFor="Photo">
                Photos/Filming
              </label>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label htmlFor="Budget">Expected budget: </label>
            <input
              className="border max-w-40 rounded text-right"
              type="number"
              id="Budget"
              name="Budget"
              min="1"
              required
            />
          </div>
          <button
            className="mt-4 cursor-pointer py-2 bg-gray-500 text-white font-semibold rounded-xl shadow-md border border-blue-700 hover:bg-blue-700 transition duration-300 ease-in-out"
            type="submit"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default CustomerFormView;
