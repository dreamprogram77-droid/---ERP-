
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Supplier, Transaction } from '../types';
import { 
  Truck, 
  Search, 
  Filter, 
  Plus, 
  Mail, 
  Phone, 
  Building2, 
  ChevronLeft, 
  // Fix: Added missing ChevronRight to imports from lucide-react
  ChevronRight,
  MoreVertical, 
  AlertCircle, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  Layers,
  ShoppingBag,
  ExternalLink,
  History,
  CheckCircle2,
  Receipt,
  FileText,
  ArrowUpRight,
  ArrowRight,
  ShieldCheck,
  Download
} from 'lucide-react';

const mockSuppliers: Supplier[] = [
  { id: 's1', name: 'خدمات أمازون السحابية', company: 'AWS', email: 'billing@aws.com', phone: '1-800-AWS-HELP', category: 'تقنية', status: 'نشط', totalPaid: 45000, balance: 1200, joinDate: '2021-02-10' },
  { id: 's2', name: 'مايكروسوفت الشرق الأوسط', company: 'Microsoft', email: 'sales@microsoft.com.sa', phone: '011-200-3000', category: 'تقنية', status: 'نشط', totalPaid: 120000, balance: 0, joinDate: '2020-05-15' },
  { id: 's3', name: 'مجموعة الموردين للأثاث', company: 'OfficeGroup', email: 'orders@officegroup.sa', phone: '0555444333', category: 'معدات', status: 'نشط', totalPaid: 15000, balance: 500, joinDate: '2022-01-20' },
  { id: 's4', name: 'أرامكس للحلول اللوجستية', company: 'Aramex', email: 'business@aramex.com', phone: '920027447', category: 'خدمات إدارية', status: 'غير نشط', totalPaid: 8500, balance: 0, joinDate: '2021-11-05' },
];

const mockSupplierTransactions: Transaction[] = [
  { id: 'st1', date: '2023-11-20', description: 'فاتورة اشتراك سيرفرات EC2', amount: -1200, type: 'مصروف', category: 'تقنية', supplierId: 's1', isVatApplicable: true },
  { id: 'st2', date: '2023-11-15', description: 'تجديد تراخيص Office 365', amount: -25000, type: 'مصروف', category: 'تقنية', supplierId: 's2', isVatApplicable: true },
  { id: 'st3', date: '2023-11-05', description: 'فاتورة توريد كراسي مكتبية', amount: -5000, type: 'مصروف', category: 'معدات', supplierId: 's3', isVatApplicable: true },
  { id: 'st4', date: '2023-10-20', description: 'دعم فني واستشارات سحابية', amount: -3500, type: 'مصروف', category: 'تقنية', supplierId: 's1', isVatApplicable: true },
];

const SupplierDetail = ({ supplier, onBack }: { supplier: Supplier, onBack: () => void }) => {
  const [activeTab, setActiveTab] = useState<'info' | 'history' | 'invoices' | 'payments'>('invoices');
  const transactions = mockSupplierTransactions.filter(t => t.supplierId === supplier.id);

  return (
    <div className="space-y-8 animate-in slide-in-from-left-4 duration-500 pb-12">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors font-bold group">
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> العودة لقائمة الموردين
      </button>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-8">
          {/* Header Card */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full -mr-24 -mt-24"></div>
            <div className="w-32 h-32 bg-blue-50 rounded-[2rem] flex items-center justify-center text-blue-600 relative z-10 border-4 border-white shadow-xl">
              <Truck size={64} />
            </div>
            <div className="flex-1 text-center md:text-right relative z-10">
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 mb-2">
                <h1 className="text-3xl font-black text-slate-800 tracking-tighter">{supplier.name}</h1>
                <span className="px-3 py-1 rounded-full text-[10px] font-black bg-blue-100 text-blue-600 uppercase tracking-widest">
                  {supplier.category}
                </span>
              </div>
              <p className="text-lg font-bold text-slate-400 mb-6">{supplier.company}</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                  <p className="text-[9px] text-slate-400 font-black uppercase mb-1">الرصيد المستحق</p>
                  <p className={`text-sm font-black ${supplier.balance > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>{supplier.balance.toLocaleString()} ر.س</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                  <p className="text-[9px] text-slate-400 font-black uppercase mb-1">إجمالي المشتريات</p>
                  <p className="text-sm font-black text-slate-800">{supplier.totalPaid.toLocaleString()} ر.س</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                  <p className="text-[9px] text-slate-400 font-black uppercase mb-1">الفواتير النشطة</p>
                  <p className="text-sm font-black text-blue-600">{transactions.length}</p>
                </div>
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-center">
                  <p className="text-[9px] text-emerald-400 font-black uppercase mb-1">حالة الحساب</p>
                  <p className="text-sm font-black text-emerald-700">{supplier.status}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content Tabs */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-[500px]">
            <div className="flex border-b border-slate-100 overflow-x-auto no-scrollbar bg-slate-50/50">
              {[
                { id: 'invoices', label: 'الفواتير والطلبات', icon: Receipt },
                { id: 'history', label: 'سجل التواصل', icon: History },
                { id: 'info', label: 'البيانات التعاقدية', icon: Building2 },
                { id: 'payments', label: 'سجل المدفوعات', icon: DollarSign },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-3 px-8 py-5 text-sm font-black whitespace-nowrap transition-all border-b-4 ${
                    activeTab === tab.id 
                      ? 'border-blue-600 text-blue-600 bg-white shadow-[0_4px_20px_-10px_rgba(37,99,235,0.2)]' 
                      : 'border-transparent text-slate-400 hover:text-slate-700 hover:bg-white/50'
                  }`}
                >
                  <tab.icon size={18} />
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-8">
              {activeTab === 'invoices' && (
                <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-blue-50/50 p-6 rounded-[2rem] border border-blue-100 shadow-inner">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-100">
                        <Receipt size={28} />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-slate-800 tracking-tight">إدارة فواتير {supplier.company}</h3>
                        <p className="text-slate-500 text-xs font-bold mt-1">تتبع كافة المطالبات المالية والفواتير الضريبية الواردة من هذا المورد.</p>
                      </div>
                    </div>
                    <Link 
                      to="/finance" 
                      className="flex items-center gap-2 px-6 py-3 bg-white border border-blue-200 text-blue-600 rounded-xl text-xs font-black hover:bg-blue-600 hover:text-white transition-all shadow-sm group"
                    >
                      فتح سجل المالية الكامل <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Link>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    {transactions.length > 0 ? transactions.map((invoice, idx) => (
                      <div key={invoice.id} className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-xl hover:border-blue-200 transition-all group flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="flex items-center gap-5">
                           <div className="w-14 h-14 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors border border-slate-100">
                              <FileText size={28} />
                           </div>
                           <div>
                              <div className="flex items-center gap-3 mb-1">
                                <p className="text-base font-black text-slate-800">فاتورة رقم: {`BILL-2023-${100 + idx}`}</p>
                                {invoice.isVatApplicable && (
                                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-black border border-emerald-100 uppercase">ضريبية 15%</span>
                                )}
                              </div>
                              <p className="text-xs text-slate-500 font-bold uppercase tracking-tighter">{invoice.description}</p>
                              <div className="flex items-center gap-4 mt-2">
                                 <span className="text-[10px] text-slate-400 flex items-center gap-1 font-bold"><Calendar size={12} className="text-blue-500" /> {invoice.date}</span>
                                 <span className="px-2.5 py-1 rounded-lg text-[9px] font-black bg-emerald-100 text-emerald-700 uppercase">تم السداد</span>
                              </div>
                           </div>
                        </div>
                        <div className="flex items-center gap-8 w-full md:w-auto">
                           <div className="text-right">
                              <p className="text-[9px] text-slate-400 font-black uppercase mb-1">المبلغ الصافي</p>
                              <p className="text-xl font-black text-slate-800">{Math.abs(invoice.amount).toLocaleString()} <span className="text-xs opacity-40">ر.س</span></p>
                           </div>
                           <div className="flex gap-2">
                             <button className="p-3 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all shadow-sm border border-slate-100"><Download size={18} /></button>
                             <button className="p-3 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all shadow-sm border border-slate-100"><MoreVertical size={18} /></button>
                           </div>
                        </div>
                      </div>
                    )) : (
                      <div className="text-center py-20 border-2 border-dashed border-slate-100 rounded-[2.5rem] bg-slate-50/30">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                          <Receipt size={32} className="text-slate-200" />
                        </div>
                        <p className="text-slate-400 text-sm font-black">لا توجد فواتير مسجلة لهذا المورد حالياً.</p>
                        <button className="mt-4 text-xs font-bold text-blue-600 hover:underline underline-offset-4">إضافة فاتورة يدوية</button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'history' && (
                <div className="space-y-6 animate-in fade-in duration-500">
                  <div className="flex items-center justify-between mb-4">
                     <h3 className="font-black text-slate-800">سجل التفاعلات (Log)</h3>
                     <button className="px-4 py-2 bg-slate-50 text-slate-500 rounded-xl text-xs font-bold border border-slate-100">+ إضافة ملاحظة</button>
                  </div>
                  <div className="space-y-4">
                    {[
                      { date: '2023-11-20', type: 'تواصل', text: 'تم استلام فاتورة الصيانة السيوية ومراجعتها مع الإدارة المالية.' },
                      { date: '2023-10-15', type: 'تحديث', text: 'تحديث شروط التعاقد لتشمل الدعم التقني على مدار الساعة.' },
                    ].map((log, i) => (
                      <div key={i} className="flex gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-colors">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0"></div>
                        <div>
                          <p className="text-xs text-slate-400 font-bold mb-1">{log.date} • {log.type}</p>
                          <p className="text-sm text-slate-700 font-medium leading-relaxed">{log.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'info' && (
                <div className="space-y-10 animate-in fade-in duration-500">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-6">
                         <h4 className="font-black text-slate-800 border-r-4 border-blue-600 pr-4">بيانات التواصل والفوترة</h4>
                         <div className="space-y-4 bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
                            <div className="flex justify-between items-center text-sm">
                               <span className="text-slate-400 font-bold">البريد الإلكتروني:</span>
                               <span className="text-slate-800 font-black">{supplier.email}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                               <span className="text-slate-400 font-bold">رقم الهاتف:</span>
                               <span className="text-slate-800 font-black" dir="ltr">{supplier.phone}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                               <span className="text-slate-400 font-bold">الرقم الضريبي:</span>
                               <span className="text-slate-800 font-mono font-black">312345678900003</span>
                            </div>
                         </div>
                      </div>
                      <div className="space-y-6">
                         <h4 className="font-black text-slate-800 border-r-4 border-emerald-600 pr-4">التصنيف والائتمان</h4>
                         <div className="space-y-4 bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
                            <div className="flex justify-between items-center text-sm">
                               <span className="text-slate-400 font-bold">الفئة الرئيسية:</span>
                               <span className="text-slate-800 font-black">{supplier.category}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                               <span className="text-slate-400 font-bold">فترة الائتمان المسموحة:</span>
                               <span className="text-emerald-600 font-black">30 يوم عمل</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                               <span className="text-slate-400 font-bold">عضو منذ:</span>
                               <span className="text-slate-800 font-black">{supplier.joinDate}</span>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
              )}

              {activeTab === 'payments' && (
                <div className="text-center py-16 animate-in zoom-in-95">
                  <div className="inline-flex p-6 bg-emerald-50 rounded-[2rem] text-emerald-600 mb-6 shadow-sm border border-emerald-100">
                    <CheckCircle2 size={48} />
                  </div>
                  <h4 className="text-xl font-black text-slate-800 mb-2 tracking-tight">لا توجد مطالبات معلقة</h4>
                  <p className="text-slate-500 text-sm mb-8 max-w-sm mx-auto font-medium">تمت تسوية جميع الفواتير الواردة من {supplier.company} بنجاح. يمكنك إصدار دفعة مقدمة إذا كنت تخطط لطلب خدمات جديدة.</p>
                  <div className="flex gap-4 justify-center">
                    <button className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-black text-xs shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center gap-2">إصدار دفعة مقدمة <ArrowRight size={14} /></button>
                    <button className="px-8 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black text-xs hover:bg-slate-50 transition-all">سجل الحوالات</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Info & Risk Analysis */}
        <div className="lg:w-80 space-y-8">
          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500"><TrendingUp size={120} /></div>
             <h4 className="text-xs font-black text-slate-500 mb-8 uppercase tracking-widest flex items-center gap-2"><TrendingUp size={16} className="text-blue-400" /> تحليل التكاليف (AI)</h4>
             <div className="space-y-8 relative z-10">
                <div>
                  <p className="text-[10px] text-slate-500 font-black uppercase mb-1.5 tracking-widest">إجمالي الإنفاق السنوي</p>
                  <p className="text-3xl font-black tracking-tighter">{supplier.totalPaid.toLocaleString()} <span className="text-xs font-bold opacity-40">ر.س</span></p>
                </div>
                <div className="pt-6 border-t border-white/10">
                  <p className="text-[10px] text-slate-500 font-black uppercase mb-2 tracking-widest">مساهمة المورد في المصاريف</p>
                  <div className="flex items-end gap-3">
                    <p className="text-3xl font-black tracking-tighter">12%</p>
                    <span className="text-[10px] text-emerald-400 mb-1.5 flex items-center gap-1 font-black leading-none">
                      <TrendingUp size={12} className="rotate-180" /> انخفاض 2%
                    </span>
                  </div>
                  <div className="mt-4 h-1.5 w-full bg-white/5 rounded-full overflow-hidden shadow-inner">
                    <div className="h-full bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" style={{ width: '12%' }}></div>
                  </div>
                </div>
             </div>
             <p className="mt-8 text-[10px] text-slate-400 leading-relaxed italic font-medium">توصية AI: المورد يقدم أسعاراً تنافسية مقارنة بالسوق، ننصح بتوسيع التعاقد للحصول على خصم كمية.</p>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
             <h4 className="font-black text-slate-800 mb-6 text-sm flex items-center gap-3">
               <ShieldCheck size={20} className="text-emerald-500" /> الحالة القانونية
             </h4>
             <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[9px] text-slate-400 font-black uppercase mb-1">الرقم الضريبي الموثق</p>
                  <p className="text-xs font-black text-slate-700 font-mono tracking-wider">312345678900003</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[9px] text-slate-400 font-black uppercase mb-1">رقم السجل التجاري</p>
                  <p className="text-xs font-black text-slate-700 font-mono tracking-wider">1010123456</p>
                </div>
                <button className="w-full py-4 bg-blue-50 text-blue-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-100 transition-all flex items-center justify-center gap-2">
                  <ExternalLink size={14} /> فحص السجل التجاري
                </button>
             </div>
          </div>

          <div className="bg-indigo-50 p-8 rounded-[2.5rem] border border-indigo-100">
             <h4 className="font-black text-indigo-900 mb-4 text-sm flex items-center gap-3"><ExternalLink size={20} /> روابط سريعة</h4>
             <div className="space-y-2">
                <button className="w-full text-right p-4 bg-white border border-indigo-100 rounded-2xl text-xs font-black text-indigo-700 hover:bg-indigo-600 hover:text-white transition-all shadow-sm">بوابة المورد الخارجية</button>
                <button className="w-full text-right p-4 bg-white border border-indigo-100 rounded-2xl text-xs font-black text-indigo-700 hover:bg-indigo-600 hover:text-white transition-all shadow-sm">تحميل العقد الإطاري (PDF)</button>
                <button className="w-full text-right p-4 bg-white border border-indigo-100 rounded-2xl text-xs font-black text-indigo-700 hover:bg-indigo-600 hover:text-white transition-all shadow-sm">طلب تحديث بيانات المورد</button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Suppliers = () => {
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filteredSuppliers = mockSuppliers.filter(s => {
    const matchesSearch = s.name.includes(searchTerm) || s.company.includes(searchTerm);
    const matchesCategory = selectedCategory === 'all' || s.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || s.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  if (selectedSupplier) return <SupplierDetail supplier={selectedSupplier} onBack={() => setSelectedSupplier(null)} />;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tighter flex items-center gap-3">
            الموردون والشركاء التقنيون <span className="px-4 py-1 bg-blue-100 text-blue-600 rounded-2xl text-sm font-black">{mockSuppliers.length}</span>
          </h2>
          <p className="text-slate-500 text-sm font-medium">إدارة فواتير الخدمات السحابية، تراخيص البرمجيات، والشركاء الاستراتيجيين.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-3 bg-white border border-slate-200 rounded-xl text-sm font-black text-slate-600 hover:bg-slate-50 shadow-sm flex items-center gap-2 transition-all">
            <Download size={18} /> تصدير السجل
          </button>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 text-sm font-black shadow-2xl shadow-blue-100 flex items-center gap-2 transition-all active:scale-95">
            <Plus size={18} /> إضافة مورد جديد
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner"><Truck size={28}/></div>
          <div>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">إجمالي الموردين</p>
            <p className="text-xl font-black text-slate-800">{mockSuppliers.length} كيان</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center shadow-inner"><AlertCircle size={28}/></div>
          <div>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">مبالغ مستحقة (الدائن)</p>
            <p className="text-xl font-black text-rose-600">1,700 ر.س</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner"><Layers size={28}/></div>
          <div>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">الفئات المفعلة</p>
            <p className="text-xl font-black text-slate-800">4 تصنيفات</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-inner"><ShoppingBag size={28}/></div>
          <div>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">تراخيص نشطة</p>
            <p className="text-xl font-black text-emerald-600">12 رخصة</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-5 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="flex flex-1 gap-6 items-center max-w-3xl">
          <div className="relative flex-1">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="البحث بالاسم، الشركة، أو الرقم المرجعي..." 
              className="w-full pr-12 pl-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-6 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-black text-slate-600 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="all">كل الحالات</option>
            <option value="نشط">نشط (Active)</option>
            <option value="غير نشط">غير نشط</option>
          </select>
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 md:pb-0">
          {['all', 'تقنية', 'معدات', 'خدمات إدارية'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-3 rounded-2xl text-[10px] font-black whitespace-nowrap transition-all border tracking-widest uppercase ${
                selectedCategory === cat 
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-100' 
                  : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat === 'all' ? 'كل الموردين' : cat}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-right text-sm">
          <thead className="bg-slate-50/50 text-slate-500 font-black text-[10px] uppercase tracking-widest border-b border-slate-100">
            <tr>
              <th className="px-8 py-6">المورد / الشركة</th>
              <th className="px-8 py-6 text-center">التصنيف</th>
              <th className="px-8 py-6">إجمالي المدفوعات</th>
              <th className="px-8 py-6">الرصيد المستحق</th>
              <th className="px-8 py-6 text-center">الحالة</th>
              <th className="px-8 py-6"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredSuppliers.map((supplier) => (
              <tr key={supplier.id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer" onClick={() => setSelectedSupplier(supplier)}>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-100 text-slate-500 rounded-2xl flex items-center justify-center font-black group-hover:bg-blue-50 group-hover:text-blue-600 transition-all border border-slate-100">
                      {supplier.company[0]}
                    </div>
                    <div>
                       <p className="font-black text-slate-700 group-hover:text-blue-600 transition-colors">{supplier.name}</p>
                       <p className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">{supplier.company}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6 text-center">
                  <span className="text-[10px] font-black text-slate-500 bg-slate-100 px-3 py-1 rounded-lg uppercase tracking-widest">{supplier.category}</span>
                </td>
                <td className="px-8 py-6 font-black text-slate-800 text-base">{supplier.totalPaid.toLocaleString()} <span className="text-[10px] opacity-40">ر.س</span></td>
                <td className="px-8 py-6">
                  <p className={`font-black text-base ${supplier.balance > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>{supplier.balance.toLocaleString()} <span className="text-[10px] opacity-40">ر.س</span></p>
                </td>
                <td className="px-8 py-6 text-center">
                  <span className={`px-4 py-1 rounded-full text-[9px] font-black tracking-widest uppercase ${
                    supplier.status === 'نشط' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                  }`}>{supplier.status}</span>
                </td>
                <td className="px-8 py-6 text-left">
                  <button 
                    className="p-2 text-slate-300 group-hover:text-blue-600 transition-colors"
                  >
                    <ChevronRight size={22} className="rotate-180" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredSuppliers.length === 0 && (
          <div className="py-32 text-center bg-white">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
               <Truck size={48} className="text-slate-200" />
            </div>
            <h4 className="text-xl font-black text-slate-800">لم يتم العثور على موردين</h4>
            <p className="text-slate-400 text-sm font-medium mt-2">جرب تغيير فلاتر البحث أو ابدأ بإضافة مورد جديد لشركتك.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Suppliers;
