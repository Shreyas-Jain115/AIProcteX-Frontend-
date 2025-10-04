import { Route, Routes } from "react-router-dom";
import CompanyLayout from "../layouts/CompanyLayout";
import CompanyDashboard from "../pages/company/CompanyDashboard";
import QuestionBank from "../components/common/QuestionBank";
import TestManagement from "../components/common/TestManagement";
import CandidateManagement from "../components/company/CandidateManagement"; // Import the new component
import TestAttemptsTable from "../components/company/TestAttemptsTable";
import UserTestAttemptDetail from "../components/company/UserTestAttemptDetail"; // Import the user test attempt detail component
// Placeholder for pages that are not yet created
const Placeholder = ({ title }) => (
  <div className="text-white text-2xl">{title}</div>
);

const CompanyRoutes = () => {
  return (
    // The CompanyLayout component provides the consistent UI for all company pages.
    <Routes>
      <Route element={<CompanyLayout />}>
        <Route index element={<CompanyDashboard />} />
        <Route path="tests" element={<TestManagement />} />
        <Route path="questions" element={<QuestionBank />} />
        <Route
          path="/test-attempts/:testId"
          element={<TestAttemptsTable />}
        />
        <Route path="candidates" element={<CandidateManagement />} />
        <Route path="results" element={<Placeholder title="Results Page" />} />
        <Route
          path="settings"
          element={<Placeholder title="Company Settings Page" />}
        />
        <Route
          path="test-attempt-detail/:userId/:testId"
          element={<UserTestAttemptDetail />}
        />{" "}
        {/* Detailed view for a specific user's test attempt */}
      </Route>
    </Routes>
  );
};

export default CompanyRoutes;
