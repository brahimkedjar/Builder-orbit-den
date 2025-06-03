import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, Pickaxe } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { user, login, isLoading } = useAuth();
  const navigate = useNavigate();

  if (user) {
    const dashboardPath =
      user.role === "operator" ? "/operator-dashboard" : "/dashboard";
    return <Navigate to={dashboardPath} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    const success = await login(email, password);
    if (success) {
      const dashboardPath = email.includes("contact@")
        ? "/operator-dashboard"
        : "/dashboard";
      navigate(dashboardPath);
    } else {
      setError("Email ou mot de passe incorrect");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <Pickaxe className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Système de Gestion
          </h1>
          <p className="text-gray-600 mt-2">
            Permis Miniers - République Algérienne
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Connexion</CardTitle>
            <CardDescription>
              Connectez-vous à votre compte pour accéder au système
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </CardContent>

            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Connexion..." : "Se connecter"}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <div className="mt-8 text-center">
          <div className="text-sm text-gray-600 mb-4">
            Comptes de démonstration:
          </div>
          <div className="grid grid-cols-1 gap-2 text-xs text-gray-500">
            <div>
              <strong>Admin:</strong> admin@mines.dz
            </div>
            <div>
              <strong>Agent:</strong> agent@cadastre.dz
            </div>
            <div>
              <strong>Comité:</strong> comite@mines.dz
            </div>
            <div>
              <strong>Opérateur:</strong> contact@minexalgeria.com
            </div>
            <div className="mt-2">
              <strong>Mot de passe:</strong> password
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
