import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import StatusBadge from "@/components/StatusBadge";
import {
  FileText,
  GitBranch,
  Clock,
  Plus,
  Building2,
  AlertTriangle,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { Permis, Procedure } from "@/types";
import { mockPermis, mockProcedures } from "@/lib/mockData";

const OperatorDashboard = () => {
  const { user } = useAuth();
  const [permits, setPermits] = useState<Permis[]>([]);
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.entiteMoraleId) {
      // Filter data for the operator's entity
      const userPermits = mockPermis.filter(
        (p) => p.entiteMoraleId === user.entiteMoraleId,
      );
      const userProcedures = mockProcedures.filter(
        (p) => p.entiteMoraleId === user.entiteMoraleId,
      );

      setPermits(userPermits);
      setProcedures(userProcedures);
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const activePermits = permits.filter((p) => p.statut === "valide");
  const expiringSoon = permits.filter((p) => {
    const diffTime = p.dateExpiration.getTime() - new Date().getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 90 && diffDays > 0;
  });
  const activeProcedures = procedures.filter((p) => p.statut === "en_cours");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Mon Tableau de Bord
          </h1>
          <p className="text-gray-600 mt-1">
            Gestion de vos permis et procédures miniers
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
            <Link to="/my-entity">
              <Building2 className="mr-2 h-4 w-4" />
              Mon entreprise
            </Link>
          </Button>
        </div>
      </div>

      {/* Alert Notifications */}
      {expiringSoon.length > 0 && (
        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-4">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
              <div>
                <p className="text-sm font-medium text-gray-900">Attention</p>
                <p className="text-xs text-gray-600">
                  {expiringSoon.length} permis expire(nt) dans les 90 prochains
                  jours
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {permits.length}
                </p>
                <p className="text-sm text-gray-600">Total Permis</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {activePermits.length}
                </p>
                <p className="text-sm text-gray-600">Permis Actifs</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <GitBranch className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {activeProcedures.length}
                </p>
                <p className="text-sm text-gray-600">Procédures en Cours</p>
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
                  {expiringSoon.length}
                </p>
                <p className="text-sm text-gray-600">Expirent Bientôt</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Permits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Mes Permis
            </span>
            <Button variant="outline" size="sm" asChild>
              <Link to="/my-permits">Voir tous</Link>
            </Button>
          </CardTitle>
          <CardDescription>Aperçu de vos permis miniers</CardDescription>
        </CardHeader>
        <CardContent>
          {permits.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Aucun permis
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Commencez par faire une demande de permis
              </p>
              <div className="mt-6">
                <Button asChild>
                  <Link to="/new-permit">
                    <Plus className="mr-2 h-4 w-4" />
                    Nouvelle demande
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {permits.slice(0, 3).map((permit) => (
                <div
                  key={permit.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h4 className="font-medium text-gray-900">
                        {permit.code}
                      </h4>
                      <StatusBadge status={permit.statut} type="permit" />
                    </div>
                    <div className="mt-1 text-sm text-gray-600">
                      Substances:{" "}
                      {permit.substances.map((s) => s.substance.nom).join(", ")}
                    </div>
                    <div className="mt-1 flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center">
                        <Calendar className="mr-1 h-3 w-3" />
                        Expire:{" "}
                        {permit.dateExpiration.toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/permits/${permit.id}`}>Détails</Link>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Procedures */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <GitBranch className="mr-2 h-5 w-5" />
              Mes Procédures
            </span>
            <Button variant="outline" size="sm" asChild>
              <Link to="/my-procedures">Voir toutes</Link>
            </Button>
          </CardTitle>
          <CardDescription>Suivi de vos procédures en cours</CardDescription>
        </CardHeader>
        <CardContent>
          {procedures.length === 0 ? (
            <div className="text-center py-8">
              <GitBranch className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Aucune procédure
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Aucune procédure en cours pour votre entreprise
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {procedures.slice(0, 3).map((procedure) => (
                <div
                  key={procedure.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h4 className="font-medium text-gray-900">
                        {procedure.code}
                      </h4>
                      <StatusBadge status={procedure.statut} type="procedure" />
                      <Badge variant="outline" className="capitalize">
                        {procedure.type.replace("_", " ")}
                      </Badge>
                    </div>
                    <div className="mt-1 text-sm text-gray-600">
                      {procedure.permis
                        ? `Permis: ${procedure.permis.code}`
                        : "Nouvelle demande"}
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      Créé: {procedure.dateCreation.toLocaleDateString("fr-FR")}
                    </div>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/procedures/${procedure.id}`}>Suivre</Link>
                  </Button>
                </div>
              ))}
            </div>
          )}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button asChild variant="outline" className="h-16 flex-col">
              <Link to="/new-permit">
                <Plus className="h-6 w-6 mb-2" />
                Nouvelle Demande
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-16 flex-col">
              <Link to="/my-permits">
                <FileText className="h-6 w-6 mb-2" />
                Mes Permis
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-16 flex-col">
              <Link to="/my-procedures">
                <GitBranch className="h-6 w-6 mb-2" />
                Mes Procédures
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OperatorDashboard;
