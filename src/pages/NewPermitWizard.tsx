import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ChevronLeft,
  ChevronRight,
  Building2,
  MapPin,
  Gem,
  FileCheck,
  Send,
  Upload,
  X,
  Plus,
} from "lucide-react";
import { mockEntitesMorales, mockSubstances } from "@/lib/mockData";
import { CoordinateInput } from "@/types";

interface WizardStep {
  id: number;
  title: string;
  description: string;
}

const steps: WizardStep[] = [
  { id: 1, title: "Entité Morale", description: "Sélection de l'entreprise" },
  { id: 2, title: "Périmètre", description: "Définition des coordonnées" },
  { id: 3, title: "Substances", description: "Choix des substances" },
  { id: 4, title: "Documents", description: "Upload des documents requis" },
  { id: 5, title: "Confirmation", description: "Validation et soumission" },
];

const requiredDocuments = [
  { id: "registre_commerce", name: "Registre de commerce", required: true },
  { id: "statuts", name: "Statuts de l'entreprise", required: true },
  { id: "note_technique", name: "Note technique", required: true },
  { id: "carte_cadastrale", name: "Carte cadastrale", required: true },
];

const NewPermitWizard = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    entiteMoraleId: "",
    coordinates: [] as CoordinateInput[],
    substanceIds: [] as string[],
    documents: {} as Record<string, File>,
    documentStatus: {} as Record<string, boolean>,
  });

  const [newCoordinate, setNewCoordinate] = useState({ x: "", y: "", z: "" });

  const progressPercentage = (currentStep / steps.length) * 100;

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return formData.entiteMoraleId !== "";
      case 2:
        return formData.coordinates.length >= 3;
      case 3:
        return formData.substanceIds.length > 0;
      case 4:
        return requiredDocuments.every(
          (doc) =>
            formData.documentStatus[doc.id] || formData.documents[doc.id],
        );
      default:
        return true;
    }
  };

  const addCoordinate = () => {
    if (newCoordinate.x && newCoordinate.y) {
      setFormData({
        ...formData,
        coordinates: [
          ...formData.coordinates,
          {
            x: parseFloat(newCoordinate.x),
            y: parseFloat(newCoordinate.y),
            z: newCoordinate.z ? parseFloat(newCoordinate.z) : 0,
          },
        ],
      });
      setNewCoordinate({ x: "", y: "", z: "" });
    }
  };

  const removeCoordinate = (index: number) => {
    setFormData({
      ...formData,
      coordinates: formData.coordinates.filter((_, i) => i !== index),
    });
  };

  const handleSubstanceToggle = (substanceId: string) => {
    const isSelected = formData.substanceIds.includes(substanceId);
    if (isSelected) {
      setFormData({
        ...formData,
        substanceIds: formData.substanceIds.filter((id) => id !== substanceId),
      });
    } else {
      setFormData({
        ...formData,
        substanceIds: [...formData.substanceIds, substanceId],
      });
    }
  };

  const handleFileUpload = (documentId: string, file: File) => {
    setFormData({
      ...formData,
      documents: {
        ...formData.documents,
        [documentId]: file,
      },
    });
  };

  const handleSubmit = () => {
    // In a real app, this would submit to the API
    console.log("Submitting form data:", formData);
    // Simulate API call
    setTimeout(() => {
      navigate("/procedures");
    }, 2000);
  };

  const selectedEntite = mockEntitesMorales.find(
    (e) => e.id === formData.entiteMoraleId,
  );
  const selectedSubstances = mockSubstances.filter((s) =>
    formData.substanceIds.includes(s.id),
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Nouvelle Demande de Permis
        </h1>
        <p className="text-gray-600 mt-1">Assistant de création de demande</p>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium">
              Étape {currentStep} sur {steps.length}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(progressPercentage)}% complété
            </span>
          </div>
          <Progress value={progressPercentage} className="mb-4" />
          <div className="flex justify-between text-xs text-gray-500">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`text-center ${currentStep >= step.id ? "text-blue-600" : ""}`}
              >
                <div className="font-medium">{step.title}</div>
                <div>{step.description}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            {currentStep === 1 && <Building2 className="mr-2 h-5 w-5" />}
            {currentStep === 2 && <MapPin className="mr-2 h-5 w-5" />}
            {currentStep === 3 && <Gem className="mr-2 h-5 w-5" />}
            {currentStep === 4 && <FileCheck className="mr-2 h-5 w-5" />}
            {currentStep === 5 && <Send className="mr-2 h-5 w-5" />}
            {steps[currentStep - 1].title}
          </CardTitle>
          <CardDescription>
            {steps[currentStep - 1].description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: Entity Selection */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="entite">Sélectionnez l'entité morale</Label>
                <Select
                  value={formData.entiteMoraleId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, entiteMoraleId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir une entreprise" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockEntitesMorales.map((entite) => (
                      <SelectItem key={entite.id} value={entite.id}>
                        <div>
                          <div className="font-medium">
                            {entite.raisonSociale}
                          </div>
                          <div className="text-sm text-gray-500">
                            {entite.formeJuridique} - RC: {entite.numeroRC}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedEntite && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900">
                    {selectedEntite.raisonSociale}
                  </h4>
                  <p className="text-sm text-blue-700 mt-1">
                    {selectedEntite.adresse}
                  </p>
                  <p className="text-sm text-blue-700">
                    Représentant: {selectedEntite.representantLegal}
                  </p>
                  <p className="text-sm text-blue-700">
                    Email: {selectedEntite.email}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Perimeter Definition */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-4">Définition du périmètre</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Ajoutez les coordonnées des points du périmètre (minimum 3
                  points pour former un polygone)
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <Label htmlFor="x">Longitude (X)</Label>
                  <Input
                    id="x"
                    type="number"
                    step="0.000001"
                    placeholder="34.520000"
                    value={newCoordinate.x}
                    onChange={(e) =>
                      setNewCoordinate({ ...newCoordinate, x: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="y">Latitude (Y)</Label>
                  <Input
                    id="y"
                    type="number"
                    step="0.000001"
                    placeholder="1.340000"
                    value={newCoordinate.y}
                    onChange={(e) =>
                      setNewCoordinate({ ...newCoordinate, y: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="z">Altitude (Z)</Label>
                  <Input
                    id="z"
                    type="number"
                    placeholder="0"
                    value={newCoordinate.z}
                    onChange={(e) =>
                      setNewCoordinate({ ...newCoordinate, z: e.target.value })
                    }
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={addCoordinate} className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter
                  </Button>
                </div>
              </div>

              {formData.coordinates.length > 0 && (
                <div>
                  <h5 className="font-medium mb-2">
                    Points du périmètre ({formData.coordinates.length})
                  </h5>
                  <div className="space-y-2">
                    {formData.coordinates.map((coord, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-white border rounded"
                      >
                        <span className="text-sm">
                          Point {index + 1}: X={coord.x}, Y={coord.y}, Z=
                          {coord.z}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeCoordinate(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Substance Selection */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-4">Sélection des substances</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Choisissez les substances que vous souhaitez exploiter
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockSubstances.map((substance) => (
                  <div
                    key={substance.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      formData.substanceIds.includes(substance.id)
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handleSubstanceToggle(substance.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={formData.substanceIds.includes(substance.id)}
                        onChange={() => handleSubstanceToggle(substance.id)}
                      />
                      <div>
                        <h5 className="font-medium">{substance.nom}</h5>
                        <p className="text-sm text-gray-500">
                          {substance.symbole} - {substance.famille}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {selectedSubstances.length > 0 && (
                <div>
                  <h5 className="font-medium mb-2">Substances sélectionnées</h5>
                  <div className="flex flex-wrap gap-2">
                    {selectedSubstances.map((substance) => (
                      <Badge key={substance.id} variant="secondary">
                        {substance.nom} ({substance.symbole})
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Document Upload */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-4">Documents requis</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Uploadez tous les documents nécessaires pour votre demande
                </p>
              </div>

              <div className="space-y-4">
                {requiredDocuments.map((document) => (
                  <div key={document.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <h5 className="font-medium">{document.name}</h5>
                        {document.required && (
                          <Badge variant="destructive" className="text-xs">
                            Requis
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={
                            formData.documentStatus[document.id] ||
                            !!formData.documents[document.id]
                          }
                          onCheckedChange={(checked) =>
                            setFormData({
                              ...formData,
                              documentStatus: {
                                ...formData.documentStatus,
                                [document.id]: checked as boolean,
                              },
                            })
                          }
                        />
                        <span className="text-sm text-gray-500">
                          Document disponible
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Input
                        type="file"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleFileUpload(document.id, file);
                          }
                        }}
                        className="flex-1"
                      />
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>

                    {formData.documents[document.id] && (
                      <p className="text-sm text-green-600 mt-2">
                        ✓ {formData.documents[document.id].name}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Confirmation */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <h4 className="font-medium mb-4">
                  Récapitulatif de votre demande
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  Vérifiez les informations avant de soumettre votre demande
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h5 className="font-medium text-gray-900">Entité morale</h5>
                  <p className="text-sm text-gray-600">
                    {selectedEntite?.raisonSociale}
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h5 className="font-medium text-gray-900">Périmètre</h5>
                  <p className="text-sm text-gray-600">
                    {formData.coordinates.length} points définis
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h5 className="font-medium text-gray-900">Substances</h5>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedSubstances.map((substance) => (
                      <Badge
                        key={substance.id}
                        variant="secondary"
                        className="text-xs"
                      >
                        {substance.nom}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h5 className="font-medium text-gray-900">Documents</h5>
                  <p className="text-sm text-gray-600">
                    {
                      requiredDocuments.filter(
                        (doc) =>
                          formData.documentStatus[doc.id] ||
                          formData.documents[doc.id],
                      ).length
                    }{" "}
                    sur {requiredDocuments.length} documents fournis
                  </p>
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  En soumettant cette demande, vous confirmez que toutes les
                  informations fournies sont exactes et complètes. Une procédure
                  sera automatiquement créée et vous pourrez suivre son
                  avancement.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 1}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Précédent
        </Button>

        {currentStep < steps.length ? (
          <Button onClick={handleNext} disabled={!validateCurrentStep()}>
            Suivant
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmit}>
            <Send className="mr-2 h-4 w-4" />
            Soumettre la demande
          </Button>
        )}
      </div>
    </div>
  );
};

export default NewPermitWizard;
