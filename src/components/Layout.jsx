import React, { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Compass, Archive, Shield, Menu, X, LogOut, User, CreditCard } from "lucide-react";

export default function Layout() {
  const [user, setUser] = useState(null);
  const [siteContent, setSiteContent] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
    base44.entities.SiteContent.list().then(items => {
      if (items.length > 0) setSiteContent(items[0]);
    }).catch(() => {});
  }, []);

  const isAdmin = user?.role === "admin";
  const brandName = siteContent?.brand_name || "TripStack";

  const links = [
    { to: "/", label: "Trip Planner", icon: Compass },
    { to: "/archive", label: "My Trips", icon: Archive },
    { to: "/pricing", label: "Plans", icon: CreditCard },
  ];
  if (isAdmin) {
    links.push({ to: "/admin", label: "Admin", icon: Shield });
  }

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-violet-600 flex items-center justify-center">
                <Compass className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="font-bold text-slate-900">{brandName}</span>
                {siteContent?.nav_subtitle && (
                  <span className="hidden sm:inline text-xs text-slate-400 ml-2">{siteContent.nav_subtitle}</span>
                )}
              </div>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {links.map(l => (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive(l.to) ? "bg-sky-50 text-sky-700" : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <l.icon className="w-4 h-4" />
                  {l.label}
                </Link>
              ))}
              <div className="ml-2 pl-2 border-l border-slate-200 flex items-center gap-2">
                <span className="text-xs text-slate-500">{user?.email}</span>
                <button
                  onClick={() => base44.auth.logout("/")}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white px-4 pb-4 pt-2 space-y-1">
            {links.map(l => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive(l.to) ? "bg-sky-50 text-sky-700" : "text-slate-600"
                }`}
              >
                <l.icon className="w-4 h-4" />
                {l.label}
              </Link>
            ))}
            <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">{user?.email}</span>
              <button
                onClick={() => base44.auth.logout("/")}
                className="text-xs text-slate-500 hover:text-slate-700"
              >
                Sign out
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Page content */}
      <main>
        <Outlet />
      </main>
    </div>
  );
}