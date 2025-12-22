
import React, { useState, useMemo, useEffect } from 'react';
import { ProjectStatus, Project, Milestone, Task, ProjectResource } from '../types';
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
  Trello
} from 'lucide-react';
import { getProjectFinancialAnalysis, fetchExternalTasks } from '../services/geminiService';

const mockProjects: Project[] = [
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
    milestones: [
      { id: 'm1', name: 'تصميم الهوية وتجربة المستخدم', dueDate: '2023-10-01', completed: true, cost: 20000 },
      { id: 'm2', name: 'إطلاق النسخة التجريبية (MVP)', dueDate: '2023-12-15', completed: false, cost: 80000 }
    ],
    tasks: [
      { id: 't1', title: 'مزامنة الخرائط الحية', assignedTo: 'سارة خالد', status: 'completed', hours: 45, dueDate: '2023-11-20' },
      { id: 't2', title: 'تحسين أداء الواجهة الأمامية', assignedTo: 'سارة خالد', status: 'pending', hours: 20, dueDate: '2023-11-25' }
    ],
    resources: [
      { id: 'r1', role: 'مطور واجهات أمامية (Senior)', allocatedMember: 'سارة خالد', allocationPercentage: 80, status: 'مكتمل', requiredSkills: ['React', 'TypeScript', 'Tailwind'] },
      { id: 'r2', role: 'مهندس بنية تحتية (DevOps)', allocatedMember: 'عمر ياسين', allocationPercentage: 40, status: 'مكتمل', requiredSkills: ['AWS', 'Docker', 'CI/CD'] },
      { id: 'r3', role: 'مصمم تجربة مستخدم (Senior UI/UX)', status: 'قيد البحث', allocationPercentage: 0, requiredSkills: ['Figma', 'Prototyping'] },
      { id: 'r4', role: 'مطور أنظمة خلفية (Go/Node)', status: 'عجز', allocationPercentage: 0, requiredSkills: ['Microservices', 'PostgreSQL'] }
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
    milestones: [
      { id: 'm3', name: 'ربط مستشعرات IoT', dueDate: '2023-11-20', completed: true, cost: 40000 }
    ],
    tasks: [],
    resources: [
      { id: 'r5', role: 'مدير مشروع تقني', allocatedMember: 'محمد علي', allocationPercentage: 100, status: 'مكتمل', requiredSkills: ['Agile', 'Jira'] }
    ]
  }
];

const ProjectCard = ({ project, onClick }: { project: Project; onClick: () => void; key?: any }) => {
  const isLowProfit = project.profit < (project.budget * 0.1);
  const resourceCount = project.resources?.length || 0;
  const allocatedCount = project.resources?.filter(r => r.status === 'مكتمل').length || 0;

  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-[2rem] border p-6 shadow-sm hover:shadow-xl transition-all cursor-pointer group relative overflow-hidden ${
        isLowProfit 
          ? 'border-red-400 bg-red-50/30 hover:bg-red-50/50' 
          : 'border-slate-100 hover:border-blue-200'
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
          isLowProfit ? 'bg-red-100 text-red-600 shadow-sm' : 'bg-blue-50 text-blue-600'
        }`}>
          {isLowProfit ? <AlertTriangle size={24} /> : <Briefcase size={24} />}
        </div>
        <div className="flex gap-1.5 items-center">
          <div className="px-2 py-1 bg-slate-50 text-slate-400 text-[8px] font-black rounded-lg border border-slate-100 flex items-center gap-1">
             <Users size={10} /> {allocatedCount}/{resourceCount} موارد
          </div>
          {isLowProfit && (
            <span className="px-2 py-0.5 bg-red-600 text-white text-[8px] font-black rounded-full animate-pulse uppercase tracking-widest">تحذير: ربحية منخفضة</span>
          )}
        </div>
      </div>

      <div className="mb-1">
        <h3 className={`text-base font-bold transition-colors flex flex-wrap items-center gap-2 ${
          isLowProfit ? 'text-red-800' : 'text-slate-800 group-hover:text-blue-600'
        }`}>
          <span className="flex-1 min-w-0 truncate">{project.name}</span>
          <span className={`text-[11px] font-black px-3 py-1 rounded-xl whitespace-nowrap shadow-sm border ${
            isLowProfit 
              ? 'bg-red-600 text-white border-red-700' 
              : 'bg-slate-900 text-white border-slate-800'
          }`}>
             {project.budget.toLocaleString()} ر.س
          </span>
        </h3>
      </div>
      <p className="text-[11px] text-slate-400 font-bold mb-6">{project.client}</p>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
            <span className="text-slate-400">الإنجاز التقني</span>
            <span className={isLowProfit ? 'text-red-600' : 'text-slate-700'}>{project.progress}%</span>
          </div>
          <div className="h-2 w-full bg-slate-100/50 rounded-full overflow-hidden shadow-inner">
            <div 
              className={`h-full transition-all duration-1000 ${
                project.progress > 80 ? 'bg-emerald-500' : isLowProfit ? 'bg-red-500' : 'bg-blue-500'
              }`} 
              style={{ width: `${project.progress}%` }}
            ></div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-slate-50/50">
          <div className="text-right">
            <p className="text-[9px] text-slate-400 font-black uppercase">صافي الربح الفعلي</p>
            <p className={`text-xs font-black flex items-center gap-1 ${
              isLowProfit ? 'text-red-600' : 'text-emerald-600'
            }`}>
              {project.profit < 0 ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
              {project.profit.toLocaleString()} ر.س
            </p>
          </div>
          <div className="flex -space-x-2 rtl:space-x-reverse">
             {project.team.map((id) => (
               <img key={id} src={`https://picsum.photos/seed/${id}/32/32`} className="w-7 h-7 rounded-full border-2 border-white shadow-sm" alt="team" />
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProjectListItem = ({ project, onClick }: { project: Project; onClick: () => void; key?: any }) => {
  const isLowProfit = project.profit < (project.budget * 0.1);
  
  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-2xl border p-4 shadow-sm hover:shadow-md transition-all cursor-pointer group flex items-center gap-6 ${
        isLowProfit ? 'border-red-100 bg-red-50/20' : 'border-slate-100'
      }`}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
        isLowProfit ? 'bg-red-100 text-red-600' : 'bg-blue-50 text-blue-600'
      }`}>
        <Briefcase size={20} />
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold text-slate-800 truncate">{project.name}</h4>
        <p className="text-[10px] text-slate-400 font-bold">{project.client}</p>
      </div>

      <div className="hidden md:block w-32">
        <div className="flex justify-between text-[8px] font-black uppercase mb-1">
          <span className="text-slate-400">الإنجاز</span>
          <span className="text-slate-600">{project.progress}%</span>
        </div>
        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500" style={{ width: `${project.progress}%` }}></div>
        </div>
      </div>

      <div className="hidden lg:block text-right w-24">
        <p className="text-[8px] text-slate-400 font-black uppercase">الميزانية</p>
        <p className="text-xs font-black text-slate-700">{project.budget.toLocaleString()}</p>
      </div>

      <div className="text-right w-28">
        <p className="text-[8px] text-slate-400 font-black uppercase">الربح</p>
        <p className={`text-xs font-black ${isLowProfit ? 'text-red-600' : 'text-emerald-600'}`}>
          {project.profit.toLocaleString()} ر.س
        </p>
      </div>

      <div className="px-3 py-1 rounded-lg text-[9px] font-black bg-slate-50 text-slate-500 border border-slate-100 uppercase hidden sm:block">
        {project.status}
      </div>

      <div className="flex -space-x-1.5 rtl:space-x-reverse shrink-0">
         {project.team.slice(0, 3).map((id) => (
           <img key={id} src={`https://picsum.photos/seed/${id}/24/24`} className="w-6 h-6 rounded-full border border-white shadow-sm" alt="team" />
         ))}
      </div>

      <ChevronRight size={16} className="text-slate-300 rotate-180 group-hover:text-blue-500 transition-colors" />
    </div>
  );
};

const Projects = () => {
  const [allProjects, setAllProjects] = useState<Project[]>(mockProjects);
  const [view, setView] = useState<'grid' | 'list'>(() => {
    const savedView = localStorage.getItem('erp_projects_display_mode');
    return (savedView === 'grid' || savedView === 'list') ? savedView : 'grid';
  });

  useEffect(() => {
    localStorage.setItem('erp_projects_display_mode', view);
  }, [view]);

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [activeTimers, setActiveTimers] = useState<Record<string, number>>({}); 
  const [currentTime, setCurrentTime] = useState(Date.now());

  // AI & Integration States
  const [isReportLoading, setIsReportLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [reportContent, setReportContent] = useState<string | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

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
    setActiveTimers(prev => ({ ...prev, [taskId]: Date.now() }));
  };

  const handleStopTimer = (taskId: string) => {
    const startTime = activeTimers[taskId];
    if (!startTime || !selectedProject) return;

    const elapsedMs = Date.now() - startTime;
    const elapsedHours = elapsedMs / (1000 * 60 * 60);

    const updatedTasks = selectedProject.tasks.map(t => 
      t.id === taskId ? { ...t, hours: Number((t.hours + elapsedHours).toFixed(2)) } : t
    );

    const updatedProject = { ...selectedProject, tasks: updatedTasks };
    
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
      progress: Number(formData.get('progress')),
      projectManager: formData.get('projectManager') as string,
      technicalLead: formData.get('technicalLead') as string,
      qaEngineer: formData.get('qaEngineer') as string,
    };

    if (selectedProject) {
      const updated = { ...selectedProject, ...updatedData, profit: (updatedData.budget || 0) - (selectedProject.actualCost || 0) };
      setAllProjects(allProjects.map(p => p.id === selectedProject.id ? updated : p));
      setSelectedProject(updated);
    } else {
      const newProj: Project = {
        ...updatedData as Project,
        id: 'pj' + Date.now(),
        clientId: 'internal',
        actualCost: 0,
        profit: updatedData.budget || 0,
        team: ['1'],
        milestones: [],
        tasks: [],
        resources: []
      };
      setAllProjects([newProj, ...allProjects]);
    }
    setIsEditModalOpen(false);
  };

  const addTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedProject) return;
    const formData = new FormData(e.currentTarget);
    const newT: Task = {
      id: 't' + Date.now(),
      title: formData.get('title') as string,
      assignedTo: formData.get('assignedTo') as string,
      status: 'pending',
      hours: Number(formData.get('hours')),
      dueDate: formData.get('dueDate') as string
    };
    const updated = { ...selectedProject, tasks: [...selectedProject.tasks, newT] };
    setAllProjects(allProjects.map(p => p.id === selectedProject.id ? updated : p));
    setSelectedProject(updated);
    setIsTaskModalOpen(false);
  };

  const generateFinancialReport = async () => {
    setIsReportLoading(true);
    setIsReportModalOpen(true);
    const projectsSummary = allProjects.map(p => ({
      name: p.name,
      client: p.client,
      budget: p.budget,
      actualCost: p.actualCost,
      profit: p.profit,
      progress: p.progress,
      status: p.status
    }));
    const report = await getProjectFinancialAnalysis(projectsSummary);
    setReportContent(report);
    setIsReportLoading(false);
  };

  const handleSyncTasks = async () => {
    if (!selectedProject || !selectedProject.connectedTool) return;
    setIsSyncing(true);
    const externalTasks = await fetchExternalTasks(selectedProject.name, selectedProject.connectedTool as any);
    
    if (externalTasks && externalTasks.length > 0) {
      const updatedTasks = [...selectedProject.tasks, ...externalTasks.map((t: any) => ({
        ...t,
        id: 'ext-' + t.externalId,
        externalSource: selectedProject.connectedTool
      }))];
      
      const updatedProject = { ...selectedProject, tasks: updatedTasks };
      setSelectedProject(updatedProject);
      setAllProjects(prev => prev.map(p => p.id === selectedProject.id ? updatedProject : p));
      alert(`تم بنجاح مزامنة عدد (${externalTasks.length}) مهام من ${selectedProject.connectedTool}`);
    }
    setIsSyncing(false);
  };

  if (selectedProject) {
    const isLowProfit = selectedProject.profit < (selectedProject.budget * 0.1);
    const budgetBurnRate = Math.min(100, Math.round((selectedProject.actualCost / selectedProject.budget) * 100));
    
    return (
      <div className="space-y-8 animate-in slide-in-from-left-4 duration-500 pb-12">
        <div className="flex items-center justify-between">
          <button onClick={() => setSelectedProject(null)} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors font-bold group">
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> العودة للوحة المشاريع
          </button>
          <div className="flex gap-3">
             {selectedProject.connectedTool && (
               <button 
                onClick={handleSyncTasks} 
                disabled={isSyncing}
                className="px-5 py-2.5 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-xl text-xs font-black shadow-sm flex items-center gap-2 hover:bg-indigo-100 transition-all disabled:opacity-50"
               >
                 {isSyncing ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />} 
                 مزامنة مع {selectedProject.connectedTool}
               </button>
             )}
             <button onClick={() => setIsEditModalOpen(true)} className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-black shadow-lg shadow-blue-100 flex items-center gap-2">
               <Edit3 size={16} /> تعديل المشروع
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           <div className={`lg:col-span-8 p-8 rounded-[3rem] border shadow-sm relative overflow-hidden flex flex-col md:flex-row gap-10 items-center transition-colors ${isLowProfit ? 'bg-red-50 border-red-100' : 'bg-white border-slate-100'}`}>
              <div className={`absolute top-0 right-0 w-64 h-64 opacity-[0.03] rounded-bl-full ${isLowProfit ? 'bg-red-500' : 'bg-blue-500'}`}></div>
              <div className={`w-28 h-28 rounded-[2.5rem] flex items-center justify-center relative z-10 shadow-xl shrink-0 ${isLowProfit ? 'bg-red-500 text-white shadow-red-200' : 'bg-blue-50 text-blue-600 shadow-blue-100'}`}>
                 {isLowProfit ? <AlertTriangle size={56} /> : <Briefcase size={56} />}
              </div>
              <div className="flex-1 text-center md:text-right relative z-10">
                 <div className="flex items-center justify-center md:justify-start gap-3 mb-2 flex-wrap">
                    <h1 className="text-3xl font-black text-slate-800 tracking-tighter">{selectedProject.name}</h1>
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      selectedProject.status === ProjectStatus.COMPLETED ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'
                    }`}>{selectedProject.status}</span>
                    {selectedProject.connectedTool && (
                       <span className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-xl text-[9px] font-black uppercase shadow-lg shadow-indigo-100">
                          <LinkIcon size={12} /> متصل بـ {selectedProject.connectedTool}
                       </span>
                    )}
                 </div>
                 <p className="text-slate-500 font-bold text-lg mb-8">{selectedProject.client} • التسليم: {selectedProject.deadline}</p>
                 
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white/50 p-3 rounded-2xl border border-slate-100 text-right">
                       <p className="text-[9px] text-slate-400 font-black uppercase mb-1">مدير المشروع</p>
                       <p className="text-xs font-black text-slate-700">{selectedProject.projectManager}</p>
                    </div>
                    <div className="bg-white/50 p-3 rounded-2xl border border-slate-100 text-right">
                       <p className="text-[9px] text-slate-400 font-black uppercase mb-1">القائد التقني</p>
                       <p className="text-xs font-black text-blue-600">{selectedProject.technicalLead}</p>
                    </div>
                    <div className="bg-white/50 p-3 rounded-2xl border border-slate-100 text-right">
                       <p className="text-[9px] text-slate-400 font-black uppercase mb-1">مهندس الجودة</p>
                       <p className="text-xs font-black text-emerald-600">{selectedProject.qaEngineer}</p>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                       <div className="flex justify-between items-end">
                          <div>
                             <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">استهلاك الميزانية</p>
                             <div className="flex items-baseline gap-1">
                                <span className={`text-xl font-black ${budgetBurnRate > 90 ? 'text-red-600' : 'text-slate-800'}`}>{selectedProject.actualCost.toLocaleString()}</span>
                                <span className="text-xs text-slate-400 font-bold">/ {selectedProject.budget.toLocaleString()} ر.س</span>
                             </div>
                          </div>
                          <span className={`text-xs font-black ${budgetBurnRate > 90 ? 'text-red-600' : 'text-blue-600'}`}>{budgetBurnRate}%</span>
                       </div>
                       <div className="h-4 w-full bg-slate-50 rounded-full overflow-hidden shadow-inner p-0.5 border border-slate-100">
                          <div 
                            className={`h-full rounded-full transition-all duration-1000 shadow-sm ${
                              budgetBurnRate > 100 ? 'bg-red-500' : budgetBurnRate > 80 ? 'bg-amber-500' : 'bg-blue-600'
                            }`} 
                            style={{ width: `${budgetBurnRate}%` }}
                          ></div>
                       </div>
                    </div>

                    <div className="space-y-4">
                       <div className="flex justify-between items-end">
                          <div>
                             <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest mb-1">الإنجاز الكلي</p>
                             <p className="text-xl font-black text-indigo-600">{selectedProject.progress}%</p>
                          </div>
                          <Zap size={20} className="text-amber-500 animate-pulse" />
                       </div>
                       <div className="h-4 w-full bg-indigo-50 rounded-full overflow-hidden border border-indigo-100 shadow-inner p-0.5">
                          <div 
                            className="h-full rounded-full bg-gradient-to-l from-indigo-600 to-blue-500 transition-all duration-1000 shadow-sm" 
                            style={{ width: `${selectedProject.progress}%` }}
                          ></div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           <div className={`lg:col-span-4 rounded-[3rem] p-8 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between group ${isLowProfit ? 'bg-red-600 shadow-red-200' : 'bg-emerald-600'}`}>
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><DollarSign size={140} /></div>
              <div className="relative z-10">
                 <p className="text-xs font-bold opacity-80 uppercase tracking-widest mb-1">الربحية المقدرة</p>
                 <h3 className="text-4xl font-black tracking-tighter">
                   {selectedProject.profit.toLocaleString()} <span className="text-sm font-bold opacity-60">ر.س</span>
                 </h3>
                 <div className="mt-8 p-4 bg-white/10 rounded-2xl border border-white/10">
                    <p className="text-[10px] font-black uppercase mb-2">كفاءة تخصيص الموارد</p>
                    <div className="flex items-center gap-3">
                       <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                          <div className="h-full bg-white" style={{ width: '85%' }}></div>
                       </div>
                       <span className="text-xs font-black">85%</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="p-8 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/30">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-100">
                    <Cpu size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-800">الموارد التقنية للمشروع</h3>
                    <p className="text-xs text-slate-500 font-bold mt-1">تخطيط الكفاءات والمهارات وتوزيع الفريق.</p>
                  </div>
                </div>
                <button className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-black shadow-lg hover:bg-indigo-700 transition-all flex items-center gap-2 active:scale-95">
                  <UserPlus size={18} /> طلب مورد جديد
                </button>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-1 gap-6">
                  {selectedProject.resources?.length > 0 ? selectedProject.resources.map(res => (
                    <div key={res.id} className={`p-6 bg-white border rounded-[2rem] transition-all group shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 hover:shadow-xl ${
                      res.status === 'عجز' ? 'border-red-100 bg-red-50/10' : 'border-slate-100 hover:border-indigo-200'
                    }`}>
                      <div className="flex-1 space-y-5 w-full">
                        <div className="flex items-center gap-5">
                          <div className={`w-16 h-16 rounded-3xl flex items-center justify-center shadow-inner relative transition-transform group-hover:scale-105 ${
                            res.status === 'مكتمل' ? 'bg-emerald-50 text-emerald-600' : 
                            res.status === 'قيد البحث' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
                          }`}>
                            {res.status === 'مكتمل' ? <ShieldCheck size={32} /> : res.status === 'قيد البحث' ? <Search size={32} /> : <AlertCircle size={32} />}
                            {res.status === 'مكتمل' && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                                <Check size={10} />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                               <h4 className="text-lg font-black text-slate-800">{res.role}</h4>
                               <span className={`px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                                 res.status === 'مكتمل' ? 'bg-emerald-100 text-emerald-600' : 
                                 res.status === 'قيد البحث' ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'
                               }`}>
                                 {res.status}
                               </span>
                            </div>
                            <div className="flex items-center gap-3 text-xs">
                               <div className="flex items-center gap-1.5 text-slate-400 font-bold">
                                 {res.allocatedMember ? (
                                   <>
                                     <img src={`https://picsum.photos/seed/${res.allocatedMember}/32/32`} className="w-5 h-5 rounded-full shadow-sm" />
                                     <span className="text-slate-600">المخصص: {res.allocatedMember}</span>
                                   </>
                                 ) : (
                                   <span className="text-slate-400 italic">بانتظار تعيين موظف</span>
                                 )}
                               </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                             <Award size={12} className="text-indigo-600" /> المهارات التقنية المطلوبة
                           </p>
                           <div className="flex flex-wrap gap-2">
                              {res.requiredSkills.map((skill, i) => (
                                <span key={i} className="px-3 py-1.5 bg-slate-50 text-slate-500 rounded-xl text-[10px] font-black border border-slate-100 group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-all">
                                  #{skill}
                                </span>
                              ))}
                           </div>
                        </div>
                      </div>

                      <div className="w-full lg:w-56 space-y-3 bg-slate-50/50 p-5 rounded-[1.5rem] border border-slate-100 group-hover:bg-white transition-colors">
                        <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          <span>نسبة تخصيص الوقت</span>
                          <span className='text-indigo-600 font-mono'>{res.allocationPercentage}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden shadow-inner">
                          <div 
                            className="h-full bg-gradient-to-l from-indigo-600 to-blue-500 transition-all duration-1000 shadow-sm" 
                            style={{ width: `${res.allocationPercentage}%` }}
                          ></div>
                        </div>
                        <p className="text-[9px] text-slate-400 font-bold leading-relaxed">تخصيص الموارد يؤثر مباشرة على جودة التسليم وميزانية ساعات العمل.</p>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-[2rem]">
                       <Cpu size={48} className="mx-auto text-slate-200 mb-4" />
                       <p className="text-slate-400 font-bold text-sm">لا توجد موارد تقنية مخصصة لهذا المشروع بعد.</p>
                       <button className="mt-4 text-xs font-black text-indigo-600 hover:underline">إضافة أول مورد تقني</button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
               <div className="flex border-b border-slate-100 bg-slate-50/50">
                  <button className="px-8 py-5 text-sm font-black text-blue-600 border-b-2 border-blue-600 bg-white">سجل المهام التقنية</button>
                  <button className="px-8 py-5 text-sm font-black text-slate-400 hover:text-slate-600">المراحل (Milestones)</button>
               </div>
               <div className="p-8">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-black text-slate-800 flex items-center gap-2">المهام التنفيذية</h3>
                    <div className="flex gap-2">
                       {selectedProject.connectedTool && (
                         <button 
                          onClick={handleSyncTasks}
                          disabled={isSyncing}
                          className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl hover:bg-indigo-100 transition-all shadow-sm flex items-center gap-1"
                         >
                           {isSyncing ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />} مزامنة {selectedProject.connectedTool}
                         </button>
                       )}
                       <button onClick={() => setIsTaskModalOpen(true)} className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl hover:bg-blue-100 transition-all shadow-sm">+ مهمة جديدة</button>
                    </div>
                  </div>
                  <div className="space-y-4">
                     {selectedProject.tasks.map(task => {
                       const isTimerRunning = !!activeTimers[task.id];
                       return (
                        <div key={task.id} className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between group hover:bg-white hover:shadow-md border border-transparent hover:border-slate-100 transition-all">
                           <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${task.status === 'completed' ? 'bg-emerald-50 text-emerald-500' : 'bg-blue-50 text-blue-500'}`}>
                                 {task.status === 'completed' ? <CheckCircle2 size={20}/> : <Timer size={20}/>}
                              </div>
                              <div>
                                 <div className="flex items-center gap-2">
                                    <p className={`text-sm font-bold ${task.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{task.title}</p>
                                    {task.externalSource && (
                                       <span className="px-1.5 py-0.5 bg-indigo-100 text-indigo-700 text-[8px] font-black rounded uppercase">
                                         {task.externalSource === 'Jira' ? <Trello size={10} className="inline ml-1" /> : null}
                                         {task.externalSource}
                                       </span>
                                    )}
                                 </div>
                                 <p className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-2 mt-1">
                                   <span className="flex items-center gap-1"><Users size={12}/> {task.assignedTo}</span>
                                   <span>•</span>
                                   <span className="flex items-center gap-1"><Clock size={12}/> {task.hours} ساعة</span>
                                   {task.dueDate && (
                                     <>
                                       <span>•</span>
                                       <span className="flex items-center gap-1 text-blue-500"><Calendar size={12}/> استحقاق: {task.dueDate}</span>
                                     </>
                                   )}
                                 </p>
                              </div>
                           </div>
                           <div className="flex items-center gap-4">
                              {isTimerRunning && (
                                <div className="text-[10px] font-black text-blue-600 animate-pulse font-mono bg-blue-50 px-2 py-1 rounded-lg">
                                  {formatDuration(currentTime - activeTimers[task.id])}
                                </div>
                              )}
                              <button 
                                onClick={() => isTimerRunning ? handleStopTimer(task.id) : handleStartTimer(task.id)}
                                className={`p-2 rounded-lg transition-all shadow-sm ${
                                  isTimerRunning ? 'bg-red-500 text-white' : 'bg-blue-600 text-white'
                                }`}
                              >
                                {isTimerRunning ? <Square size={16}/> : <Play size={16}/>}
                              </button>
                           </div>
                        </div>
                       );
                     })}
                  </div>
               </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-slate-900 p-8 rounded-[2rem] text-white shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500"><Github size={120} /></div>
               <h4 className="text-sm font-bold text-slate-400 mb-6 uppercase tracking-widest flex items-center gap-2">
                 <Github size={18} /> تكاملات هندسة البرمجيات
               </h4>
               <div className="space-y-4 relative z-10">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between hover:bg-white/10 transition-all cursor-pointer">
                     <div className="flex items-center gap-3">
                        <Github size={20} className="text-slate-300" />
                        <span className="text-xs font-bold">GitHub Repository</span>
                     </div>
                     <button className="text-blue-400 text-[10px] font-black underline underline-offset-4">فتح الكود</button>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between hover:bg-white/10 transition-all cursor-pointer">
                     <div className="flex items-center gap-3">
                        <Cloud size={20} className="text-blue-400" />
                        <span className="text-xs font-bold">AWS Deployment</span>
                     </div>
                     <span className="text-emerald-400 text-[10px] font-black flex items-center gap-1">
                       <CheckCircle2 size={12} /> نشط (Stable)
                     </span>
                  </div>
               </div>
            </div>

            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
               <h4 className="text-sm font-black text-slate-800 mb-6 flex items-center gap-2 border-r-4 border-amber-500 pr-3">
                  <Zap size={18} className="text-amber-500" /> ذكاء الموارد (AI)
               </h4>
               <p className="text-xs text-slate-500 leading-relaxed mb-6 font-medium">
                 تحليل Gemini يشير إلى أن **مهارات المطورين الخلفيين** مستهلكة بالكامل. ننصح بتعيين مورد إضافي لتجنب تأخر مرحلة الـ MVP.
               </p>
               <button className="w-full py-3 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black uppercase text-slate-600 hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                 توليد تقرير التوظيف التقني
               </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const filteredProjects = allProjects.filter(p => 
    p.name.includes(searchTerm) || p.client.includes(searchTerm)
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tighter">إدارة العمليات والمشاريع</h2>
          <p className="text-slate-500 font-medium">تتبع مسار التنفيذ، التكاليف، والربحية لكل مشروع تقني.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={generateFinancialReport}
            className="px-6 py-2.5 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-xl text-sm font-black shadow-sm hover:bg-indigo-100 transition-all flex items-center gap-2"
          >
            <Sparkles size={18} className="text-indigo-500" /> تقرير الأداء المالي (AI)
          </button>
          <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
             <button 
              onClick={() => setView('grid')} 
              className={`p-2 rounded-lg transition-all ${view === 'grid' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500'}`}
             >
               <LayoutGrid size={20} />
             </button>
             <button 
              onClick={() => setView('list')} 
              className={`p-2 rounded-lg transition-all ${view === 'list' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500'}`}
             >
               <ListIcon size={20} />
             </button>
          </div>
          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-black shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all flex items-center gap-2"
          >
            <Plus size={20} /> مشروع تقني جديد
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-4 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="بحث عن مشروع، عميل، أو مورد..." 
            className="w-full pr-12 pl-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
           <button className="px-5 py-3 border border-slate-200 rounded-2xl text-xs font-black text-slate-500 flex items-center gap-2 hover:bg-slate-50"><Filter size={16}/> تصفية متقدمة</button>
        </div>
      </div>

      {view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProjects.map(project => (
            <ProjectCard key={project.id} project={project} onClick={() => setSelectedProject(project)} />
          ))}
          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="border-4 border-dashed border-slate-100 rounded-[2rem] p-8 flex flex-col items-center justify-center gap-4 text-slate-300 hover:border-blue-200 hover:text-blue-400 transition-all bg-white/50 group"
          >
            <div className="p-4 bg-slate-50 rounded-2xl group-hover:scale-110 transition-transform"><Plus size={32} /></div>
            <span className="font-black text-sm uppercase tracking-widest">إضافة مشروع جديد</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
           {filteredProjects.map(project => (
             <ProjectListItem key={project.id} project={project} onClick={() => setSelectedProject(project)} />
           ))}
           <button 
            onClick={() => setIsEditModalOpen(true)}
            className="w-full py-6 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold text-sm hover:border-blue-300 hover:text-blue-500 transition-all bg-white/50"
           >
             + إضافة مشروع جديد إلى القائمة
           </button>
        </div>
      )}

      {/* AI Financial Report Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
           <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-4xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100 flex flex-col max-h-[90vh]">
              <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-indigo-600 text-white">
                 <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/30 shadow-xl">
                       {isReportLoading ? <Loader2 size={28} className="animate-spin" /> : <FileBarChart size={28} />}
                    </div>
                    <div>
                       <h3 className="text-2xl font-black tracking-tight">تحليل الأداء المالي الذكي (AI CFO)</h3>
                       <p className="text-indigo-100 text-sm font-medium mt-1">رؤى استراتيجية مدعومة بمحرك Gemini 3 Pro</p>
                    </div>
                 </div>
                 <button onClick={() => setIsReportModalOpen(false)} className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all"><X size={24} /></button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-10 bg-slate-50/50">
                 {isReportLoading ? (
                   <div className="flex flex-col items-center justify-center py-20 space-y-6">
                      <div className="relative">
                         <div className="w-20 h-20 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                         <Sparkles className="absolute inset-0 m-auto text-indigo-600 animate-pulse" size={24} />
                      </div>
                      <div className="text-center space-y-2">
                         <h4 className="text-xl font-black text-slate-800 tracking-tight">جاري تحليل البيانات المالية...</h4>
                         <p className="text-slate-500 font-medium max-w-sm">يقوم النظام الآن بمقارنة الميزانيات، التكاليف الفعلية، ومعدلات الإنجاز لتوليد التوصيات.</p>
                      </div>
                   </div>
                 ) : (
                   <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                      <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm prose prose-slate prose-sm max-w-none prose-headings:font-black prose-headings:text-indigo-900 prose-p:leading-relaxed prose-li:font-medium">
                         <p className="whitespace-pre-wrap font-medium text-slate-700">{reportContent}</p>
                      </div>
                      <div className="mt-8 flex gap-3 justify-center">
                         <button className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-xl hover:bg-indigo-700 transition-all flex items-center gap-2">
                           <Download size={18} /> تحميل كملف PDF
                         </button>
                         <button onClick={generateFinancialReport} className="px-8 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black text-sm hover:bg-slate-50 transition-all flex items-center gap-2">
                           <RefreshCw size={18} /> تحديث البيانات والتحليل
                         </button>
                      </div>
                   </div>
                 )}
              </div>
           </div>
        </div>
      )}

      {/* Existing Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
           <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-300 my-8">
              <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-100">
                      {selectedProject ? <Edit3 size={24} /> : <Plus size={24} />}
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-800">{selectedProject ? 'تعديل بيانات المشروع' : 'إعداد مشروع تقني جديد'}</h3>
                      <p className="text-xs text-slate-500 font-medium mt-1">تأكد من تعيين القيادة التقنية والإدارية للمشروع</p>
                    </div>
                 </div>
                 <button onClick={() => setIsEditModalOpen(false)} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><X size={24} /></button>
              </div>
              <form onSubmit={handleUpdateProject} className="p-8 space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">مسمى المشروع التقني</label>
                       <input name="name" required defaultValue={selectedProject?.name} placeholder="مثال: منصة التداول الرقمية" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">العميل</label>
                       <input name="client" required defaultValue={selectedProject?.client} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                    </div>
                 </div>

                 <div className="bg-slate-50/80 p-6 rounded-[2rem] border border-slate-100 space-y-6">
                    <h4 className="text-xs font-black text-blue-600 flex items-center gap-2 border-b border-slate-200 pb-3 uppercase tracking-wider">
                       <UserCog size={16} /> قيادة الفريق والمسؤوليات
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                             <ShieldAlert size={12} className="text-indigo-500" /> مدير المشروع (PM)
                          </label>
                          <input name="projectManager" required defaultValue={selectedProject?.projectManager} placeholder="اسم مدير المشروع المسؤول" className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                             <Cpu size={12} className="text-blue-500" /> القائد التقني (TL)
                          </label>
                          <input name="technicalLead" required defaultValue={selectedProject?.technicalLead} placeholder="المسؤول عن البنية التقنية" className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm" />
                       </div>
                       <div className="space-y-2 md:col-span-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                             <Bug size={12} className="text-emerald-500" /> مهندس الجودة (QA)
                          </label>
                          <input name="qaEngineer" required defaultValue={selectedProject?.qaEngineer} placeholder="المسؤول عن الاختبارات وضمان الجودة" className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm" />
                       </div>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">الميزانية (ر.س)</label>
                       <input name="budget" type="number" required defaultValue={selectedProject?.budget} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">تاريخ التسليم</label>
                       <input name="deadline" type="date" required defaultValue={selectedProject?.deadline} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">الحالة</label>
                       <select name="status" defaultValue={selectedProject?.status} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all">
                          {Object.values(ProjectStatus).map(s => <option key={s} value={s}>{s}</option>)}
                       </select>
                    </div>
                 </div>

                 <div className="flex gap-4 pt-4">
                    <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 py-4 text-slate-600 font-black bg-slate-100 rounded-2xl hover:bg-slate-200 transition-all active:scale-95">إلغاء</button>
                    <button type="submit" className="flex-[2] py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-3">
                       <Save size={20} /> {selectedProject ? 'حفظ التغييرات' : 'إطلاق وحفظ المشروع'}
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}

      {isTaskModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
           <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100">
              <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                 <h3 className="text-xl font-black text-slate-800">إضافة مهمة تنفيذية</h3>
                 <button onClick={() => setIsTaskModalOpen(false)} className="p-2 text-slate-400 hover:text-rose-500"><X size={24} /></button>
              </div>
              <form onSubmit={addTask} className="p-8 space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">وصف المهمة</label>
                    <input name="title" required placeholder="وصف المهمة بدقة..." className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500" />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">الساعات المقدرة</label>
                       <input name="hours" type="number" placeholder="0" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">المسؤول</label>
                       <input name="assignedTo" required className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none" />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">تاريخ الاستحقاق</label>
                    <input name="dueDate" type="date" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500" />
                 </div>
                 <button type="submit" className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all">تأكيد الإضافة</button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
