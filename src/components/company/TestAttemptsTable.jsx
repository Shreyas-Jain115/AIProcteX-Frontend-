import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUsersScoreByTestId } from "../../api/test";

const TestAttemptsTable = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        const data = await getUsersScoreByTestId(testId);
        setAttempts(data);
      } catch (err) {
        setError("Failed to fetch attempts");
      } finally {
        setLoading(false);
      }
    };

    fetchAttempts();
  }, [testId]);

  if (loading)
    return (
      <p className="text-gray-400 text-center mt-10 text-lg">Loading...</p>
    );
  if (error)
    return (
      <p className="text-red-500 text-center mt-10 text-lg">{error}</p>
    );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-white">
        Test Attempts
      </h2>

      {attempts.length === 0 ? (
        <p className="text-gray-400 text-center">No attempts found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-slate-800 text-white rounded-lg shadow-md overflow-hidden">
            <thead className="bg-slate-700 text-gray-200 uppercase text-sm">
              <tr>
                <th className="px-6 py-3 text-left">ID</th>
                <th className="px-6 py-3 text-left">User Id</th>
                <th className="px-6 py-3 text-left">Test ID</th>
                <th className="px-6 py-3 text-left">Total Score</th>
                <th className="px-6 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {attempts.map((attempt, index) => (
                <tr
                  key={attempt.id}
                  className={`border-b border-slate-700 ${
                    index % 2 === 0 ? "bg-slate-800/50" : "bg-slate-800/30"
                  } hover:bg-slate-700 transition-colors`}
                >
                  <td className="px-6 py-4">{attempt.id}</td>
                  <td className="px-6 py-4">{attempt.userId}</td>
                  <td className="px-6 py-4">{attempt.testId}</td>
                  <td className="px-6 py-4">{attempt.score}</td>
                  <td className="px-6 py-4">
                    <button
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
                      onClick={() =>
                        navigate(`/company/test-attempt-detail/${attempt.userId}/${attempt.testId}`)
                      }
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TestAttemptsTable;
