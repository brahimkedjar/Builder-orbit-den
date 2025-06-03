import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import OperatorDashboard from "./pages/OperatorDashboard";
import Permits from "./pages/Permits";
import PermitDetail from "./pages/PermitDetail";
import Procedures from "./pages/Procedures";
import ProcedureDetail from "./pages/ProcedureDetail";
import NewPermitWizard from "./pages/NewPermitWizard";
import DocumentValidation from "./pages/DocumentValidation";
import CommitteeDecisions from "./pages/CommitteeDecisions";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />

            {/* Protected routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute
                  requiredRole={[
                    "administrator",
                    "cadastre_agent",
                    "committee_member",
                  ]}
                >
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/operator-dashboard"
              element={
                <ProtectedRoute requiredRole={["operator"]}>
                  <Layout>
                    <OperatorDashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/permits"
              element={
                <ProtectedRoute
                  requiredRole={["administrator", "cadastre_agent"]}
                >
                  <Layout>
                    <Permits />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/my-permits"
              element={
                <ProtectedRoute requiredRole={["operator"]}>
                  <Layout>
                    <Permits />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/permits/:id"
              element={
                <ProtectedRoute>
                  <Layout>
                    <PermitDetail />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/procedures"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Procedures />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/my-procedures"
              element={
                <ProtectedRoute requiredRole={["operator"]}>
                  <Layout>
                    <Procedures />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/procedures/:id"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ProcedureDetail />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/new-permit"
              element={
                <ProtectedRoute requiredRole={["administrator", "operator"]}>
                  <Layout>
                    <NewPermitWizard />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/document-validation"
              element={
                <ProtectedRoute
                  requiredRole={["administrator", "cadastre_agent"]}
                >
                  <Layout>
                    <DocumentValidation />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/committee-decisions"
              element={
                <ProtectedRoute
                  requiredRole={["administrator", "committee_member"]}
                >
                  <Layout>
                    <CommitteeDecisions />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Placeholder routes for future implementation */}
            <Route
              path="/workflows"
              element={
                <ProtectedRoute
                  requiredRole={["administrator", "cadastre_agent"]}
                >
                  <Layout>
                    <div className="p-6">
                      <h1 className="text-2xl font-bold">
                        Fusion & Substitution
                      </h1>
                      <p className="text-gray-600">
                        Page en cours de développement
                      </p>
                    </div>
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/perimeters"
              element={
                <ProtectedRoute
                  requiredRole={["administrator", "cadastre_agent"]}
                >
                  <Layout>
                    <div className="p-6">
                      <h1 className="text-2xl font-bold">
                        Gestion des Périmètres
                      </h1>
                      <p className="text-gray-600">
                        Page en cours de développement
                      </p>
                    </div>
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/entities"
              element={
                <ProtectedRoute requiredRole={["administrator"]}>
                  <Layout>
                    <div className="p-6">
                      <h1 className="text-2xl font-bold">Entités Morales</h1>
                      <p className="text-gray-600">
                        Page en cours de développement
                      </p>
                    </div>
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/my-entity"
              element={
                <ProtectedRoute requiredRole={["operator"]}>
                  <Layout>
                    <div className="p-6">
                      <h1 className="text-2xl font-bold">Mon Entreprise</h1>
                      <p className="text-gray-600">
                        Page en cours de développement
                      </p>
                    </div>
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/search"
              element={
                <ProtectedRoute>
                  <Layout>
                    <div className="p-6">
                      <h1 className="text-2xl font-bold">Recherche Avancée</h1>
                      <p className="text-gray-600">
                        Page en cours de développement
                      </p>
                    </div>
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/settings"
              element={
                <ProtectedRoute requiredRole={["administrator"]}>
                  <Layout>
                    <div className="p-6">
                      <h1 className="text-2xl font-bold">Paramètres</h1>
                      <p className="text-gray-600">
                        Page en cours de développement
                      </p>
                    </div>
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/unauthorized"
              element={
                <div className="flex items-center justify-center min-h-screen">
                  <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600">
                      Accès non autorisé
                    </h1>
                    <p className="text-gray-600 mt-2">
                      Vous n'avez pas les permissions nécessaires pour accéder à
                      cette page.
                    </p>
                  </div>
                </div>
              }
            />

            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
