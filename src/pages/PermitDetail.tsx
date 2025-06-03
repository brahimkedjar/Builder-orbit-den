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
  ArrowLeft,
  MapPin,
  Calendar,
  Building2,
  Gem,
  FileText,
  Download,
  RotateCcw,
  ArrowRightLeft,
  Plus,
  History,
} from "lucide-react";
import { Permis } from "@/types";
import { mockPermis } from "@/lib/mockData";

const PermitDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [permit, setPermit] = useState<Permis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would be an API call
    const foundPermit = mockPermis.find((p) => p.id === id);
    setPermit(foundPermit || null);
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!permit) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900">Permis non trouvé</h1>
        <p className="text-gray-600 mt-2">
          Le permis demandé n'existe pas ou a été supprimé.
        </p>
        <Button asChild className="mt-4">
          <Link to="/permits">Retour à la liste</Link>
        </Button>
      </div>
    );
  }

  const isExpiringSoon = () => {
    const diffTime = permit.dateExpiration.getTime() - new Date().getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 90 && diffDays > 0;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" asChild>
            <Link to="/permits">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{permit.code}</h1>
            <p className="text-gray-600">{permit.entiteMorale.raisonSociale}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <StatusBadge status={permit.statut} type="permit" />
          {isExpiringSoon() && (
            <Badge variant="destructive">Expire bientôt</Badge>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Exporter PDF
            </Button>
            {permit.statut === "valide" && (
              <>
                <Button variant="outline">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Renouveler
                </Button>
                <Button variant="outline">
                  <ArrowRightLeft className="mr-2 h-4 w-4" />
                  Transférer
                </Button>
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Extension
                </Button>
              </>
            )}
            <Button variant="outline" asChild>
              <Link to={`/perimeters?permit=${permit.id}`}>
                <MapPin className="mr-2 h-4 w-4" />
                Voir sur carte
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">Informations générales</TabsTrigger>
          <TabsTrigger value="perimeter">Périmètre</TabsTrigger>
          <TabsTrigger value="procedures">Procédures</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
        </TabsList>

        {/* General Information */}
        <TabsContent value="general" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Permit Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Informations du permis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Code
                    </label>
                    <p className="text-sm font-mono">{permit.code}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Statut
                    </label>
                    <div className="mt-1">
                      <StatusBadge status={permit.statut} type="permit" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Date de délivrance
                    </label>
                    <p className="text-sm flex items-center">
                      <Calendar className="mr-1 h-4 w-4 text-gray-400" />
                      {permit.dateDelivrance.toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Date d'expiration
                    </label>
                    <p
                      className={`text-sm flex items-center ${isExpiringSoon() ? "text-red-600" : ""}`}
                    >
                      <Calendar className="mr-1 h-4 w-4 text-gray-400" />
                      {permit.dateExpiration.toLocaleDateString("fr-FR")}
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
                  Entité morale
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium">
                    {permit.entiteMorale.raisonSociale}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {permit.entiteMorale.formeJuridique}
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Registre de commerce
                    </label>
                    <p className="text-sm">{permit.entiteMorale.numeroRC}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Représentant légal
                    </label>
                    <p className="text-sm">
                      {permit.entiteMorale.representantLegal}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Adresse
                    </label>
                    <p className="text-sm">{permit.entiteMorale.adresse}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Contact
                    </label>
                    <p className="text-sm">{permit.entiteMorale.email}</p>
                    <p className="text-sm">{permit.entiteMorale.telephone}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Substances */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Gem className="mr-2 h-5 w-5" />
                Substances autorisées
              </CardTitle>
              <CardDescription>
                Liste des substances que ce permis autorise à exploiter
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {permit.substances.map((permisSubstance) => (
                  <div
                    key={permisSubstance.id}
                    className="p-4 border rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">
                          {permisSubstance.substance.nom}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {permisSubstance.substance.symbole} -{" "}
                          {permisSubstance.substance.famille}
                        </p>
                      </div>
                      <Badge variant="secondary">
                        {permisSubstance.substance.symbole}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      Ajouté le{" "}
                      {permisSubstance.dateAjout.toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Perimeter */}
        <TabsContent value="perimeter" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="mr-2 h-5 w-5" />
                Coordonnées du périmètre
              </CardTitle>
              <CardDescription>
                Points définissant les limites géographiques du permis
              </CardDescription>
            </CardHeader>
            <CardContent>
              {permit.perimetre.length > 0 ? (
                <div className="space-y-4">
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="text-gray-500 mt-2">Carte interactive</p>
                      <p className="text-sm text-gray-400">
                        Intégration Leaflet/MapBox à venir
                      </p>
                    </div>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Point</TableHead>
                        <TableHead>Longitude (X)</TableHead>
                        <TableHead>Latitude (Y)</TableHead>
                        <TableHead>Altitude (Z)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {permit.perimetre
                        .sort((a, b) => a.ordre - b.ordre)
                        .map((point) => (
                          <TableRow key={point.id}>
                            <TableCell>{point.ordre}</TableCell>
                            <TableCell className="font-mono">
                              {point.x.toFixed(6)}
                            </TableCell>
                            <TableCell className="font-mono">
                              {point.y.toFixed(6)}
                            </TableCell>
                            <TableCell className="font-mono">
                              {point.z.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <MapPin className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    Aucun périmètre défini
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Les coordonnées du périmètre n'ont pas été saisies
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Procedures */}
        <TabsContent value="procedures" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Procédures liées
              </CardTitle>
              <CardDescription>
                Historique des procédures associées à ce permis
              </CardDescription>
            </CardHeader>
            <CardContent>
              {permit.procedures && permit.procedures.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Date création</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {permit.procedures.map((procedure) => (
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
                            {procedure.type.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <StatusBadge
                            status={procedure.statut}
                            type="procedure"
                          />
                        </TableCell>
                        <TableCell>
                          {procedure.dateCreation.toLocaleDateString("fr-FR")}
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/procedures/${procedure.id}`}>Voir</Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    Aucune procédure
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Aucune procédure n'est associée à ce permis
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* History */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <History className="mr-2 h-5 w-5" />
                Historique des modifications
              </CardTitle>
              <CardDescription>
                Chronologie des changements apportés au permis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-2 border-blue-500 pl-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Création du permis</h4>
                    <span className="text-sm text-gray-500">
                      {permit.dateDelivrance.toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Permis {permit.code} créé pour{" "}
                    {permit.entiteMorale.raisonSociale}
                  </p>
                </div>

                {permit.substances.map((substance, index) => (
                  <div
                    key={substance.id}
                    className="border-l-2 border-green-500 pl-4"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Ajout substance</h4>
                      <span className="text-sm text-gray-500">
                        {substance.dateAjout.toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Substance {substance.substance.nom} ajoutée au permis
                    </p>
                  </div>
                ))}

                <div className="text-center py-4">
                  <p className="text-sm text-gray-500">Fin de l'historique</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PermitDetail;
