import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import StatusBadge from "@/components/StatusBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Calendar,
  Building2,
  FileText,
  Download,
  Upload,
  CheckCircle2,
  Clock,
  XCircle,
  User,
  MessageSquare,
  GitBranch,
} from "lucide-react";
import { Procedure, EtapeStatus } from "@/types";
import { mockProcedures } from "@/lib/mockData";

const ProcedureDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [procedure, setProcedure] = useState<Procedure | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would be an API call
    const foundProcedure = mockProcedures.find((p) => p.id === id);
    setProcedure(foundProcedure || null);
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!procedure) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900">
          Procédure non trouvée
        </h1>
        <p className="text-gray-600 mt-2">
          La procédure demandée n'existe pas ou a été supprimée.
        </p>
        <Button asChild className="mt-4">
          <Link to="/procedures">Retour à la liste</Link>
        </Button>
      </div>
    );
  }

  const getProgressPercentage = () => {
    const totalSteps = 5; // Standard number of steps
    const completedSteps = procedure.etapes.filter(
      (e) => e.statut === "terminee",
    ).length;
    return (completedSteps / totalSteps) * 100;
  };

  const getStepDisplayName = (stepType: string) => {
    switch (stepType) {
      case "verification_dossier":
        return "Vérification du dossier";
      case "empietement_check":
        return "Vérification empietement";
      case "rapport_police":
        return "Rapport de police";
      case "avis_wali":
        return "Avis du Wali";
      case "soumission_comite":
        return "Soumission au comité";
      default:
        return stepType;
    }
  };

  const getStepIcon = (status: EtapeStatus) => {
    switch (status) {
      case "terminee":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "en_attente":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "rejetee":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const updateStepStatus = (
    etapeId: string,
    newStatus: EtapeStatus,
    comment?: string,
  ) => {
    // In a real app, this would be an API call
    console.log("Updating step:", etapeId, newStatus, comment);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" asChild>
            <Link to="/procedures">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {procedure.code}
            </h1>
            <p className="text-gray-600">
              {procedure.entiteMorale.raisonSociale}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <StatusBadge status={procedure.statut} type="procedure" />
          <Badge variant="outline" className="capitalize">
            {procedure.type.replace("_", " ")}
          </Badge>
        </div>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <GitBranch className="mr-2 h-5 w-5" />
              Progression de la procédure
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(getProgressPercentage())}% complété
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={getProgressPercentage()} className="mb-4" />
          <p className="text-sm text-gray-600">
            {procedure.etapes.filter((e) => e.statut === "terminee").length}{" "}
            étapes terminées sur 5
          </p>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="steps" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="steps">Étapes</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="decisions">Décisions</TabsTrigger>
          <TabsTrigger value="info">Informations</TabsTrigger>
        </TabsList>

        {/* Steps */}
        <TabsContent value="steps" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Suivi des étapes</CardTitle>
              <CardDescription>
                Progression détaillée de chaque étape de la procédure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {procedure.etapes.map((etape, index) => (
                  <div key={etape.id} className="relative">
                    {index < procedure.etapes.length - 1 && (
                      <div className="absolute left-6 top-12 w-px h-16 bg-gray-200"></div>
                    )}

                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 mt-1">
                        {getStepIcon(etape.statut)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900">
                            {getStepDisplayName(etape.type)}
                          </h4>
                          <StatusBadge status={etape.statut} type="etape" />
                        </div>

                        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-500">
                              Date de début
                            </label>
                            <p className="text-sm flex items-center">
                              <Calendar className="mr-1 h-4 w-4 text-gray-400" />
                              {etape.dateDebut.toLocaleDateString("fr-FR")}
                            </p>
                          </div>

                          {etape.dateFin && (
                            <div>
                              <label className="text-sm font-medium text-gray-500">
                                Date de fin
                              </label>
                              <p className="text-sm flex items-center">
                                <Calendar className="mr-1 h-4 w-4 text-gray-400" />
                                {etape.dateFin.toLocaleDateString("fr-FR")}
                              </p>
                            </div>
                          )}
                        </div>

                        {etape.commentaire && (
                          <div className="mt-3">
                            <label className="text-sm font-medium text-gray-500">
                              Commentaire
                            </label>
                            <p className="text-sm text-gray-700 mt-1 p-3 bg-gray-50 rounded">
                              {etape.commentaire}
                            </p>
                          </div>
                        )}

                        {etape.statut === "en_attente" && (
                          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
                            <h5 className="font-medium text-blue-900 mb-3">
                              Mettre à jour cette étape
                            </h5>
                            <div className="space-y-3">
                              <div>
                                <label className="text-sm font-medium text-blue-700">
                                  Nouveau statut
                                </label>
                                <Select
                                  onValueChange={(value) =>
                                    console.log("Status change:", value)
                                  }
                                >
                                  <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Choisir le statut" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="terminee">
                                      Terminée
                                    </SelectItem>
                                    <SelectItem value="rejetee">
                                      Rejetée
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div>
                                <label className="text-sm font-medium text-blue-700">
                                  Commentaire
                                </label>
                                <Textarea
                                  className="mt-1"
                                  placeholder="Ajoutez un commentaire..."
                                  rows={3}
                                />
                              </div>

                              <Button size="sm">Mettre à jour</Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents */}
        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Documents de la procédure
              </CardTitle>
              <CardDescription>
                Liste des documents requis et leurs statuts de validation
              </CardDescription>
            </CardHeader>
            <CardContent>
              {procedure.documents.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom du document</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Date d'upload</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {procedure.documents.map((document) => (
                      <TableRow key={document.id}>
                        <TableCell className="font-medium">
                          {document.nom}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {document.type.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <StatusBadge
                            status={document.statut}
                            type="document"
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="mr-1 h-4 w-4 text-gray-400" />
                            {document.dateUpload.toLocaleDateString("fr-FR")}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                            {document.statut === "en_attente" && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-green-600"
                                >
                                  Valider
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600"
                                >
                                  Rejeter
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    Aucun document
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Aucun document n'a été uploadé pour cette procédure
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Decisions */}
        <TabsContent value="decisions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Décisions du comité
              </CardTitle>
              <CardDescription>
                Historique des décisions prises par le comité de direction
              </CardDescription>
            </CardHeader>
            <CardContent>
              {procedure.decisionsComite.length > 0 ? (
                <div className="space-y-4">
                  {procedure.decisionsComite.map((decision) => (
                    <div key={decision.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <StatusBadge
                            status={decision.decision}
                            type="procedure"
                          />
                          <span className="text-sm text-gray-500">
                            {decision.dateDecision.toLocaleDateString("fr-FR")}
                          </span>
                        </div>
                        <Badge variant="outline">
                          Membre: {decision.membreId}
                        </Badge>
                      </div>

                      {decision.commentaire && (
                        <div className="mb-3">
                          <label className="text-sm font-medium text-gray-500">
                            Commentaire
                          </label>
                          <p className="text-sm text-gray-700 mt-1">
                            {decision.commentaire}
                          </p>
                        </div>
                      )}

                      {decision.noteDecision && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">
                            Note de décision
                          </label>
                          <p className="text-sm text-gray-700 mt-1 p-3 bg-gray-50 rounded">
                            {decision.noteDecision}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <User className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    Aucune décision
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Aucune décision n'a encore été prise pour cette procédure
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Information */}
        <TabsContent value="info" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Procedure Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <GitBranch className="mr-2 h-5 w-5" />
                  Informations de la procédure
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Code
                    </label>
                    <p className="text-sm font-mono">{procedure.code}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Type
                    </label>
                    <p className="text-sm capitalize">
                      {procedure.type.replace("_", " ")}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Statut
                    </label>
                    <div className="mt-1">
                      <StatusBadge status={procedure.statut} type="procedure" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Date de création
                    </label>
                    <p className="text-sm flex items-center">
                      <Calendar className="mr-1 h-4 w-4 text-gray-400" />
                      {procedure.dateCreation.toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Entity Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="mr-2 h-5 w-5" />
                  Entité demandeuse
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium">
                    {procedure.entiteMorale.raisonSociale}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {procedure.entiteMorale.formeJuridique}
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Registre de commerce
                    </label>
                    <p className="text-sm">{procedure.entiteMorale.numeroRC}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Représentant légal
                    </label>
                    <p className="text-sm">
                      {procedure.entiteMorale.representantLegal}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Contact
                    </label>
                    <p className="text-sm">{procedure.entiteMorale.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Related Permit */}
          {procedure.permis && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Permis lié
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{procedure.permis.code}</h4>
                    <p className="text-sm text-gray-600">
                      Statut:{" "}
                      <StatusBadge
                        status={procedure.permis.statut}
                        type="permit"
                        className="ml-1"
                      />
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Expire le{" "}
                      {procedure.permis.dateExpiration.toLocaleDateString(
                        "fr-FR",
                      )}
                    </p>
                  </div>
                  <Button variant="outline" asChild>
                    <Link to={`/permits/${procedure.permis.id}`}>
                      Voir le permis
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProcedureDetail;
