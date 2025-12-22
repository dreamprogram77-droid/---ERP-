
import React, { useState, useEffect, useMemo } from 'react';
import { 
  TrendingUp, 
  Users, 
  Clock, 
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  AlertCircle,
  Calendar,
  DollarSign,
  BarChart3,
  Github,
  Cloud,
  Layers,
  Zap,
  ChevronRight,
  Plus,
  Send,
  ShieldCheck,
  Bot,
  Settings2,
  X,
  Eye,
  EyeOff,
  RotateCcw,
  Save,
  LayoutTemplate,
  Target,
  Search,
  PieChart,
  Maximize2,
  Minimize2,
  Sparkles,
  RefreshCw,
  Paintbrush
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart as RePieChart,
  Cell,
  Pie
} from 'recharts';
import { useNavigate } from 'react-router-dom';

const revenueData = [
  { name: 'يناير', revenue: 40000, costs: 25000 },
  { name: 'فبراير', revenue: 45000, costs: 28000 },
  { name: 'مارس', revenue: 38000, costs: 30000 },
  { name: 'أبريل', revenue: 52000, costs: 31000 },
  { name: 'مايو', revenue: 48000, costs: 35000 },
  { name: 'يونيو', revenue: 60000, costs: 38000 },
];

const profitData = [
  { name: 'التوصيل الذكي', profit: 42000, status: 'ربح' },
  { name: 'متجر الرياض', profit: 15000, status: 'ربح' },
  { name: 'المستودعات', profit: -12000, status: 'خسارة' },
  { name: 'بوابة الدفع', profit: 28000, status: 'ربح' },
];

const initialTeamData = [
  { id: 'dept-1', name: 'تطوير البرمجيات', score: 92 },
  { id: 'dept-2', name: 'التصميم وتجربة المستخدم', score: 85 },
  { id: 'dept-3', name: 'الاستشارات التقنية', score: 78 },
  { id: 'dept-4', name: 'المبيعات والتسويق', score: 88 },
];

const customerSegmentData = [
  { name: 'شركات حكومية', value: 45 },
  { name: 'شركات ناشئة', value: 30 },
  { name: 'مؤسسات متوسطة', value: 25 },
];

const COLORS = ['#2563eb', '#6366f1', '#8b5cf6', '#ec4899'];

const StatCard = ({ title, value, icon: Icon, color, trend, trendValue, compact }: any) => (
  <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group ${compact ? 'p-4' : 'p-6'}`}>
    <div className="flex justify-between items-start mb-4">
      <div className={`p-2.5 rounded-xl bg-${color}-50 text-${color}-600 group-hover:scale-110 transition-transform`}>
        <Icon size={compact ? 20 : 24} />
      </div>
      <div className={`flex items-center gap-1 text-[10px] font-black ${trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
        {trendValue}%
        {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
      </div>
    </div>
    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">{title}</p>
    <h3 className={`${compact ? 'text-lg' : 'text-2xl'} font-black text-slate-800`}>{value}</h3>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  // تفعيل وضع التصميم بشكل افتراضي بناءً على طلب المستخدم
  const [isCustomizing, setIsCustomizing] = useState(true);
  
  const defaultLayout = {
    summary: true,
    actions: true,
    revenue_chart: true,
    profit_chart: true,
    team_efficiency: true,
    interventions: true,
    integrations: true,
    segments: true,
    isCompact: false
  };

  const [config, setConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('tech_erp_dashboard_v2');
      return saved ? JSON.parse(saved) : defaultLayout;
    } catch {
      return defaultLayout;
    }
  });

  // Filter team efficiency based on Organization settings
  const filteredTeamData = useMemo(() => {
    const hiddenDeptsRaw = localStorage.getItem('org_hidden_departments');
    const hiddenDepts: string[] = hiddenDeptsRaw ? JSON.parse(hiddenDeptsRaw) : [];
    return initialTeamData.filter(team => !hiddenDepts.includes(team.id));
  }, []);

  const toggleWidget = (id: string) => {
    const newConfig = { ...config, [id]: !config[id] };
    setConfig(newConfig);
    localStorage.setItem('tech_erp_dashboard_v2', JSON.stringify(newConfig));
  };

  const toggleDensity = () => {
    const newConfig = { ...config, isCompact: !config.isCompact };
    setConfig(newConfig);
    localStorage.setItem('tech_erp_dashboard_v2', JSON.stringify(newConfig));
  };

  const applyPreset = (preset: 'all' | 'finance' | 'ops') => {
    let newConfig = { ...defaultLayout };
    if (preset === 'finance') {
      newConfig = { ...defaultLayout, actions: false, team_efficiency: false, integrations: false };
    } else if (preset === 'ops') {
      newConfig = { ...defaultLayout, revenue_chart: false, profit_chart: false, segments: false };
    }
    setConfig(newConfig);
    localStorage.setItem('tech_erp_dashboard_v2', JSON.stringify(newConfig));
  };

  const resetConfig = () => {
    setConfig(defaultLayout);
    localStorage.setItem('tech_erp_dashboard_v2', JSON.stringify(defaultLayout));
  };

  const widgetLabels: Record<string, { label: string, icon: any, desc: string, cat: string }> = {
    summary: { label: 'مؤشرات الأداء المالي', icon: TrendingUp, desc: 'الأرباح، التكاليف، وكفاءة الإنجاز.', cat: 'بيانات رئيسية' },
    actions: { label: 'مركز الإجراءات السريعة', icon: Zap, desc: 'أزرار الاختصار للوظائف الحيوية.', cat: 'أدوات' },
    revenue_chart: { label: 'مخطط الإيرادات', icon: BarChart3, desc: 'تحليل التدفق النقدي الشهري.', cat: 'تحليل بصري' },
    profit_chart: { label: 'ربحية المشاريع', icon: DollarSign, desc: 'تحليل الربح والخسارة لكل مشروع.', cat: 'تحليل بصري' },
    team_efficiency: { label: 'كفاءة الفرق', icon: Target, desc: 'معدل إنجاز المهام للفرق التقنية.', cat: 'عمليات' },
    interventions: { label: 'تنبيهات التدخل', icon: AlertCircle, desc: 'المشاريع المتعثرة والميزانيات الحرجة.', cat: 'عمليات' },
    integrations: { label: 'حالة التكامل السحابي', icon: Layers, desc: 'مراقبة GitHub و AWS و Stripe.', cat: 'تقنية' },
    segments: { label: 'توزيع قطاعات العملاء', icon: PieChart, desc: 'تحليل حصة السوق حسب نوع العميل.', cat: 'تقنية' }
  };

  return (
    <div className={`space-y-8 animate-in fade-in duration-500 pb-12 relative ${config.isCompact ? 'max-w-[1600px] mx-auto' : ''}`}>
      
      {/* Customization Drawer (Design Mode) */}
      {isCustomizing && (
        <div className="fixed inset-0 z-[100] flex justify-start">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" 
            onClick={() => setIsCustomizing(false)}
          ></div>
          <div className="relative w-full max-w-md bg-white/95 backdrop-blur-xl h-full shadow-2xl animate-in slide-in-from-right duration-500 flex flex-col border-l border-slate-100" dir="rtl">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-100 relative">
                    <Settings2 size={24} />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white animate-pulse"></div>
                 </div>
                 <div>
                    <div className="flex items-center gap-2">
                       <h3 className="text-xl font-black text-slate-800 tracking-tight">هندسة لوحة التحكم</h3>
                       <span className="px-2 py-0.5 bg-blue-100 text-blue-600 rounded-lg text-[8px] font-black uppercase tracking-widest">Design Mode</span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-1">خصص تجربتك الإدارية الخاصة</p>
                 </div>
              </div>
              <button onClick={() => setIsCustomizing(false)} className="p-2 hover:bg-white rounded-xl transition-all text-slate-400">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-10 no-scrollbar">
               {/* Display Density */}
               <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Maximize2 size={14} /> نمط العرض
                  </h4>
                  <div 
                    onClick={toggleDensity}
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                      config.isCompact ? 'bg-indigo-50 border-indigo-200 shadow-sm' : 'bg-white border-slate-100'
                    }`}
                  >
                     <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${config.isCompact ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                           {config.isCompact ? <Minimize2 size={18}/> : <Maximize2 size={18}/>}
                        </div>
                        <div>
                           <p className="text-sm font-black text-slate-800">النمط المضغوط (Compact)</p>
                           <p className="text-[10px] text-slate-500">لعرض المزيد من البيانات في شاشة واحدة</p>
                        </div>
                     </div>
                     <div className={`w-10 h-5 rounded-full relative transition-colors ${config.isCompact ? 'bg-indigo-600' : 'bg-slate-200'}`}>
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${config.isCompact ? 'left-6' : 'left-1'}`}></div>
                     </div>
                  </div>
               </div>

               {/* Org Sync Status */}
               <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-[1.5rem] flex items-start gap-4">
                  <RefreshCw className="text-emerald-500 shrink-0 mt-1 animate-spin-slow" size={18} />
                  <div>
                    <p className="text-[10px] font-black text-emerald-800 uppercase tracking-widest mb-1">تزامن الهيكل التنظيمي</p>
                    <p className="text-[10px] text-emerald-600 leading-relaxed font-medium">سيتم تلقائياً تصفية بيانات الأقسام في لوحة التحكم بناءً على إعدادات "الهيكل التنظيمي".</p>
                  </div>
               </div>

               {/* Presets */}
               <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <LayoutTemplate size={14} /> قوالب العرض السريعة
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                     <button onClick={() => applyPreset('all')} className="py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-all">الكل</button>
                     <button onClick={() => applyPreset('finance')} className="py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-all">مالي</button>
                     <button onClick={() => applyPreset('ops')} className="py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-all">تشغيلي</button>
                  </div>
               </div>

               {/* Widgets List */}
               <div className="space-y-6">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Layers size={14} /> تحكم في ظهور الأدوات
                  </h4>
                  {Object.entries(widgetLabels).map(([id, info]) => (
                    <div 
                      key={id}
                      onClick={() => toggleWidget(id)}
                      className={`group flex items-start gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${
                        config[id] ? 'bg-white border-blue-200 shadow-md ring-2 ring-blue-50' : 'bg-slate-50 border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <div className={`p-2 rounded-xl shrink-0 transition-colors ${config[id] ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-400'}`}>
                         <info.icon size={20} />
                      </div>
                      <div className="flex-1 text-right">
                        <div className="flex justify-between items-center mb-0.5">
                          <span className={`text-sm font-black ${config[id] ? 'text-slate-800' : 'text-slate-500'}`}>{info.label}</span>
                          <div className={`w-10 h-5 rounded-full relative transition-colors ${config[id] ? 'bg-blue-600' : 'bg-slate-300'}`}>
                             <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${config[id] ? 'left-6' : 'left-1'}`}></div>
                          </div>
                        </div>
                        <p className="text-[10px] leading-relaxed text-slate-400">{info.desc}</p>
                      </div>
                    </div>
                  ))}
               </div>
            </div>

            <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex gap-3">
               <button 
                onClick={resetConfig}
                className="flex-1 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black text-xs hover:bg-slate-100 transition-all flex items-center justify-center gap-2 shadow-sm"
               >
                 <RotateCcw size={16} /> افتراضي
               </button>
               <button 
                onClick={() => setIsCustomizing(false)}
                className="flex-[2] py-4 bg-slate-900 text-white rounded-2xl font-black text-xs shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
               >
                 <Save size={16} /> اعتماد التغييرات
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
             <h2 className={`font-black text-slate-800 tracking-tighter ${config.isCompact ? 'text-2xl' : 'text-3xl'}`}>ذكاء الأعمال والتحليلات</h2>
             {isCustomizing && (
                <span className="flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-amber-200 animate-pulse">
                   <Paintbrush size={10} /> وضع التصميم نشط
                </span>
             )}
          </div>
          <p className="text-slate-500 font-medium">مراقبة استراتيجية لنمو الشركة مدعومة بالبيانات الحية.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 text-xs font-bold flex items-center gap-2 shadow-sm">
            <Calendar size={16} /> الربع الحالي
          </button>
          <button 
            onClick={() => setIsCustomizing(true)}
            className={`px-5 py-2.5 rounded-xl text-xs font-black shadow-lg transition-all flex items-center gap-2 active:scale-95 ${
              isCustomizing ? 'bg-amber-600 text-white shadow-amber-100' : 'bg-blue-600 text-white shadow-blue-100 hover:bg-blue-700'
            }`}
          >
            <Settings2 size={16} /> {isCustomizing ? 'تعديل لوحة التحكم' : 'تخصيص لوحة المعلومات'}
          </button>
        </div>
      </div>

      {/* Grid Content */}
      <div className={`grid gap-8 ${config.isCompact ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'}`}>
        {config.summary && (
          <>
            <StatCard title="صافي الأرباح" value="124,500 ر.س" icon={TrendingUp} color="blue" trend="up" trendValue="15.2" compact={config.isCompact} />
            <StatCard title="متوسط ربحية المشروع" value="31,200 ر.س" icon={DollarSign} color="emerald" trend="up" trendValue="5.4" compact={config.isCompact} />
            <StatCard title="تكاليف السحابة" value="4,850 ر.س" icon={Cloud} color="indigo" trend="down" trendValue="2.1" compact={config.isCompact} />
            <StatCard title="كفاءة الإنجاز" value="88.5%" icon={Zap} color="orange" trend="up" trendValue="3.8" compact={config.isCompact} />
          </>
        )}
      </div>

      {config.actions && (
        <div className={`bg-slate-900 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group animate-in zoom-in-95 duration-500 ${config.isCompact ? 'p-6' : 'p-10'}`}>
           <div className="absolute top-0 right-0 p-8 opacity-10"><Zap size={140} /></div>
           <div className="relative z-10">
              <h3 className="text-lg font-bold mb-8 flex items-center gap-3">
                 <ShieldCheck size={28} className="text-blue-400" /> مركز الاختصارات التنفيذية
              </h3>
              <div className={`grid gap-4 ${config.isCompact ? 'grid-cols-4 md:grid-cols-8' : 'grid-cols-2 md:grid-cols-4'}`}>
                 {[
                   { label: 'عرض سعر', icon: FileText, to: '/customers', color: 'bg-blue-500' },
                   { label: 'إصدار فاتورة', icon: DollarSign, to: '/finance', color: 'bg-emerald-500' },
                   { label: 'مهمة تقنية', icon: Plus, to: '/todo', color: 'bg-indigo-500' },
                   { label: 'تحليل AI', icon: Bot, to: '/ai-assistant', color: 'bg-rose-500' },
                 ].map((action, i) => (
                   <button 
                    key={i}
                    onClick={() => navigate(action.to)}
                    className={`bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all flex items-center gap-3 group/btn ${config.isCompact ? 'p-3 flex-col text-center' : 'p-5'}`}
                   >
                      <div className={`p-2.5 rounded-xl ${action.color} group-hover/btn:scale-110 transition-transform`}>
                         <action.icon size={20} />
                      </div>
                      <span className="text-xs font-bold">{action.label}</span>
                   </button>
                 ))}
              </div>
           </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {config.revenue_chart && (
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-black text-slate-800 flex items-center gap-3">
                  <BarChart3 size={24} className="text-blue-600" /> الإيرادات والمصروفات
                </h3>
                <div className="flex gap-4 text-[10px] font-black uppercase tracking-widest">
                  <span className="flex items-center gap-1.5 text-blue-600"><div className="w-2 h-2 rounded-full bg-blue-600"></div> دخل</span>
                  <span className="flex items-center gap-1.5 text-rose-500"><div className="w-2 h-2 rounded-full bg-rose-500"></div> مصروفات</span>
                </div>
              </div>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 'bold'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                    <Tooltip />
                    <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                    <Area type="monotone" dataKey="costs" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorCost)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          <div className={`grid gap-8 ${config.isCompact ? 'grid-cols-2' : 'grid-cols-1 md:grid-cols-2'}`}>
             {config.profit_chart && (
               <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
                  <h3 className="text-sm font-black text-slate-800 mb-8 border-r-4 border-blue-500 pr-4 uppercase tracking-tighter">ربحية المشاريع النشطة</h3>
                  <div className="h-[250px]">
                     <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={profitData} layout="vertical">
                           <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                           <XAxis type="number" hide />
                           <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10, fontWeight: 'bold'}} width={80} />
                           <Tooltip />
                           <Bar dataKey="profit" radius={[0, 4, 4, 0]}>
                              {profitData.map((entry, index) => (
                                 <Cell key={`cell-${index}`} fill={entry.profit > 0 ? '#10b981' : '#f43f5e'} />
                              ))}
                           </Bar>
                        </BarChart>
                     </ResponsiveContainer>
                  </div>
               </div>
             )}

             {config.team_efficiency && (
               <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
                  <h3 className="text-sm font-black text-slate-800 mb-8 border-r-4 border-indigo-500 pr-4 uppercase tracking-tighter">كفاءة الفرق التقنية</h3>
                  <div className="space-y-6">
                     {filteredTeamData.length > 0 ? filteredTeamData.map((team, i) => (
                        <div key={i} className="space-y-2 animate-in slide-in-from-right-2 duration-300">
                           <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-slate-500">
                              <span>{team.name}</span>
                              <span className="text-blue-600">{team.score}%</span>
                           </div>
                           <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden shadow-inner">
                              <div className="h-full bg-blue-600 transition-all duration-1000 shadow-sm" style={{ width: `${team.score}%` }}></div>
                           </div>
                        </div>
                     )) : (
                       <div className="text-center py-10">
                          <p className="text-xs text-slate-400 font-bold italic">لا توجد أقسام محددة للعرض. راجع إعدادات الهيكل التنظيمي.</p>
                       </div>
                     )}
                  </div>
                  <button onClick={() => navigate('/organization')} className="w-full mt-10 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-indigo-600 hover:text-white transition-all shadow-sm">إدارة الأقسام</button>
               </div>
             )}
          </div>
        </div>

        <div className="space-y-8">
          {config.interventions && (
            <div className="bg-rose-50 border border-rose-100 p-8 rounded-[2.5rem] relative overflow-hidden group animate-in fade-in slide-in-from-left-4 duration-500">
              <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12 group-hover:scale-110 transition-transform"><AlertCircle size={80} /></div>
              <div className="flex items-center gap-3 text-rose-600 mb-6">
                <AlertCircle size={24} className="animate-pulse" />
                <h3 className="font-black text-sm uppercase tracking-widest">تنبيهات التدخل المالي</h3>
              </div>
              <div className="space-y-4">
                 <div className="p-5 bg-white rounded-2xl border border-rose-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                       <p className="text-xs font-black text-slate-800">نظام إدارة المستودعات</p>
                       <span className="text-[10px] font-black text-rose-600">-12,000 ر.س</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mb-4 font-bold uppercase tracking-widest">تجاوز الميزانية بنسبة 8%</p>
                    <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden shadow-inner">
                       <div className="h-full bg-rose-500 shadow-lg shadow-rose-200" style={{ width: '100%' }}></div>
                    </div>
                 </div>
              </div>
              <button className="w-full mt-6 py-4 bg-rose-600 text-white rounded-2xl text-xs font-black hover:bg-rose-700 shadow-xl shadow-rose-100 transition-all active:scale-95">مراجعة تقرير الخسارة</button>
            </div>
          )}

          {config.integrations && (
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm animate-in fade-in slide-in-from-left-4 duration-500 delay-75">
              <h3 className="text-sm font-black text-slate-800 mb-8 flex items-center gap-3">
                <Layers size={22} className="text-indigo-600" /> الحالة السحابية (API)
              </h3>
              <div className="space-y-4">
                {[
                  { name: 'GitHub Enterprise', icon: Github, color: 'text-slate-800' },
                  { name: 'AWS Production', icon: Cloud, color: 'text-amber-500' },
                  { name: 'Stripe Payments', icon: FileText, color: 'text-blue-600' }
                ].map((int, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-indigo-50 transition-colors cursor-pointer group">
                     <div className="flex items-center gap-4">
                       <div className={`p-2.5 bg-white rounded-xl shadow-sm ${int.color} group-hover:scale-110 transition-transform`}><int.icon size={18} /></div>
                       <span className="text-xs font-bold text-slate-700">{int.name}</span>
                     </div>
                     <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {config.segments && (
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm animate-in fade-in slide-in-from-left-4 duration-500 delay-150">
              <h3 className="text-sm font-black text-slate-800 mb-8 flex items-center gap-3 uppercase tracking-tighter">الحصة السوقية (AI)</h3>
              <div className="h-[200px]">
                 <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                       <Pie
                          data={customerSegmentData}
                          innerRadius={60}
                          outerRadius={85}
                          paddingAngle={8}
                          dataKey="value"
                       >
                          {customerSegmentData.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                       </Pie>
                       <Tooltip />
                    </RePieChart>
                 </ResponsiveContainer>
              </div>
              <div className="space-y-3 mt-6">
                 {customerSegmentData.map((c, i) => (
                    <div key={i} className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                       <span className="flex items-center gap-2 text-slate-500"><div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: COLORS[i]}}></div> {c.name}</span>
                       <span className="text-slate-700 font-mono">{c.value}%</span>
                    </div>
                 ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Empty State */}
      {Object.entries(config).filter(([k,v]) => k !== 'isCompact' && v === true).length === 0 && (
        <div className="py-32 text-center bg-white rounded-[3rem] border border-slate-100 shadow-inner animate-in zoom-in-95 duration-500">
           <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-10 shadow-lg shadow-blue-50">
             <EyeOff size={48} className="text-blue-300" />
           </div>
           <h4 className="text-2xl font-black text-slate-800 mb-4 tracking-tighter">لوحة معلومات فارغة</h4>
           <p className="text-slate-500 text-sm mb-12 max-w-sm mx-auto leading-relaxed font-medium">لقد قمت بإخفاء كافة الأدوات. يمكنك استخدام قائمة التخصيص لبناء لوحتك الخاصة مجدداً.</p>
           <button 
             onClick={() => setIsCustomizing(true)}
             className="px-12 py-5 bg-blue-600 text-white rounded-3xl font-black text-sm shadow-2xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 flex items-center gap-4 mx-auto"
           >
             <Sparkles size={20} /> بناء اللوحة الآن
           </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
