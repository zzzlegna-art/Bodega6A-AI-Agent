import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";

import { PlatformGuide } from "@/components/shared/platform-guide";
import { InstallAppButton } from "@/components/shared/install-app-button";
import { usePermissions } from "@/hooks/use-permissions";
import { useStore } from "@/hooks/use-store";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "./nav-items";

/** Navegación principal (sidebar en escritorio, drawer en móvil). */
export const SidebarNav = ({ onNavigate }: { onNavigate?: () => void }) => {
  const { t } = useTranslation();
  const { db } = useStore();
  const { can } = usePermissions();
  const items = NAV_ITEMS.filter((item) => can(item.permission));

  return (
    <div className="safe-top flex h-full flex-col gap-6 bg-sidebar p-4 text-sidebar-foreground">
      <div className="flex items-center gap-3 px-2 pt-1">
        <img
          src="/icons/logo-bodega6a.png"
          alt={t("common.appName")}
          className="h-10 w-[61px] shrink-0 object-contain"
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-sidebar-accent-foreground">
            {db.settings.companyName}
          </p>
          <p className="truncate text-xs text-sidebar-foreground/70">
            {t("common.appName")}
          </p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-[background-color,color,transform] duration-200 motion-reduce:transition-none",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm before:absolute before:left-0 before:top-1/2 before:h-5 before:w-[3px] before:-translate-y-1/2 before:rounded-full before:bg-sidebar-primary [&>svg]:text-sidebar-primary"
                  : "text-sidebar-foreground/85 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground [@media(hover:hover)]:hover:translate-x-0.5 motion-reduce:[@media(hover:hover)]:hover:translate-x-0",
              )
            }
          >
            <item.icon className="h-4 w-4 shrink-0" />
            <span className="truncate">{t(item.labelKey)}</span>
          </NavLink>
        ))}
      </nav>

      <div className="space-y-3 border-t border-sidebar-border pt-3">
        <PlatformGuide variant="sidebar" />
        <InstallAppButton variant="sidebar" />
        <p className="px-3 text-[11px] leading-relaxed text-sidebar-foreground/50">
          {t("common.localModeNote")}
        </p>
      </div>
    </div>
  );
};
