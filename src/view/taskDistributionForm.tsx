import React, { useState } from "react";

interface TaskDistributionFormData {
  reference: string;
  description: string;
  priority: string;
  assignee: string;
}

const TaskDistributionView: React.FC = () => {
  const [formData, setFormData] = useState<CustomerFormData>({
    reference: "",
    description: "",
    priority: "",
    assignee: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    //if (error) setError(null);
  };

  const empls: string[] = ["usr1", "usr2"];

  const employeeListCB = (val: string) => {
    return <option value={val}>{val}</option>;
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="max-w-md mx-auto flex flex-col items-center justify-center min-h-screen">
      <div className="bg-gray-300 p-10 rounded-lg shadow-lg">
        <form onSubmit={handleSubmit} className="flex gap-4 flex-col">
          <div className="flex items-center gap-4 mb-10">
            <label className="w-32" htmlFor="Reference">
              Project Reference:
            </label>
            <input
              className=" w-20 px-3 border border-gray-400 rounded focus:outline-none focus:border-blue-500"
              id="Reference"
              name="Reference"
              required
            />
          </div>
          <div className="flex items-center gap-4 mb-10">
            <label className="w-32" htmlFor="Description">
              Description:
            </label>
            <input
              className="w-80 h-40 px-3 border border-gray-400 rounded focus:outline-none focus:border-blue-500"
              id="Reference"
              name="Reference"
              required
            />
          </div>
          <div className="flex items-center gap-4 mb-10">
            <label className="w-32" htmlFor="Description">
              Assign to:
            </label>
            <select
              className="w-36 px-3 border border-gray-400 rounded focus:outline-none focus:border-blue-500"
              id="Reference"
              name="Reference"
              required
            >
              {empls.map(employeeListCB)}
            </select>
          </div>
          <div className="flex items-center gap-4">
            <label className="w-32" htmlFor="Description">
              Assign to:
            </label>
            <select
              className="w-36 px-3 border border-gray-400 rounded focus:outline-none focus:border-blue-500"
              id="Priority"
              name="Priority"
              required
            >
              <option value="High">High</option>;
              <option value="Medium">Medium</option>;
              <option value="Low">Low</option>;
            </select>
          </div>
          <div className="flex justify-end">
            <button
              className="w-20 mt-4 bottom-0 cursor-pointer py-2 bg-gray-500 text-white font-semibold rounded-xl shadow-md border border-blue-700 hover:bg-blue-700 transition duration-300 ease-in-out"
              type="submit"
            >
              Send Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskDistributionView;
