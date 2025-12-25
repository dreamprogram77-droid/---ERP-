
import React, { useState, useMemo, useEffect } from 'react';
import { ProjectStatus, Project, Milestone, Task, ProjectResource, TimeLog } from '../types';
import { 
  Briefcase, 
  Search, 
  Filter, 
  Plus, 
  Clock, 
  CheckCircle2, 
  Github, 
  Cloud, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Calendar, 
  ChevronLeft, 
  MoreVertical, 
  AlertCircle, 
  LayoutGrid, 
  List as ListIcon, 
  ChevronRight, 
  Target, 
  Layers, 
  FileText, 
  X, 
  Save, 
  Check, 
  Edit3, 
  Trash2, 
  Play, 
  Square, 
  Timer, 
  Cpu, 
  UserPlus, 
  Zap, 
  BarChart3, 
  ArrowUpRight, 
  PieChart, 
  Download, 
  ShieldCheck, 
  Award, 
  AlertTriangle, 
  UserCog, 
  ShieldAlert, 
  Bug, 
  Sparkles, 
  Loader2, 
  RefreshCw, 
  FileBarChart, 
  Link as LinkIcon, 
  Trello, 
  Maximize2,
  History,
  Activity,
  Wallet,
  ArrowRightLeft,
  Server
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { getProjectFinancialAnalysis, fetchExternalTasks } from '../services/geminiService';
import { storageService } from '../services/storageService';

const initialMockProjects: Project[] = [
  {
    id: '1',
    name: 'تطبيق التوصيل الذكي',
    client: 'شركة الأغذية المتحدة',
    clientId: 'c1',
    deadline: '2024-03-15',
    status: ProjectStatus.IN_PROGRESS,
    progress: 65,
    budget: 250000,
    actualCost: 165000,
    profit: 85000,
    team: ['1', '4'],
    projectManager: 'محمد علي',
    technicalLead: 'سارة خالد',
    qaEngineer: 'فهد الأحمد',
    contractId: 'c1',
    repoUrl: 'https://github.com/tech-corp/delivery-app',
    cloudCost: 1200,
    totalHours: 420,
    costHistory: [
      { date: '2023-01', budget: 50000, actual: 42000 },
      { date: '2023-02', budget: 50000, actual: 48000 },
      { date: '2023-03', budget: 50000, actual: 55000 },
      { date: '2023-04', budget: 50000, actual: 38000 },
      { date: '2023-05', budget: 50000, actual: 45000 },
      { date: '2023-06', budget: 50000, actual: 62000 },
    ],
    milestones: [
      { id: 'm1', name: 'تصميم الهوية وتجربة المستخدم', dueDate: '2023-10-01', completed: true, cost: 20000 },
      { id: 'm2', name: 'إطلاق النسخة التجريبية (MVP)', dueDate: '2023-12-15', completed: false, cost: 80000 }
    ],
    tasks: [
      { id: 't1', title: 'مزامنة الخرائط الحية', assignedTo: 'سارة خالد', status: 'completed', hours: 45, dueDate: '2023-11-20', timeLogs: [] },
      { id: 't2', title: 'تحسين أداء الواجهة الأمامية', assignedTo: 'سارة خالد', status: 'pending', hours: 20, dueDate: '2023-11-25', timeLogs: [] }
    ],
    resources: [
      { id: 'r1', role: 'مطور واجهات أمامية (Senior)', allocatedMember: 'سارة خالد', allocationPercentage: 80, status: 'مكتمل', requiredSkills: ['React', 'TypeScript', 'Tailwind'] },
      { id: 'r2', role: 'مهندس بنية تحتية (DevOps)', allocatedMember: 'عمر ياسين', allocationPercentage: 40, status: 'مكتمل', requiredSkills: ['AWS', 'Docker', 'CI/CD'] },
      { id: 'r3', role: 'مصمم تجربة مستخدم (Senior UI/UX)', status: 'قيد البحث', allocationPercentage: 0, requiredSkills: ['Figma', 'Prototyping'] }
    ],
    connectedTool: 'Jira'
  },
  {
    id: '2',
    name: 'نظام إدارة المستودعات (WMS)',
    client: 'لوجستيك العرب',
    clientId: 'c3',
    deadline: '2023-12-30',
    status: ProjectStatus.TESTING,
    progress: 90,
    budget: 150000,
    actualCost: 145000,
    profit: 5000,
    team: ['4', '2'],
    projectManager: 'سلطان القحطاني',
    technicalLead: 'عمر ياسين',
    qaEngineer: 'هند خالد',
    contractId: 'c3',
    repoUrl: 'https://github.com/tech-corp/wms-system',
    cloudCost: 2500,
    totalHours: 580,
    milestones: [],
    tasks: [],
    resources: [],
    costHistory: []
  }
];

const BudgetOverviewSection = ({ project }: { project: Project }) => {
  const remaining = project.budget - project.actualCost;
  const burnRate = Math.round((project.actualCost / project.budget) * 100);
  const isWarning = burnRate > 85;
  const isOver = burnRate > 100;

  const categoryData = [
    { name: 'رواتب تقنية', value: Math.round(project.actualCost * 0.7) },
    { name: 'بنية سحابية', value: Math.round(project.actualCost * 0.15) },
    { name: 'تراخيص', value: Math.round(project.actualCost * 0.1) },
    { name: 'أخرى', value: Math.round(project.actualCost * 0.05) },
  ];

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-100">
             <Wallet size={24} />
           </div>
           <div>
             <h3 className="text-xl font-black text-slate-800">تحليل الميزانية الفعلي</h3>
             <p className="text-xs text-slate-500 font-medium mt-1">مقارنة التكاليف التشغيلية مقابل الميزانية المرصودة</p>
           </div>
        </div>
        <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
          isOver ? 'bg-rose-50 border-rose-200 text-rose-600' :
          isWarning ? 'bg-amber-50 border-amber-200 text-amber-600' :
          'bg-emerald-50 border-emerald-200 text-emerald-600'
        }`}>
          {isOver ? 'تجاوز حرج' : isWarning ? 'ميزانية محدودة' : 'حالة ممتازة'}
        </div>
      </div>

      <div className="p-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 hover:bg-white hover:shadow-md transition-all group">
              <p className="text-[10px] text-slate-400 font-black uppercase mb-1 flex items-center gap-1">
                <Target size={12} className="text-blue-500" /> الميزانية الكلية
              </p>
              <p className="text-xl font-black text-slate-800 tracking-tighter">{project.budget.toLocaleString()} <span className="text-[10px] opacity-40 font-bold">ر.س</span></p>
           </div>
           <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 hover:bg-white hover:shadow-md transition-all group">
              <p className="text-[10px] text-slate-400 font-black uppercase mb-1 flex items-center gap-1">
                <ArrowRightLeft size={12} className="text-rose-500" /> الإنفاق الحالي
              </p>
              <p className="text-xl font-black text-slate-800 tracking-tighter">{project.actualCost.toLocaleString()} <span className="text-[10px] opacity-40 font-bold">ر.س</span></p>
           </div>
           <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 hover:bg-white hover:shadow-md transition-all group">
              <p className="text-[10px] text-slate-400 font-black uppercase mb-1 flex items-center gap-1">
                <Clock size={12} className="text-indigo-500" /> المتبقي
              </p>
              <p className={`text-xl font-black tracking-tighter ${remaining < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                {remaining.toLocaleString()} <span className="text-[10px] opacity-40 font-bold">ر.س</span>
              </p>
           </div>
           <div className="bg-slate-900 p-6 rounded-3xl shadow-xl flex items-center justify-between">
              <div>
                <p className="text-[10px] text-blue-300 font-black uppercase mb-1">نسبة الاستهلاك</p>
                <p className="text-2xl font-black text-white">{burnRate}%</p>
              </div>
              <Activity className={`${isOver ? 'text-rose-500' : isWarning ? 'text-amber-500' : 'text-emerald-500'} animate-pulse`} size={32} />
           </div>
        </div>
      </div>
    </div>
  );
};

const ProjectFinancialChart = ({ history }: { history: any[] }) => {
  const [timeframe, setTimeframe] = useState<'monthly' | 'quarterly'>('monthly');

  const chartData = useMemo(() => {
    if (timeframe === 'monthly') {
      return history.map(item => ({
        name: item.date,
        'الميزانية المحددة': item.budget,
        'التكلفة الفعلية': item.actual
      }));
    } else {
      const quarters: Record<string, { budget: number, actual: number }> = {};
      history.forEach(item => {
        const [year, month] = item.date.split('-');
        const quarter = `Q${Math.ceil(parseInt(month) / 3)} ${year}`;
        if (!quarters[quarter]) {
          quarters[quarter] = { budget: 0, actual: 0 };
        }
        quarters[quarter].budget += item.budget;
        quarters[quarter].actual += item.actual;
      });
      return Object.entries(quarters).map(([name, vals]) => ({
        name,
        'الميزانية المحددة': vals.budget,
        'التكلفة الفعلية': vals.actual
      }));
    }
  }, [history, timeframe]);

  return (
    <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
           <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
             <BarChart3 size={20} />
           </div>
           <div>
             <h4 className="text-sm font-black text-slate-800 tracking-tight">تحليل التكلفة مقابل الميزانية</h4>
           </div>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl shadow-inner shrink-0">
          <button 
            onClick={() => setTimeframe('monthly')}
            className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${timeframe === 'monthly' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            شهرياً
          </button>
          <button 
            onClick={() => setTimeframe('quarterly')}
            className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${timeframe === 'quarterly' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            ربع سنوي
          </button>
        </div>
      </div>

      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorBudget" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
            <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
            <Tooltip />
            <Area type="monotone" dataKey="الميزانية المحددة" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorBudget)" />
            <Area type="monotone" dataKey="التكلفة الفعلية" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorActual)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const Projects = () => {
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // تحميل البيانات من محاكي الباك اند عند البداية
  useEffect(() => {
    const data = storageService.initIfEmpty(initialMockProjects);
    setAllProjects(data);
    setIsLoaded(true);
  }, []);

  const [view, setView] = useState<'grid' | 'list'>(() => {
    const savedView = localStorage.getItem('erp_projects_display_mode');
    return (savedView === 'grid' || savedView === 'list') ? savedView : 'grid';
  });

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [activeTimers, setActiveTimers] = useState<Record<string, number>>({}); 
  const [currentTime, setCurrentTime] = useState(Date.now());

  const [isReportLoading, setIsReportLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [reportContent, setReportContent] = useState<string | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [viewingHistoryTask, setViewingHistoryTask] = useState<Task | null>(null);

  useEffect(() => {
    let interval: any;
    if (Object.keys(activeTimers).length > 0) {
      interval = setInterval(() => {
        setCurrentTime(Date.now());
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeTimers]);

  const handleStartTimer = (taskId: string) => {
    if (Object.keys(activeTimers).length > 0) {
      alert('لديك مؤقت نشط بالفعل. يرجى إيقافه قبل بدء عمل جديد.');
      return;
    }
    setActiveTimers(prev => ({ ...prev, [taskId]: Date.now() }));
  };

  const handleStopTimer = (taskId: string) => {
    const startTime = activeTimers[taskId];
    if (!startTime || !selectedProject) return;

    const endNow = Date.now();
    const elapsedMs = endNow - startTime;
    const elapsedHours = elapsedMs / (1000 * 60 * 60);

    const newLog: TimeLog = {
      id: 'log-' + Date.now(),
      startTime: new Date(startTime).toLocaleTimeString('ar-SA'),
      endTime: new Date(endNow).toLocaleTimeString('ar-SA'),
      duration: Number(elapsedHours.toFixed(2)),
      note: 'جلسة تتبع وقت تلقائية'
    };

    const updatedTasks = selectedProject.tasks.map(t => 
      t.id === taskId ? { 
        ...t, 
        hours: Number((t.hours + elapsedHours).toFixed(2)),
        timeLogs: [...(t.timeLogs || []), newLog]
      } : t
    );

    const updatedProject = { 
      ...selectedProject, 
      tasks: updatedTasks,
      totalHours: Number(((selectedProject.totalHours || 0) + elapsedHours).toFixed(2))
    };
    
    // المزامنة مع محاكي الباك اند
    storageService.saveProject(updatedProject);
    setSelectedProject(updatedProject);
    setAllProjects(prev => prev.map(p => p.id === selectedProject.id ? updatedProject : p));
    
    const newTimers = { ...activeTimers };
    delete newTimers[taskId];
    setActiveTimers(newTimers);
  };

  const formatDuration = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const handleUpdateProject = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updatedData: Partial<Project> = {
      name: formData.get('name') as string,
      client: formData.get('client') as string,
      deadline: formData.get('deadline') as string,
      budget: Number(formData.get('budget')),
      status: formData.get('status') as ProjectStatus,
    };

    if (selectedProject) {
      const updated = { ...selectedProject, ...updatedData };
      storageService.saveProject(updated);
      setAllProjects(allProjects.map(p => p.id === selectedProject.id ? updated : p));
      setSelectedProject(updated);
    } else {
      const newProj: Project = {
        id: 'pj' + Date.now(),
        name: updatedData.name || '',
        client: updatedData.client || '',
        deadline: updatedData.deadline || '',
        status: updatedData.status || ProjectStatus.PLANNING,
        clientId: 'internal',
        actualCost: 0,
        profit: updatedData.budget || 0,
        budget: updatedData.budget || 0,
        progress: 0,
        team: ['1'],
        milestones: [],
        tasks: [],
        resources: [],
        costHistory: []
      };
      storageService.saveProject(newProj);
      setAllProjects([newProj, ...allProjects]);
    }
    setIsEditModalOpen(false);
  };

  const activeTaskId = Object.keys(activeTimers)[0];
  const activeTask = selectedProject?.tasks.find(t => t.id === activeTaskId);

  if (!isLoaded) return <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin text-blue-600" /></div>;

  if (selectedProject) {
    return (
      <div className="space-y-8 animate-in slide-in-from-left-4 duration-500 pb-32">
        <div className="flex items-center justify-between">
          <button onClick={() => setSelectedProject(null)} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors font-bold group">
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> العودة للمشاريع
          </button>
          <div className="flex gap-3">
             <button onClick={() => setIsEditModalOpen(true)} className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-black shadow-lg flex items-center gap-2">
               <Edit3 size={16} /> تعديل المشروع
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           <div className="lg:col-span-8 p-8 rounded-[3rem] border border-slate-100 bg-white shadow-sm flex flex-col md:flex-row gap-10 items-center">
              <div className="w-28 h-28 rounded-[2.5rem] bg-blue-50 text-blue-600 flex items-center justify-center shadow-blue-100 shrink-0">
                 <Briefcase size={56} />
              </div>
              <div className="flex-1 text-center md:text-right relative z-10">
                 <div className="flex items-center justify-center md:justify-start gap-3 mb-2 flex-wrap">
                    <h1 className="text-3xl font-black text-slate-800 tracking-tighter">{selectedProject.name}</h1>
                    <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-100 text-blue-600">{selectedProject.status}</span>
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 text-white rounded-xl text-[10px] font-black uppercase shadow-sm">
                       <History size={12} /> {selectedProject.totalHours || 0} ساعة عمل مسجلة
                    </div>
                 </div>
                 <p className="text-slate-500 font-bold text-lg">{selectedProject.client} • التسليم: {selectedProject.deadline}</p>
              </div>
           </div>

           <div className="lg:col-span-4 rounded-[3rem] p-8 text-white bg-emerald-600 shadow-2xl flex flex-col justify-between group">
              <div className="relative z-10">
                 <p className="text-xs font-bold opacity-80 uppercase tracking-widest mb-1">الربحية المقدرة</p>
                 <h3 className="text-4xl font-black tracking-tighter">
                   {selectedProject.profit.toLocaleString()} <span className="text-sm font-bold opacity-60">ر.س</span>
                 </h3>
              </div>
           </div>
        </div>

        <BudgetOverviewSection project={selectedProject} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
               <div className="p-8 border-b border-slate-100 bg-slate-50/30 flex justify-between items-center">
                  <h3 className="font-black text-slate-800 flex items-center gap-2">المهام التنفيذية وتتبع الوقت</h3>
                  <button onClick={() => setIsTaskModalOpen(true)} className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl hover:bg-blue-100 transition-all">+ مهمة جديدة</button>
               </div>
               <div className="p-8 space-y-4">
                     {selectedProject.tasks.map(task => {
                       const isTimerRunning = !!activeTimers[task.id];
                       return (
                        <div key={task.id} className={`p-5 rounded-3xl border transition-all duration-300 ${
                          isTimerRunning ? 'bg-blue-50 border-blue-300 ring-4 ring-blue-500/5' : 'bg-white border-slate-100'
                        } flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm`}>
                           <div className="flex items-center gap-4 flex-1">
                              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                                task.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : isTimerRunning ? 'bg-blue-600 text-white animate-pulse' : 'bg-blue-50 text-blue-500'
                              }`}>
                                 {task.status === 'completed' ? <CheckCircle2 size={24}/> : <Timer size={24}/>}
                              </div>
                              <div className="flex-1 min-w-0">
                                 <p className={`text-sm font-black truncate ${task.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{task.title}</p>
                                 <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                                   <span className="flex items-center gap-1"><Users size={12}/> {task.assignedTo}</span>
                                   <button onClick={() => setViewingHistoryTask(task)} className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                                      <Clock size={12}/> {task.hours} ساعة <ChevronRight size={10} className="rotate-180" />
                                   </button>
                                 </div>
                              </div>
                           </div>
                           
                           <div className="flex items-center gap-3 justify-end bg-slate-100/50 p-2 rounded-2xl border border-slate-200/50">
                              {isTimerRunning && (
                                <div className="text-xs font-black text-blue-600 font-mono px-3 py-1 bg-white rounded-lg shadow-sm border border-blue-100">
                                  {formatDuration(currentTime - activeTimers[task.id])}
                                </div>
                              )}
                              <button 
                                onClick={() => isTimerRunning ? handleStopTimer(task.id) : handleStartTimer(task.id)}
                                disabled={task.status === 'completed'}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black transition-all shadow-md active:scale-95 disabled:opacity-30 ${
                                  isTimerRunning ? 'bg-rose-600 text-white' : 'bg-blue-600 text-white'
                                }`}
                              >
                                {isTimerRunning ? <><Square size={14} fill="currentColor" /> إيقاف</> : <><Play size={14} fill="currentColor" /> بدء العمل</>}
                              </button>
                           </div>
                        </div>
                       );
                     })}
               </div>
            </div>
          </div>
        </div>

        {/* Floating Active Timer Bar */}
        {activeTaskId && activeTask && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[150] w-full max-w-2xl px-4 animate-in slide-in-from-bottom-10 duration-500">
             <div className="bg-slate-900 text-white p-4 rounded-[2rem] shadow-2xl border border-blue-500/30 flex items-center justify-between gap-6 ring-8 ring-blue-500/5">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                   <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center animate-pulse shadow-lg shadow-blue-500/20">
                      <Activity size={24} />
                   </div>
                   <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest mb-0.5">جاري تتبع الوقت:</p>
                      <h4 className="text-sm font-black truncate">{activeTask.title}</h4>
                   </div>
                </div>
                <div className="flex items-center gap-6">
                   <div className="text-center bg-white/5 px-4 py-2 rounded-2xl border border-white/10">
                      <p className="text-xl font-black text-blue-400 font-mono tracking-tighter leading-none">
                         {formatDuration(currentTime - activeTimers[activeTaskId])}
                      </p>
                   </div>
                   <button onClick={() => handleStopTimer(activeTaskId)} className="p-4 bg-rose-600 text-white rounded-2xl hover:bg-rose-700 transition-all shadow-xl active:scale-95">
                      <Square size={24} fill="currentColor" />
                   </button>
                </div>
             </div>
          </div>
        )}
      </div>
    );
  }

  const filteredProjects = allProjects.filter(p => p.name.includes(searchTerm) || p.client.includes(searchTerm));

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tighter">إدارة العمليات والمشاريع</h2>
          <p className="text-slate-500 font-medium">بياناتك محفوظة بشكل دائم في محاكي الباك اند المحلي.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-black shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all flex items-center gap-2"
          >
            <Plus size={20} /> مشروع جديد
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="بحث..." 
            className="w-full pr-12 pl-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredProjects.map(project => (
          <div 
            key={project.id}
            onClick={() => setSelectedProject(project)}
            className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm hover:shadow-xl transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Briefcase size={24} />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1 truncate">{project.name}</h3>
            <p className="text-[11px] text-slate-400 font-bold mb-4">{project.client}</p>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-black uppercase">
                  <span className="text-slate-400">الإنجاز</span>
                  <span className="text-slate-700">{project.progress}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: `${project.progress}%` }}></div>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
                 <p className="text-xs font-black text-emerald-600">{project.budget.toLocaleString()} ر.س</p>
                 <div className="flex -space-x-2 rtl:space-x-reverse">
                    {project.team.map(id => <div key={id} className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white shadow-sm" />)}
                 </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isEditModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
           <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-300 my-8">
              <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                 <h3 className="text-xl font-black text-slate-800">{selectedProject ? 'تعديل المشروع' : 'مشروع جديد'}</h3>
                 <button onClick={() => setIsEditModalOpen(false)} className="p-2 text-slate-400 hover:text-rose-500"><X size={24} /></button>
              </div>
              <form onSubmit={handleUpdateProject} className="p-8 space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">المسمى</label>
                       <input name="name" required defaultValue={selectedProject?.name} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">العميل</label>
                       <input name="client" required defaultValue={selectedProject?.client} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">الميزانية</label>
                       <input name="budget" type="number" required defaultValue={selectedProject?.budget} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">تاريخ التسليم</label>
                       <input name="deadline" type="date" required defaultValue={selectedProject?.deadline} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none" />
                    </div>
                 </div>
                 <button type="submit" className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl hover:bg-blue-700 transition-all active:scale-95">حفظ التغييرات في الباك اند المحاكي</button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
