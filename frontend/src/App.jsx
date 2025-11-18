import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import StudentDasboard from "./pages/StudentDasboard";
import PrivateRoutes from "./utils/PrivateRoutes";
import RoleBaseRoute from "./utils/RoleBaseRoute";
import AdminSummary from "./components/dashboard/AdminSummary";
import ClassList from "./components/class/ClassList";
import AddClass from "./components/class/AddClass";
import EditClass from "./components/class/EditClass";
import StudentList from "./components/student/StudentList";
import AddStudent from "./components/student/AddStudent";
import ViewStudent from "./components/student/ViewStudent";
import EditStudent from "./components/student/EditStudent";
import AddFee from "./components/fee/AddFee";
import ViewFee from "./components/fee/ViewFee";
import ViewAllFees from "./components/fee/ViewAllFees";
import SummaryStu from "./components/StudentDashboard.jsx/SummaryStu";
import PaymentList from "./components/payment/PaymentList";
import AddPayment from "./components/payment/AddPayment";
import SettingStu from "./components/StudentDashboard.jsx/SettingStu";
import PaymentListAdmin from "./components/payment/PaymentListAdmin";
import ReceiptPage from "./components/Recipt/Recipt";
import PaymentStatementPage from "./components/statement/Statement";
import StatementStudent from "./components/statement/StatementStudent";
import StatementDownload from "./components/statement/StatementDownload";
import StudentIDCard from "./components/IdCard/StudentId";
import IdDownload from "./components/IdCard/IdDownload";
import StudentIDDownload from "./components/IdCard/IdIndividial";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin-dashboard" />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoutes>
              <RoleBaseRoute requiredRole={["admin"]}>
                <AdminDashboard />
              </RoleBaseRoute>
            </PrivateRoutes>
          }
        >
          <Route index element={<AdminSummary />}></Route>
          <Route path="/admin-dashboard/class" element={<ClassList />}></Route>
          <Route
            path="/admin-dashboard/add-class"
            element={<AddClass />}
          ></Route>
          <Route
            path="/admin-dashboard/class/:id"
            element={<EditClass />}
          ></Route>

          <Route
            path="/admin-dashboard/student"
            element={<StudentList />}
          ></Route>
          <Route
            path="/admin-dashboard/add-student"
            element={<AddStudent />}
          ></Route>
          <Route
            path="/admin-dashboard/student/:id"
            element={<ViewStudent />}
          ></Route>
         
          <Route
            path="/admin-dashboard/student/fee/:id"
            element={<ViewFee />}
          ></Route>

          <Route path="/admin-dashboard/fee/all" element={<ViewAllFees />} />

          <Route path="/admin-dashboard/fee/add" element={<AddFee />}></Route>
          <Route path="/admin-dashboard/payment" element={<PaymentListAdmin />} />
          <Route
  path="/admin-dashboard/payment/statement"
  element={<PaymentStatementPage />}
/>
<Route
  path="/admin-dashboard/Id/:id"
  element={<StudentIDDownload />}
/>

        </Route>
          <Route path="/payment/recipt/:id" element={<ReceiptPage />} />
          <Route path="/statement/:feeId" element={<StatementDownload />} />
                                           <Route path="/ID/:id" element={<IdDownload />} />


        <Route
          path="/student-dashboard"
          element={
            <PrivateRoutes>
              <RoleBaseRoute requiredRole={["admin" ,"student"]}>
                <StudentDasboard />
              </RoleBaseRoute>
            </PrivateRoutes>
          }
        >
          <Route index element={<SummaryStu />}></Route>
          <Route path="/student-dashboard/profile/:id" element={<ViewStudent />} />
           <Route
            path="/student-dashboard/edit/:id"
            element={<EditStudent />}
          ></Route>
          <Route path="/student-dashboard/payment" element={<PaymentList />} />
                    <Route path="/student-dashboard/add-payment" element={<AddPayment/>} />
                              <Route path="/student-dashboard/studentId/:id" element={<StudentIDCard />} />

                    <Route path="/student-dashboard/fee/:id" element={<ViewFee/>} />
                    <Route
  path="/student-dashboard/payment/statement"
  element={<StatementStudent />}
/>
                                        <Route path="/student-dashboard/setting" element={<SettingStu/>} />




        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
