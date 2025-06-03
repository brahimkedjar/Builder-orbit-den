import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  FileText,
  GitBranch,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Plus,
  Search,
  Users,
  TrendingUp,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { DashboardStats } from "@/types";
import { getDashboardStats } from "@/lib/mockData";

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats().then((data) => {
      setStats(data);
      setLoading(false);
    });
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  const procedureTypeData = stats.proceduresByType.map((item) => ({
    name: item.type.charAt(0).toUpperCase() + item.type.slice(1),
    value: item.count,
  }));

  const permitStatusData = stats.permitsByStatus.map((item) => ({
    name: item.status.charAt(0).toUpperCase() + item.status.slice(1),
    value: item.count,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord</h1>
          <p className="text-gray-600 mt-1">
            Vue d'ensemble de la gestion des permis miniers
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link to="/new-permit">
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle demande
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/search">
              <Search className="mr-2 h-4 w-4" />
              Recherche
            </Link>
          </Button>
        </div>
      </div>

      {/* Alert Notifications */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Permis expirant
                </p>
                <p className="text-xs text-gray-600">
                  3 permis expirent dans 30 jours
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-4">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-yellow-500 mr-2" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Procédures bloquées
                </p>
                <p className="text-xs text-gray-600">
                  2 procédures nécessitent attention
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center">
              <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Nouveaux permis
                </p>
                <p className="text-xs text-gray-600">5 permis créés ce mois</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalPermits}
                </p>
                <p className="text-sm text-gray-600">Total Permis</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <GitBranch className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {stats.activeProcedures}
                </p>
                <p className="text-sm text-gray-600">Procédures Actives</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {stats.expiredPermits}
                </p>
                <p className="text-sm text-gray-600">Permis Expirés</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {stats.suspendedPermits}
                </p>
                <p className="text-sm text-gray-600">Permis Suspendus</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5" />
              Types de Procédures
            </CardTitle>
            <CardDescription>
              Répartition des procédures par type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={procedureTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {procedureTypeData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Permis par Région
            </CardTitle>
            <CardDescription>
              Distribution géographique des permis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.permitsByRegion}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="region" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle>État des Permis</CardTitle>
          <CardDescription>Répartition des permis par statut</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {stats.permitsByStatus.map((item) => (
              <div key={item.status} className="flex items-center gap-2">
                <Badge variant="outline" className="capitalize">
                  {item.status}
                </Badge>
                <span className="font-semibold">{item.count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions Rapides</CardTitle>
          <CardDescription>
            Accès rapide aux fonctionnalités principales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button asChild variant="outline" className="h-16 flex-col">
              <Link to="/permits">
                <FileText className="h-6 w-6 mb-2" />
                Gérer Permis
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-16 flex-col">
              <Link to="/procedures">
                <GitBranch className="h-6 w-6 mb-2" />
                Suivi Procédures
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-16 flex-col">
              <Link to="/committee-decisions">
                <Users className="h-6 w-6 mb-2" />
                Décisions Comité
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-16 flex-col">
              <Link to="/perimeters">
                <Search className="h-6 w-6 mb-2" />
                Vérifier Empietements
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
