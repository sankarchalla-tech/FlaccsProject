import {
    LayoutDashboard,
    Music4,
    Download,
    RefreshCw,
    Settings,
    Server,
} from "lucide-react";

import SidebarItem from "./SidebarItem";
import AppLogo from "../common/AppLogo";
import { navigationItems } from "../../config/navigation";

export default function Sidebar() {
    return (
        <aside className="w-72 bg-slate-900 text-white flex flex-col border-r border-slate-800">

            {/* Logo */}

            <div className="px-6 py-8">

                <AppLogo />

            </div>

            {/* Navigation */}

            <nav className="flex-1 px-4 space-y-2">

                {navigationItems.map((item) => (
                    <SidebarItem
                        key={item.path}
                        to={item.path}
                        icon={item.icon}
                        label={item.label}
                    />
                ))}

            </nav>

            {/* Footer */}

            <div className="border-t border-slate-800 p-6">

                <div className="flex items-center gap-2 text-sm">

                    <Server size={16} className="text-green-400"/>

                    <span className="text-slate-300">
                        Backend Connected
                    </span>

                </div>

                <p className="text-xs text-slate-500 mt-4">
                    FLACC v4.0.0
                </p>

            </div>

        </aside>
    );
}