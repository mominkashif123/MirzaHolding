import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home.jsx';
import AboutSection from './components/About.jsx';
import PrivateServices from './components/Private.jsx';
import CorpServices from './components/Corporate.jsx';
import ContactUs from './components/ContactUs.jsx';
import LoginPage from './components/Login.jsx';
import SignupPage from './components/Signup.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Dashboard from './components/Dashboard.jsx';
import AdminLogin from './components/Adminlogin.jsx';
import AdminDashboard from './components/Admindashboard.jsx';
import FinancialOverview from './components/Finance.jsx';
import RetailServices from './components/Retail.jsx';
import NotFound from './components/NotFound.jsx';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<AboutSection />} />
                <Route path="/private" element={<PrivateServices />} />
                <Route path="/corporate" element={<CorpServices />} />
                <Route path="/retail" element={<RetailServices />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/finance" element={<FinancialOverview />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                } />
                <Route path="/admin" element={<AdminLogin />} />
                <Route path="/admindashboard" element={
                    <ProtectedRoute>
                        <AdminDashboard />
                    </ProtectedRoute>
                } />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
};

export default App;
