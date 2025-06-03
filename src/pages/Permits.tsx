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
import {
  Search,
  Filter,
  Plus,
  Eye,
  RotateCcw,
  ArrowRightLeft,
  Calendar,
  MapPin,
  FileText,
  Download,
} from "lucide-react";
import { Permis, SearchFilters } from "@/types";
import { mockPermis, mockEntitesMorales, mockSubstances } from "@/lib/mockData";

const Permits = () => {
  const [permits, setPermits] = useState<Permis[]>([]);
  const [filteredPermits, setFilteredPermits] = useState<Permis[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<SearchFilters>({
    statut: "all",
  });

  useEffect(() => {
    setPermits(mockPermis);
    setFilteredPermits(mockPermis);
    setLoading(false);
  }, []);

  useEffect(() => {
    let filtered = permits;

    if (filters.code) {
      filtered = filtered.filter((permit) =>
        permit.code.toLowerCase().includes(filters.code!.toLowerCase()),
      );
    }

    if (filters.entiteMorale) {
      filtered = filtered.filter((permit) =>
        permit.entiteMorale.raisonSociale
          .toLowerCase()
          .includes(filters.entiteMorale!.toLowerCase()),
      );
    }

    if (filters.statut && filters.statut !== "all") {
      filtered = filtered.filter((permit) => permit.statut === filters.statut);
    }

    if (filters.substance) {
      filtered = filtered.filter((permit) =>
        permit.substances.some((s) =>
          s.substance.nom
            .toLowerCase()
            .includes(filters.substance!.toLowerCase()),
        ),
      );
    }

    setFilteredPermits(filtered);
  }, [filters, permits]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const clearFilters = () => {
    setFilters({ statut: "all" });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Gestion des Permis
          </h1>
          <p className="text-gray-600 mt-1">
            {filteredPermits.length} permis sur {permits.length}
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link to="/new-permit">
              <Plus className="mr-2 h-4 w-4" />
              Nouveau permis
            </Link>
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            Filtres de recherche
          </CardTitle>
          <CardDescription>
            Utilisez les filtres pour affiner votre recherche
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Code permis</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="PM-2025-001"
                  value={filters.code || ""}
                  onChange={(e) =>
                    setFilters({ ...filters, code: e.target.value })
                  }
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Entité morale</label>
              <Input
                placeholder="Nom de l'entreprise"
                value={filters.entiteMorale || ""}
                onChange={(e) =>
                  setFilters({ ...filters, entiteMorale: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Statut</label>
              <Select
                value={filters.statut || ""}
                onValueChange={(value) =>
                  setFilters({ ...filters, statut: value as any })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="valide">Valide</SelectItem>
                  <SelectItem value="expire">Expiré</SelectItem>
                  <SelectItem value="suspendu">Suspendu</SelectItem>
                  <SelectItem value="annule">Annulé</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Substance</label>
              <Input
                placeholder="Or, Cuivre, etc."
                value={filters.substance || ""}
                onChange={(e) =>
                  setFilters({ ...filters, substance: e.target.value })
                }
              />
            </div>
          </div>

          {Object.keys(filters).some(
            (key) => filters[key as keyof SearchFilters],
          ) && (
            <div className="flex justify-end mt-4">
              <Button variant="outline" onClick={clearFilters} size="sm">
                Effacer les filtres
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Permits Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Permis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Détenteur</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Substances</TableHead>
                  <TableHead>Date d'expiration</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPermits.map((permit) => (
                  <TableRow key={permit.id}>
                    <TableCell className="font-medium">
                      <Link
                        to={`/permits/${permit.id}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {permit.code}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {permit.entiteMorale.raisonSociale}
                        </div>
                        <div className="text-sm text-gray-500">
                          {permit.entiteMorale.formeJuridique}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={permit.statut} type="permit" />
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {permit.substances.slice(0, 2).map((substance) => (
                          <Badge
                            key={substance.id}
                            variant="secondary"
                            className="text-xs"
                          >
                            {substance.substance.nom}
                          </Badge>
                        ))}
                        {permit.substances.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{permit.substances.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="mr-1 h-4 w-4 text-gray-400" />
                        {permit.dateExpiration.toLocaleDateString("fr-FR")}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/permits/${permit.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>

                        {permit.statut === "valide" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              title="Renouveler"
                            >
                              <RotateCcw className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              title="Transférer"
                            >
                              <ArrowRightLeft className="h-4 w-4" />
                            </Button>
                          </>
                        )}

                        <Button variant="outline" size="sm" title="Localiser">
                          <MapPin className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredPermits.length === 0 && (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Aucun permis trouvé
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Aucun permis ne correspond aux critères de recherche
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Permits;
