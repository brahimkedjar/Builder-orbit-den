import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  type?: "permit" | "procedure" | "document" | "etape";
  className?: string;
}

const StatusBadge = ({
  status,
  type = "permit",
  className,
}: StatusBadgeProps) => {
  const getStatusConfig = () => {
    if (type === "permit") {
      switch (status) {
        case "valide":
          return {
            label: "Valide",
            variant: "default" as const,
            className: "bg-green-100 text-green-800 border-green-200",
          };
        case "expire":
          return {
            label: "Expiré",
            variant: "destructive" as const,
            className: "bg-red-100 text-red-800 border-red-200",
          };
        case "suspendu":
          return {
            label: "Suspendu",
            variant: "secondary" as const,
            className: "bg-yellow-100 text-yellow-800 border-yellow-200",
          };
        case "annule":
          return {
            label: "Annulé",
            variant: "outline" as const,
            className: "bg-gray-100 text-gray-800 border-gray-200",
          };
        case "fusionne":
          return {
            label: "Fusionné",
            variant: "outline" as const,
            className: "bg-purple-100 text-purple-800 border-purple-200",
          };
        default:
          return { label: status, variant: "outline" as const, className: "" };
      }
    }

    if (type === "procedure") {
      switch (status) {
        case "en_cours":
          return {
            label: "En cours",
            variant: "default" as const,
            className: "bg-blue-100 text-blue-800 border-blue-200",
          };
        case "terminee":
          return {
            label: "Terminée",
            variant: "default" as const,
            className: "bg-green-100 text-green-800 border-green-200",
          };
        case "rejetee":
          return {
            label: "Rejetée",
            variant: "destructive" as const,
            className: "bg-red-100 text-red-800 border-red-200",
          };
        case "suspendue":
          return {
            label: "Suspendue",
            variant: "secondary" as const,
            className: "bg-yellow-100 text-yellow-800 border-yellow-200",
          };
        default:
          return { label: status, variant: "outline" as const, className: "" };
      }
    }

    if (type === "document") {
      switch (status) {
        case "en_attente":
          return {
            label: "En attente",
            variant: "secondary" as const,
            className: "bg-yellow-100 text-yellow-800 border-yellow-200",
          };
        case "valide":
          return {
            label: "Validé",
            variant: "default" as const,
            className: "bg-green-100 text-green-800 border-green-200",
          };
        case "rejete":
          return {
            label: "Rejeté",
            variant: "destructive" as const,
            className: "bg-red-100 text-red-800 border-red-200",
          };
        default:
          return { label: status, variant: "outline" as const, className: "" };
      }
    }

    if (type === "etape") {
      switch (status) {
        case "en_attente":
          return {
            label: "En attente",
            variant: "secondary" as const,
            className: "bg-yellow-100 text-yellow-800 border-yellow-200",
          };
        case "terminee":
          return {
            label: "Terminée",
            variant: "default" as const,
            className: "bg-green-100 text-green-800 border-green-200",
          };
        case "rejetee":
          return {
            label: "Rejetée",
            variant: "destructive" as const,
            className: "bg-red-100 text-red-800 border-red-200",
          };
        default:
          return { label: status, variant: "outline" as const, className: "" };
      }
    }

    return { label: status, variant: "outline" as const, className: "" };
  };

  const config = getStatusConfig();

  return (
    <Badge variant={config.variant} className={cn(config.className, className)}>
      {config.label}
    </Badge>
  );
};

export default StatusBadge;
