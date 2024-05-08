"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useProfile } from "@farcaster/auth-kit";

const PollCreator = () => {
  const [pollTitle, setPollTitle] = useState("");
  const [choices, setChoices] = useState([{ id: 1, value: "" }]);
  const [endDate, setEndDate] = useState(new Date());
  const [polls, setPolls] = useState([]);
  const {
    isAuthenticated,
    profile: { bio, displayName, fid, pfpUrl, username },
  } = useProfile();

  useEffect(() => {
    getPolls();
  }, []);

  const getPolls = async () => {
    await axios
      .get("https://frame-backend-z2b9.onrender.com/polls")
      .then((res) => {
        setPolls(res.data.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleAddChoice = () => {
    const newChoice = { id: choices.length + 1, value: "" };
    setChoices([...choices, newChoice]);
  };

  const handleRemoveChoice = (id) => {
    setChoices(choices.filter((choice) => choice.id !== id));
  };

  const handleChangeChoice = (id, value) => {
    const updatedChoices = choices.map((choice) =>
      choice.id === id ? { ...choice, value } : choice
    );
    setChoices(updatedChoices);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios
      .post("https://frame-backend-z2b9.onrender.com/polls/add", {
        title: pollTitle,
        choices: choices,
        endDate: endDate,
        fid: fid ? fid : localStorage.getItem("fid"),
      })
      .then((res) => {
        alert("Poll Created!");
        getPolls(); // Refresh the list of polls
      })
      .catch((err) => {
        alert("Something went wrong!");
        console.error(err);
      });
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white shadow-lg rounded-lg p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="pollTitle"
            className="block text-sm font-medium text-gray-700"
          >
            Title
          </label>
          <input
            type="text"
            id="pollTitle"
            value={pollTitle}
            onChange={(e) => setPollTitle(e.target.value)}
            className="mt-1  w-full rounded-md border-black-300   sm:text-sm p-2 input border bg-pgray-100 rounded-xl border-pgray-100"
            required
          />
        </div>
        <div>
          <label
            htmlFor="pollTitle"
            className="block text-sm font-medium text-gray-700"
          >
            Choices
          </label>
          {choices.map((choice) => (
            <div key={choice.id} className="flex items-center space-x-2">
              <input
                type="text"
                value={choice.value}
                onChange={(e) => handleChangeChoice(choice.id, e.target.value)}
                className="mt-1  w-full rounded-md border-black-300   sm:text-sm p-2 input border bg-pgray-100 rounded-xl border-pgray-100"
                placeholder={`Choice ${choice.id}`}
                required
              />
              <button
                type="button"
                onClick={() => handleRemoveChoice(choice.id)}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <div>
          <button
            type="button"
            onClick={handleAddChoice}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add Choice
          </button>
        </div>
        <div>
          <label
            htmlFor="pollTitle"
            className="block text-sm font-medium text-gray-700"
          >
            End Date
          </label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            className="mt-1  w-full rounded-md border-black-300   sm:text-sm p-2 input border bg-pgray-100 rounded-xl border-pgray-100"
            showTimeSelect
            dateFormat="Pp"
          />
        </div>
        <div>
          <button
            type="submit"
            className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Create Predictions
          </button>
        </div>
      </form>
      <div className="mt-10">
        <h1 className="text-3xl font-bold mb-6 text-center">Predictions</h1>
        <div className="max-w-3xl mx-auto bg-white shadow rounded-lg overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {polls.map((poll, index) => (
              <li key={poll._id} className="px-6 py-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-lg font-semibold text-gray-900">
                      {index + 1}. {poll.title}
                    </p>
                  </div>
                  
                  <a
                    href={`https://poll-frame-gamma.vercel.app/${poll._id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    View Poll
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PollCreator;
