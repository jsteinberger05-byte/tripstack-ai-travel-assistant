import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { Shield, Settings, FileText, Users, Plane, Search, Trash2, Save, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import moment from "moment";

function Section({ title, icon: Icon, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-sky-500" />
          <span className="font-semibold text-slate-900">{title}</span>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>
      {open && <div className="px-5 pb-5 border-t border-slate-100">{children}</div>}
    </div>
  );
}

export default function Admin() {
  const [user, setUser] = useState(null);
  const [siteContent, setSiteContent] = useState(null);
  const [appSettings, setAppSettings] = useState(null);
  const [users, setUsers] = useState([]);
  const [trips, setTrips] = useState([]);
  const [tripSearch, setTripSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const me = await base44.auth.me();
      if (me.role !== "admin") {
        navigate("/");
        return;
      }
      setUser(me);

      const [scList, asList, userList, tripList] = await Promise.all([
        base44.entities.SiteContent.list(),
        base44.entities.AppSettings.list(),
        base44.entities.User.list(),
        base44.entities.Trip.list("-created_date", 50),
      ]);

      setSiteContent(scList[0] || {});
      setAppSettings(asList[0] || {});
      setUsers(userList);
      setTrips(tripList);
    } catch {
      toast({ title: "Failed to load admin data", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const saveSiteContent = async () => {
    try {
      if (siteContent.id) {
        await base44.entities.SiteContent.update(siteContent.id, siteContent);
      } else {
        const created = await base44.entities.SiteContent.create(siteContent);
        setSiteContent(created);
      }
      toast({ title: "Site content saved" });
    } catch {
      toast({ title: "Failed to save", variant: "destructive" });
    }
  };

  const saveAppSettings = async () => {
    try {
      if (appSettings.id) {
        await base44.entities.AppSettings.update(appSettings.id, appSettings);
      } else {
        const created = await base44.entities.AppSettings.create(appSettings);
        setAppSettings(created);
      }
      toast({ title: "Settings saved" });
    } catch {
      toast({ title: "Failed to save", variant: "destructive" });
    }
  };

  const toggleRole = async (u) => {
    const newRole = u.role === "admin" ? "user" : "admin";
    try {
      await base44.entities.User.update(u.id, { role: newRole });
      setUsers(prev => prev.map(x => x.id === u.id ? { ...x, role: newRole } : x));
      toast({ title: `${u.full_name || u.email} is now ${newRole}` });
    } catch {
      toast({ title: "Failed to update role", variant: "destructive" });
    }
  };

  const deleteTrip = async (id) => {
    if (!confirm("Delete this trip?")) return;
    try {
      await base44.entities.Trip.delete(id);
      setTrips(prev => prev.filter(t => t.id !== id));
      toast({ title: "Trip deleted" });
    } catch {
      toast({ title: "Failed to delete", variant: "destructive" });
    }
  };

  const filteredTrips = trips.filter(t => {
    if (!tripSearch) return true;
    const q = tripSearch.toLowerCase();
    return (
      (t.title || "").toLowerCase().includes(q) ||
      (t.destinations || "").toLowerCase().includes(q) ||
      (t.vibe || "").toLowerCase().includes(q) ||
      (t.user_id || "").toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-sky-500 rounded-full animate-spin" />
      </div>
    );
  }

  const InputField = ({ label, value, onChange, type = "text" }) => (
    <div>
      <label className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1 block">{label}</label>
      <input
        type={type}
        value={value || ""}
        onChange={e => onChange(type === "number" ? parseFloat(e.target.value) || 0 : e.target.value)}
        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400"
      />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2 mb-8">
        <Shield className="w-6 h-6 text-sky-500" />
        Admin Dashboard
      </h1>

      <div className="space-y-4">
        {/* Site Content */}
        <Section title="Site Content" icon={FileText} defaultOpen>
          <div className="grid gap-4 sm:grid-cols-2 mt-4">
            <InputField label="Brand Name" value={siteContent?.brand_name} onChange={v => setSiteContent(p => ({ ...p, brand_name: v }))} />
            <InputField label="Hero Title" value={siteContent?.hero_title} onChange={v => setSiteContent(p => ({ ...p, hero_title: v }))} />
            <InputField label="Hero Subtitle" value={siteContent?.hero_subtitle} onChange={v => setSiteContent(p => ({ ...p, hero_subtitle: v }))} />
            <InputField label="Nav Subtitle" value={siteContent?.nav_subtitle} onChange={v => setSiteContent(p => ({ ...p, nav_subtitle: v }))} />
            <InputField label="Primary Button Text" value={siteContent?.primary_button_text} onChange={v => setSiteContent(p => ({ ...p, primary_button_text: v }))} />
            <InputField label="Sample Button Text" value={siteContent?.sample_button_text} onChange={v => setSiteContent(p => ({ ...p, sample_button_text: v }))} />
          </div>
          <Button onClick={saveSiteContent} size="sm" className="mt-4">
            <Save className="w-3.5 h-3.5 mr-1.5" /> Save Content
          </Button>
        </Section>

        {/* App Settings */}
        <Section title="App Settings" icon={Settings}>
          <div className="grid gap-4 sm:grid-cols-2 mt-4">
            <InputField label="Default Origin" value={appSettings?.default_origin} onChange={v => setAppSettings(p => ({ ...p, default_origin: v }))} />
            <InputField label="Default Budget" type="number" value={appSettings?.default_budget} onChange={v => setAppSettings(p => ({ ...p, default_budget: v }))} />
            <InputField label="Max Trip Days" type="number" value={appSettings?.max_trip_days} onChange={v => setAppSettings(p => ({ ...p, max_trip_days: v }))} />
            <InputField label="Supported Vibes (comma-separated)" value={appSettings?.supported_vibes} onChange={v => setAppSettings(p => ({ ...p, supported_vibes: v }))} />
            <div className="flex items-center gap-3">
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Sample Trips Enabled</label>
              <button
                onClick={() => setAppSettings(p => ({ ...p, sample_trips_enabled: !p.sample_trips_enabled }))}
                className={`w-10 h-6 rounded-full transition-colors ${appSettings?.sample_trips_enabled ? "bg-sky-500" : "bg-slate-300"}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform mx-1 ${appSettings?.sample_trips_enabled ? "translate-x-4" : ""}`} />
              </button>
            </div>
          </div>
          <Button onClick={saveAppSettings} size="sm" className="mt-4">
            <Save className="w-3.5 h-3.5 mr-1.5" /> Save Settings
          </Button>
        </Section>

        {/* Users */}
        <Section title={`Users (${users.length})`} icon={Users}>
          <div className="mt-4 space-y-2">
            {users.map(u => (
              <div key={u.id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-slate-50">
                <div>
                  <p className="text-sm font-medium text-slate-800">{u.full_name || u.email}</p>
                  <p className="text-xs text-slate-500">{u.email}</p>
                </div>
                <button
                  onClick={() => toggleRole(u)}
                  disabled={u.id === user?.id}
                  className={`text-xs font-medium px-3 py-1 rounded-full transition-colors ${
                    u.role === "admin"
                      ? "bg-sky-100 text-sky-700 hover:bg-sky-200"
                      : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                  } ${u.id === user?.id ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {u.role || "user"}
                </button>
              </div>
            ))}
          </div>
        </Section>

        {/* All Trips */}
        <Section title={`All Trips (${trips.length})`} icon={Plane}>
          <div className="mt-4">
            <div className="relative mb-4">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={tripSearch}
                onChange={e => setTripSearch(e.target.value)}
                placeholder="Search by destination, vibe, user..."
                className="pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 w-full"
              />
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredTrips.map(t => (
                <div key={t.id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-slate-50">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-800 truncate">{t.title}</p>
                    <p className="text-xs text-slate-500">
                      {t.vibe} · ${t.budget} · {t.created_date ? moment(t.created_date).format("MMM D, YYYY") : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {t.overall_score && (
                      <span className="text-xs font-bold text-emerald-600">{t.overall_score}</span>
                    )}
                    <button onClick={() => deleteTrip(t.id)} className="p-1 rounded text-red-400 hover:text-red-600 hover:bg-red-50">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}