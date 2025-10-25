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

  //Label string, input/label id
  type idStringTuple = [string, string];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    //if (error) setError(null);
  };

  const checkboxes: idStringTuple[] = [
    ["Decorations", "Decorations"],
    ["Breakfast, Lunch, Dinner", "Food"],
    ["Parties", "Parties"],
    ["Soft/Hot drinks", "Drinks"],
    ["Photos/Filming", "Photos"],
  ];

  const createCheckBoxFieldsCB = (arr: idStringTuple) => {
    return (
      <div className="pl-5">
        <input id={arr[1]} name={arr[1]} type="checkbox"></input>
        <label className="pl-2" htmlFor={arr[1]}>
          {arr[0]}
        </label>
      </div>
    );
  };

  const inputFields: idStringTuple[] = [
    ["Record Number", "RecordNumber"],
    ["Client Name", "ClientName"],
    ["Event Type", "EventType"],
  ];

  const createInputFieldCB = (arr: idStringTuple) => {
    return (
      <div className="flex items-center gap-4 mb-10">
        <label className="w-32" htmlFor={arr[1]}>
          {arr[0]}
        </label>
        <input
          className="px-3 border border-gray-400 rounded focus:outline-none focus:border-blue-500"
          id={arr[1]}
          name={arr[1]}
          required
        />
      </div>
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };
  return (
    <div className="max-w-md mx-auto flex flex-col items-center justify-center min-h-screen">
      <div className="bg-gray-300 p-10 rounded-lg shadow-lg">
        <form onSubmit={handleSubmit} className="flex gap-4 flex-col">
          <div>{inputFields.map(createInputFieldCB)}</div>
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
            {checkboxes.map(createCheckBoxFieldsCB)}
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
