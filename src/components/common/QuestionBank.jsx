import { useLocation } from 'react-router-dom';
import React, { useState, useMemo, useEffect } from 'react';
import { FaPlus, FaSearch } from 'react-icons/fa';
import AddQuestion from '../company/AddQuestion';
import { getQuestions } from '../../api/question';
import { useNavigate } from 'react-router-dom'; // ✅ added
// ...
  // ✅ Add this back near the top
const getDifficultyConfig = (difficulty) => {
  switch (difficulty) {
    case 'easy': return 'bg-green-500/10 text-green-400';
    case 'medium': return 'bg-yellow-500/10 text-yellow-400';
    case 'hard': return 'bg-red-500/10 text-red-400';
    default: return 'bg-slate-500/10 text-slate-400';
  }
};

const QuestionBank = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate(); // ✅ added

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await getQuestions();

        const normalized = data.map(q => ({
          ...q,
          problem_id: q.problemId, // normalize
        }));

        setQuestions(normalized);
      } catch (err) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);
    const location = useLocation();
  const filteredQuestions = useMemo(() => {
    return questions
      .filter(q => q.title.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter(q => difficultyFilter === 'all' || q.difficulty === difficultyFilter);
  }, [questions, searchTerm, difficultyFilter]);

  return (
    <>
      <div>
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Question Bank</h1>
            <p className="text-slate-400">Manage your company's assessment questions.</p>
          </div>
         {location.pathname==='/company/questions' && <button
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-5 rounded-lg transition-all duration-300 flex items-center shadow-lg mt-4 md:mt-0"
          >
            <FaPlus className="mr-2 text-xs" />
            <span>Add New Question</span>
          </button>}
        </header>

        {/* Filters and Search */}
        <div className="mb-6 flex flex-col md:flex-row items-center gap-4">
          <div className="relative w-full md:max-w-xs">
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2 px-4 pl-10 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          </div>
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="w-full md:w-auto py-2 px-4 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {/* Questions List */}
        <div className="bg-slate-800/50 rounded-xl shadow-lg border border-slate-700">
          <div className="divide-y divide-slate-700/50">
            {filteredQuestions.map(question => (
              <div key={question.problem_id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center hover:bg-slate-800 transition-colors duration-200">
                <div>
                  <h3 className="font-semibold text-white">{question.title}</h3>
                  <p className="text-sm text-slate-400">
                    Created on: {new Date(question.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-4 mt-3 sm:mt-0">
                  <span className={`text-xs font-medium px-3 py-1 rounded-full capitalize ${getDifficultyConfig(question.difficulty)}`}>
                    {question.difficulty}
                  </span>
                  <button
                    onClick={() => navigate(`/student/practise/${question.problem_id}`)} // ✅ redirect
                    className="text-sm text-indigo-400 hover:text-indigo-300 font-semibold"
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
          {filteredQuestions.length === 0 && (
            <div className="p-8 text-center text-slate-400">
              No questions found.
            </div>
          )}
        </div>
      </div>

      {/* Add Question Modal */}
      {isModalOpen && <AddQuestion onClose={() => setIsModalOpen(false)} />}
    </>
  );
};

export default QuestionBank;
