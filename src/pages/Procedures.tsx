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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import StatusBadge from "@/components/StatusBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import {
  Search,
  Filter,
  Plus,
  Eye,
  Calendar,
  Building2,
  FileText,
  GitBranch,
  Clock,
} from "lucide-react";
import { Procedure, ProcedureType, ProcedureStatus } from "@/types";
import { mockProcedures } from "@/lib/mockData";

const Procedures = () => {
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [filteredProcedures, setFilteredProcedures] = useState<Procedure[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    code: "",
    type: "all",
    statut: "all",
    entite: "",
  });

  useEffect(() => {
    setProcedures(mockProcedures);
    setFilteredProcedures(mockProcedures);
    setLoading(false);
  }, []);

  useEffect(() => {
    let filtered = procedures;

    if (filters.code) {
      filtered = filtered.filter((proc) =>
        proc.code.toLowerCase().includes(filters.code.toLowerCase()),
      );
    }

    if (filters.type && filters.type !== "all") {
      filtered = filtered.filter((proc) => proc.type === filters.type);
    }

    if (filters.statut && filters.statut !== "all") {
      filtered = filtered.filter((proc) => proc.statut === filters.statut);
    }

    if (filters.entite) {
      filtered = filtered.filter((proc) =>
        proc.entiteMorale.raisonSociale
          .toLowerCase()
          .includes(filters.entite.toLowerCase()),
      );
    }

    setFilteredProcedures(filtered);
  }, [filters, procedures]);

  const getProgressPercentage = (procedure: Procedure) => {
    const totalSteps = 5; // Standard number of steps
    const completedSteps = procedure.etapes.filter(
      (e) => e.statut === "terminee",
    ).length;
    return (completedSteps / totalSteps) * 100;
  };

  const getCurrentStep = (procedure: Procedure) => {
    const inProgressStep = procedure.etapes.find(
      (e) => e.statut === "en_attente",
    );
    if (inProgressStep) {
      return getStepDisplayName(inProgressStep.type);
    }
    if (procedure.statut === "terminee") {
      return "Terminée";
    }
    return "En attente";
  };

  const getStepDisplayName = (stepType: string) => {
    switch (stepType) {
      case "verification_dossier":
        return "Vérification dossier";
      case "empietement_check":
        return "Vérification empietement";
      case "rapport_police":
        return "Rapport police";
      case "avis_wali":
        return "Avis Wali";
      case "soumission_comite":
        return "Soumission comité";
      default:
        return stepType;
    }
  };

  const getProcedureTypeDisplayName = (type: ProcedureType) => {
    switch (type) {
      case "demande":
        return "Demande";
      case "transfert":
        return "Transfert";
      case "cession":
        return "Cession";
      case "renouvellement":
        return "Renouvellement";
      case "substitution":
        return "Substitution";
      case "fusion":
        return "Fusion";
      case "extension_perimetre":
        return "Extension périmètre";
      case "extension_substance":
        return "Extension substance";
      default:
        return type;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const clearFilters = () => {
    setFilters({ code: "", type: "all", statut: "all", entite: "" });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Centre de Suivi des Procédures
          </h1>
          <p className="text-gray-600 mt-1">
            {filteredProcedures.length} procédures sur {procedures.length}
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link to="/new-permit">
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle procédure
            </Link>
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <GitBranch className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {procedures.filter((p) => p.statut === "en_cours").length}
                </p>
                <p className="text-sm text-gray-600">En cours</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {procedures.filter((p) => p.statut === "suspendue").length}
                </p>
                <p className="text-sm text-gray-600">Suspendues</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {procedures.filter((p) => p.statut === "terminee").length}
                </p>
                <p className="text-sm text-gray-600">Terminées</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {procedures.filter((p) => p.statut === "rejetee").length}
                </p>
                <p className="text-sm text-gray-600">Rejetées</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            Filtres de recherche
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Code procédure</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="PR-2025-001"
                  value={filters.code}
                  onChange={(e) =>
                    setFilters({ ...filters, code: e.target.value })
                  }
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <Select
                value={filters.type}
                onValueChange={(value) =>
                  setFilters({ ...filters, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tous les types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="demande">Demande</SelectItem>
                  <SelectItem value="transfert">Transfert</SelectItem>
                  <SelectItem value="cession">Cession</SelectItem>
                  <SelectItem value="renouvellement">Renouvellement</SelectItem>
                  <SelectItem value="substitution">Substitution</SelectItem>
                  <SelectItem value="fusion">Fusion</SelectItem>
                  <SelectItem value="extension_perimetre">
                    Extension périmètre
                  </SelectItem>
                  <SelectItem value="extension_substance">
                    Extension substance
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Statut</label>
              <Select
                value={filters.statut}
                onValueChange={(value) =>
                  setFilters({ ...filters, statut: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="en_cours">En cours</SelectItem>
                  <SelectItem value="terminee">Terminée</SelectItem>
                  <SelectItem value="rejetee">Rejetée</SelectItem>
                  <SelectItem value="suspendue">Suspendue</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Entité</label>
              <Input
                placeholder="Nom de l'entreprise"
                value={filters.entite}
                onChange={(e) =>
                  setFilters({ ...filters, entite: e.target.value })
                }
              />
            </div>
          </div>

          {Object.values(filters).some((filter) => filter) && (
            <div className="flex justify-end mt-4">
              <Button variant="outline" onClick={clearFilters} size="sm">
                Effacer les filtres
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Procedures Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Procédures</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Entité</TableHead>
                  <TableHead>Permis lié</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Étape actuelle</TableHead>
                  <TableHead>Progression</TableHead>
                  <TableHead>Date création</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProcedures.map((procedure) => (
                  <TableRow key={procedure.id}>
                    <TableCell className="font-medium">
                      <Link
                        to={`/procedures/${procedure.id}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {procedure.code}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {getProcedureTypeDisplayName(procedure.type)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {procedure.entiteMorale.raisonSociale}
                        </div>
                        <div className="text-sm text-gray-500">
                          {procedure.entiteMorale.formeJuridique}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {procedure.permis ? (
                        <Link
                          to={`/permits/${procedure.permis.id}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {procedure.permis.code}
                        </Link>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={procedure.statut} type="procedure" />
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {getCurrentStep(procedure)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="w-24">
                        <Progress
                          value={getProgressPercentage(procedure)}
                          className="h-2"
                        />
                        <span className="text-xs text-gray-500 mt-1">
                          {Math.round(getProgressPercentage(procedure))}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="mr-1 h-4 w-4 text-gray-400" />
                        {procedure.dateCreation.toLocaleDateString("fr-FR")}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/procedures/${procedure.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredProcedures.length === 0 && (
            <div className="text-center py-8">
              <GitBranch className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Aucune procédure trouvée
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Aucune procédure ne correspond aux critères de recherche
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Procedures;
