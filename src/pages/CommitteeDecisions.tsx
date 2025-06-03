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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Filter,
  Users,
  FileText,
  Calendar,
  Building2,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  Gavel,
  MessageSquare,
} from "lucide-react";
import { Procedure, DecisionComite, DecisionType } from "@/types";
import { mockProcedures } from "@/lib/mockData";

const CommitteeDecisions = () => {
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [pendingProcedures, setPendingProcedures] = useState<Procedure[]>([]);
  const [decisions, setDecisions] = useState<DecisionComite[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProcedure, setSelectedProcedure] = useState<Procedure | null>(
    null,
  );
  const [decisionData, setDecisionData] = useState({
    decision: "" as DecisionType,
    commentaire: "",
    noteDecision: "",
  });

  useEffect(() => {
    const allProcedures = mockProcedures;
    setProcedures(allProcedures);

    // Filter procedures that need committee decision
    const needingDecision = allProcedures.filter(
      (proc) =>
        proc.statut === "en_cours" &&
        proc.etapes.some(
          (etape) =>
            etape.type === "soumission_comite" && etape.statut === "en_attente",
        ),
    );
    setPendingProcedures(needingDecision);

    // Collect all decisions
    const allDecisions = allProcedures.flatMap((proc) => proc.decisionsComite);
    setDecisions(allDecisions);

    setLoading(false);
  }, []);

  const submitDecision = () => {
    if (!selectedProcedure || !decisionData.decision) return;

    const newDecision: DecisionComite = {
      id: `decision-${Date.now()}`,
      procedureId: selectedProcedure.id,
      decision: decisionData.decision,
      dateDecision: new Date(),
      membreId: "current-user-id", // In real app, this would be the current user
      commentaire: decisionData.commentaire,
      noteDecision: decisionData.noteDecision,
    };

    // In a real app, this would be an API call
    console.log("Submitting decision:", newDecision);

    // Update local state
    setDecisions((prev) => [...prev, newDecision]);
    setPendingProcedures((prev) =>
      prev.filter((proc) => proc.id !== selectedProcedure.id),
    );

    // Reset form
    setSelectedProcedure(null);
    setDecisionData({
      decision: "" as DecisionType,
      commentaire: "",
      noteDecision: "",
    });
  };

  const getProcedureTypeDisplayName = (type: string) => {
    switch (type) {
      case "demande":
        return "Nouvelle demande";
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

  const approvedCount = decisions.filter(
    (d) => d.decision === "approuve",
  ).length;
  const rejectedCount = decisions.filter((d) => d.decision === "rejete").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Décisions du Comité
          </h1>
          <p className="text-gray-600 mt-1">
            Validation des procédures par le comité de direction
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {pendingProcedures.length}
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
                  {approvedCount}
                </p>
                <p className="text-sm text-gray-600">Approuvées</p>
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
                <p className="text-sm text-gray-600">Rejetées</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {decisions.length}
                </p>
                <p className="text-sm text-gray-600">Total décisions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pending">Procédures en attente</TabsTrigger>
          <TabsTrigger value="history">Historique des décisions</TabsTrigger>
        </TabsList>

        {/* Pending Procedures */}
        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5" />
                Procédures nécessitant une décision
              </CardTitle>
              <CardDescription>
                Liste des procédures soumises au comité et en attente de
                décision
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pendingProcedures.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Code</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Entreprise</TableHead>
                        <TableHead>Permis lié</TableHead>
                        <TableHead>Date soumission</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingProcedures.map((procedure) => (
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
                            <Badge variant="outline">
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
                            <div className="flex items-center">
                              <Calendar className="mr-1 h-4 w-4 text-gray-400" />
                              {procedure.dateCreation.toLocaleDateString(
                                "fr-FR",
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm" asChild>
                                <Link to={`/procedures/${procedure.id}`}>
                                  <Eye className="h-4 w-4" />
                                </Link>
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => setSelectedProcedure(procedure)}
                              >
                                <Gavel className="mr-2 h-4 w-4" />
                                Décider
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    Aucune procédure en attente
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Toutes les procédures soumises ont été traitées
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Decisions History */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Historique des décisions
              </CardTitle>
              <CardDescription>
                Toutes les décisions prises par le comité de direction
              </CardDescription>
            </CardHeader>
            <CardContent>
              {decisions.length > 0 ? (
                <div className="space-y-4">
                  {decisions.map((decision) => {
                    const procedure = procedures.find(
                      (p) => p.id === decision.procedureId,
                    );
                    return (
                      <div key={decision.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <h4 className="font-medium">
                              {procedure ? (
                                <Link
                                  to={`/procedures/${procedure.id}`}
                                  className="text-blue-600 hover:text-blue-800"
                                >
                                  {procedure.code}
                                </Link>
                              ) : (
                                decision.procedureId
                              )}
                            </h4>
                            <StatusBadge
                              status={
                                decision.decision === "approuve"
                                  ? "terminee"
                                  : "rejetee"
                              }
                              type="procedure"
                            />
                            {procedure && (
                              <Badge variant="outline">
                                {getProcedureTypeDisplayName(procedure.type)}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="mr-1 h-4 w-4" />
                            {decision.dateDecision.toLocaleDateString("fr-FR")}
                          </div>
                        </div>

                        {procedure && (
                          <div className="mb-3">
                            <span className="text-sm text-gray-600">
                              Entreprise: {procedure.entiteMorale.raisonSociale}
                            </span>
                          </div>
                        )}

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
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    Aucune décision
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Aucune décision n'a encore été prise
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Decision Modal */}
      {selectedProcedure && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Gavel className="mr-2 h-5 w-5" />
                Décision du comité - {selectedProcedure.code}
              </CardTitle>
              <CardDescription>
                {getProcedureTypeDisplayName(selectedProcedure.type)} -{" "}
                {selectedProcedure.entiteMorale.raisonSociale}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Procedure Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium mb-2">
                    Informations de la procédure
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>Code:</strong> {selectedProcedure.code}
                    </div>
                    <div>
                      <strong>Type:</strong>{" "}
                      {getProcedureTypeDisplayName(selectedProcedure.type)}
                    </div>
                    <div>
                      <strong>Date création:</strong>{" "}
                      {selectedProcedure.dateCreation.toLocaleDateString(
                        "fr-FR",
                      )}
                    </div>
                    <div>
                      <strong>Statut:</strong>{" "}
                      <StatusBadge
                        status={selectedProcedure.statut}
                        type="procedure"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Entreprise demandeuse</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>Raison sociale:</strong>{" "}
                      {selectedProcedure.entiteMorale.raisonSociale}
                    </div>
                    <div>
                      <strong>Forme juridique:</strong>{" "}
                      {selectedProcedure.entiteMorale.formeJuridique}
                    </div>
                    <div>
                      <strong>RC:</strong>{" "}
                      {selectedProcedure.entiteMorale.numeroRC}
                    </div>
                    <div>
                      <strong>Représentant:</strong>{" "}
                      {selectedProcedure.entiteMorale.representantLegal}
                    </div>
                  </div>
                </div>
              </div>

              {/* Related Permit */}
              {selectedProcedure.permis && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium mb-2">Permis concerné</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Code:</strong> {selectedProcedure.permis.code}
                    </div>
                    <div>
                      <strong>Statut:</strong>{" "}
                      <StatusBadge
                        status={selectedProcedure.permis.statut}
                        type="permit"
                      />
                    </div>
                    <div>
                      <strong>Expiration:</strong>{" "}
                      {selectedProcedure.permis.dateExpiration.toLocaleDateString(
                        "fr-FR",
                      )}
                    </div>
                    <div>
                      <strong>Substances:</strong>{" "}
                      {selectedProcedure.permis.substances.length} autorisées
                    </div>
                  </div>
                </div>
              )}

              {/* Decision Form */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Décision *
                  </label>
                  <Select
                    value={decisionData.decision}
                    onValueChange={(value) =>
                      setDecisionData({
                        ...decisionData,
                        decision: value as DecisionType,
                      })
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Choisir une décision" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="approuve">Approuver</SelectItem>
                      <SelectItem value="rejete">Rejeter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Commentaire
                  </label>
                  <Textarea
                    value={decisionData.commentaire}
                    onChange={(e) =>
                      setDecisionData({
                        ...decisionData,
                        commentaire: e.target.value,
                      })
                    }
                    placeholder="Commentaire sur la décision..."
                    rows={3}
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Note de décision
                  </label>
                  <Textarea
                    value={decisionData.noteDecision}
                    onChange={(e) =>
                      setDecisionData({
                        ...decisionData,
                        noteDecision: e.target.value,
                      })
                    }
                    placeholder="Note détaillée expliquant la décision et les conditions éventuelles..."
                    rows={4}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedProcedure(null);
                    setDecisionData({
                      decision: "" as DecisionType,
                      commentaire: "",
                      noteDecision: "",
                    });
                  }}
                >
                  Annuler
                </Button>

                <Button
                  onClick={submitDecision}
                  disabled={!decisionData.decision}
                  className={
                    decisionData.decision === "approuve"
                      ? "bg-green-600 hover:bg-green-700"
                      : decisionData.decision === "rejete"
                        ? "bg-red-600 hover:bg-red-700"
                        : ""
                  }
                >
                  {decisionData.decision === "approuve" && (
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                  )}
                  {decisionData.decision === "rejete" && (
                    <XCircle className="mr-2 h-4 w-4" />
                  )}
                  {decisionData.decision
                    ? decisionData.decision === "approuve"
                      ? "Approuver"
                      : "Rejeter"
                    : "Confirmer la décision"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CommitteeDecisions;
