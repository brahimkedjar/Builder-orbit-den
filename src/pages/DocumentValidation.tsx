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
import { Textarea } from "@/components/ui/textarea";
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
  FileText,
  Download,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  Building2,
  Eye,
  MessageSquare,
} from "lucide-react";
import { Document, Procedure } from "@/types";
import { mockProcedures } from "@/lib/mockData";

const DocumentValidation = () => {
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<
    (Document & { procedure: Procedure })[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    type: "all",
    procedure: "",
  });
  const [selectedDocument, setSelectedDocument] = useState<
    (Document & { procedure: Procedure }) | null
  >(null);
  const [validationComment, setValidationComment] = useState("");

  useEffect(() => {
    setProcedures(mockProcedures);

    // Flatten all documents from all procedures
    const allDocuments = mockProcedures.flatMap((procedure) =>
      procedure.documents.map((doc) => ({ ...doc, procedure })),
    );

    setFilteredDocuments(allDocuments);
    setLoading(false);
  }, []);

  useEffect(() => {
    let filtered = procedures.flatMap((procedure) =>
      procedure.documents.map((doc) => ({ ...doc, procedure })),
    );

    if (filters.search) {
      filtered = filtered.filter(
        (doc) =>
          doc.nom.toLowerCase().includes(filters.search.toLowerCase()) ||
          doc.procedure.code
            .toLowerCase()
            .includes(filters.search.toLowerCase()),
      );
    }

    if (filters.status && filters.status !== "all") {
      filtered = filtered.filter((doc) => doc.statut === filters.status);
    }

    if (filters.type && filters.type !== "all") {
      filtered = filtered.filter((doc) => doc.type === filters.type);
    }

    if (filters.procedure) {
      filtered = filtered.filter((doc) =>
        doc.procedure.entiteMorale.raisonSociale
          .toLowerCase()
          .includes(filters.procedure.toLowerCase()),
      );
    }

    setFilteredDocuments(filtered);
  }, [filters, procedures]);

  const validateDocument = (
    documentId: string,
    status: "valide" | "rejete",
    comment: string,
  ) => {
    // In a real app, this would be an API call
    console.log("Validating document:", documentId, status, comment);

    // Update local state
    setFilteredDocuments((prev) =>
      prev.map((doc) =>
        doc.id === documentId
          ? { ...doc, statut: status, commentaire: comment }
          : doc,
      ),
    );

    setSelectedDocument(null);
    setValidationComment("");
  };

  const getDocumentTypeDisplayName = (type: string) => {
    switch (type) {
      case "registre_commerce":
        return "Registre de commerce";
      case "statuts":
        return "Statuts";
      case "note_technique":
        return "Note technique";
      case "carte_cadastrale":
        return "Carte cadastrale";
      case "rapport_police":
        return "Rapport de police";
      case "annexe_II-11":
        return "Annexe II-11";
      case "carte":
        return "Carte";
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

  const pendingCount = filteredDocuments.filter(
    (doc) => doc.statut === "en_attente",
  ).length;
  const validatedCount = filteredDocuments.filter(
    (doc) => doc.statut === "valide",
  ).length;
  const rejectedCount = filteredDocuments.filter(
    (doc) => doc.statut === "rejete",
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Validation des Documents
          </h1>
          <p className="text-gray-600 mt-1">
            {filteredDocuments.length} documents à traiter
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {pendingCount}
                </p>
                <p className="text-sm text-gray-600">En attente</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {validatedCount}
                </p>
                <p className="text-sm text-gray-600">Validés</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <XCircle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {rejectedCount}
                </p>
                <p className="text-sm text-gray-600">Rejetés</p>
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
              <label className="text-sm font-medium">Recherche</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Nom du document ou procédure"
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value })
                  }
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Statut</label>
              <Select
                value={filters.status}
                onValueChange={(value) =>
                  setFilters({ ...filters, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="en_attente">En attente</SelectItem>
                  <SelectItem value="valide">Validé</SelectItem>
                  <SelectItem value="rejete">Rejeté</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Type de document</label>
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
                  <SelectItem value="registre_commerce">
                    Registre de commerce
                  </SelectItem>
                  <SelectItem value="statuts">Statuts</SelectItem>
                  <SelectItem value="note_technique">Note technique</SelectItem>
                  <SelectItem value="carte_cadastrale">
                    Carte cadastrale
                  </SelectItem>
                  <SelectItem value="rapport_police">
                    Rapport de police
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Entreprise</label>
              <Input
                placeholder="Nom de l'entreprise"
                value={filters.procedure}
                onChange={(e) =>
                  setFilters({ ...filters, procedure: e.target.value })
                }
              />
            </div>
          </div>

          {Object.values(filters).some((filter) => filter) && (
            <div className="flex justify-end mt-4">
              <Button
                variant="outline"
                onClick={() =>
                  setFilters({
                    search: "",
                    status: "all",
                    type: "all",
                    procedure: "",
                  })
                }
                size="sm"
              >
                Effacer les filtres
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Documents Table */}
      <Card>
        <CardHeader>
          <CardTitle>Documents à valider</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Procédure</TableHead>
                  <TableHead>Entreprise</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date upload</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.map((document) => (
                  <TableRow key={document.id}>
                    <TableCell className="font-medium">
                      {document.nom}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getDocumentTypeDisplayName(document.type)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Link
                        to={`/procedures/${document.procedure.id}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {document.procedure.code}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {document.procedure.entiteMorale.raisonSociale}
                        </div>
                        <div className="text-sm text-gray-500">
                          {document.procedure.entiteMorale.formeJuridique}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={document.statut} type="document" />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="mr-1 h-4 w-4 text-gray-400" />
                        {document.dateUpload.toLocaleDateString("fr-FR")}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" title="Télécharger">
                          <Download className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          title="Voir détails"
                          onClick={() => setSelectedDocument(document)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>

                        {document.statut === "en_attente" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-green-600 hover:text-green-700"
                              onClick={() =>
                                validateDocument(
                                  document.id,
                                  "valide",
                                  "Document validé",
                                )
                              }
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => setSelectedDocument(document)}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredDocuments.length === 0 && (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Aucun document trouvé
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Aucun document ne correspond aux critères de recherche
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Validation Modal */}
      {selectedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Validation du document
              </CardTitle>
              <CardDescription>
                {selectedDocument.nom} -{" "}
                {getDocumentTypeDisplayName(selectedDocument.type)}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Procédure
                  </label>
                  <p className="text-sm">{selectedDocument.procedure.code}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Entreprise
                  </label>
                  <p className="text-sm">
                    {selectedDocument.procedure.entiteMorale.raisonSociale}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Date d'upload
                  </label>
                  <p className="text-sm flex items-center">
                    <Calendar className="mr-1 h-4 w-4 text-gray-400" />
                    {selectedDocument.dateUpload.toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Statut actuel
                  </label>
                  <div className="mt-1">
                    <StatusBadge
                      status={selectedDocument.statut}
                      type="document"
                    />
                  </div>
                </div>
              </div>

              {selectedDocument.commentaire && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Commentaire existant
                  </label>
                  <p className="text-sm text-gray-700 mt-1 p-3 bg-gray-50 rounded">
                    {selectedDocument.commentaire}
                  </p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Commentaire de validation
                </label>
                <Textarea
                  value={validationComment}
                  onChange={(e) => setValidationComment(e.target.value)}
                  placeholder="Ajoutez un commentaire pour expliquer votre décision..."
                  rows={4}
                  className="mt-1"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedDocument(null);
                    setValidationComment("");
                  }}
                >
                  Annuler
                </Button>

                <Button
                  variant="outline"
                  className="text-red-600 hover:text-red-700"
                  onClick={() =>
                    validateDocument(
                      selectedDocument.id,
                      "rejete",
                      validationComment,
                    )
                  }
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Rejeter
                </Button>

                <Button
                  className="text-green-600 hover:text-green-700"
                  onClick={() =>
                    validateDocument(
                      selectedDocument.id,
                      "valide",
                      validationComment,
                    )
                  }
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Valider
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DocumentValidation;
