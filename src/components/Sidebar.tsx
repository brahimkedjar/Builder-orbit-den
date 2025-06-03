import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import {
  Pickaxe,
  Home,
  FileText,
  GitBranch,
  UserPlus,
  CheckSquare,
  Users,
  Merge,
  Map,
  Plus,
  Search,
  Settings,
  Building2,
} from "lucide-react";

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const adminNavigation = [
    { name: "Tableau de bord", href: "/dashboard", icon: Home },
    { name: "Permis", href: "/permits", icon: FileText },
    { name: "Procédures", href: "/procedures", icon: GitBranch },
    { name: "Nouvelle demande", href: "/new-permit", icon: UserPlus },
    {
      name: "Validation documents",
      href: "/document-validation",
      icon: CheckSquare,
    },
    { name: "Décisions comité", href: "/committee-decisions", icon: Users },
    { name: "Fusion/Substitution", href: "/workflows", icon: Merge },
    { name: "Périmètres", href: "/perimeters", icon: Map },
    { name: "Entités morales", href: "/entities", icon: Building2 },
    { name: "Recherche", href: "/search", icon: Search },
  ];

  const agentNavigation = [
    { name: "Tableau de bord", href: "/dashboard", icon: Home },
    { name: "Procédures", href: "/procedures", icon: GitBranch },
    {
      name: "Validation documents",
      href: "/document-validation",
      icon: CheckSquare,
    },
    { name: "Périmètres", href: "/perimeters", icon: Map },
    { name: "Recherche", href: "/search", icon: Search },
  ];

  const committeeNavigation = [
    { name: "Tableau de bord", href: "/dashboard", icon: Home },
    { name: "Décisions comité", href: "/committee-decisions", icon: Users },
    { name: "Procédures", href: "/procedures", icon: GitBranch },
    { name: "Recherche", href: "/search", icon: Search },
  ];

  const operatorNavigation = [
    { name: "Mon tableau de bord", href: "/operator-dashboard", icon: Home },
    { name: "Mes permis", href: "/my-permits", icon: FileText },
    { name: "Mes procédures", href: "/my-procedures", icon: GitBranch },
    { name: "Nouvelle demande", href: "/new-permit", icon: Plus },
    { name: "Mon entreprise", href: "/my-entity", icon: Building2 },
  ];

  const getNavigation = () => {
    switch (user?.role) {
      case "administrator":
        return adminNavigation;
      case "cadastre_agent":
        return agentNavigation;
      case "committee_member":
        return committeeNavigation;
      case "operator":
        return operatorNavigation;
      default:
        return [];
    }
  };

  const navigation = getNavigation();

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white border-r border-gray-200 px-6">
        <div className="flex h-16 shrink-0 items-center">
          <div className="flex items-center">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Pickaxe className="h-6 w-6 text-white" />
            </div>
            <div className="ml-3">
              <h1 className="text-lg font-semibold text-gray-900">MinePerm</h1>
              <p className="text-xs text-gray-500">Gestion Minière</p>
            </div>
          </div>
        </div>

        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className={cn(
                          isActive
                            ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                            : "text-gray-700 hover:text-blue-700 hover:bg-gray-50",
                          "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-medium",
                        )}
                      >
                        <item.icon
                          className={cn(
                            isActive
                              ? "text-blue-700"
                              : "text-gray-400 group-hover:text-blue-700",
                            "h-5 w-5 shrink-0",
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>

            {user?.role === "administrator" && (
              <li className="mt-auto">
                <Link
                  to="/settings"
                  className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm leading-6 font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-700"
                >
                  <Settings className="h-5 w-5 shrink-0 text-gray-400 group-hover:text-blue-700" />
                  Paramètres
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
