import React from 'react';
import { ArrowUpRight, Copy, Users, Zap } from 'lucide-react';
import AnalyticsChart from '../components/AnalyticsChart';

const analyticsData = [
  { name: 'Jan', generated: 12, copied: 8 },
  { name: 'Feb', generated: 19, copied: 12 },
  { name: 'Mar', generated: 32, copied: 25 },
  { name: 'Apr', generated: 28, copied: 22 },
  { name: 'May', generated: 45, copied: 35 },
  { name: 'Jun', generated: 50, copied: 42 },
];

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode; change: string }> = ({ title, value, icon, change }) => {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                    <p className="text-3xl font-bold">{value}</p>
                </div>
                <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-full text-primary-600 dark:text-primary-300">
                    {icon}
                </div>
            </div>
            <div className="flex items-center text-sm mt-4 text-green-500">
                <ArrowUpRight size={16} className="mr-1"/>
                <span>{change} vs last month</span>
            </div>
        </div>
    );
}

const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">My Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400">Your personal analytics and insights.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Prompts Generated" value="186" icon={<Zap size={24}/>} change="+20.1%" />
        <StatCard title="Prompts Copied" value="142" icon={<Copy size={24}/>} change="+12.5%" />
        <StatCard title="Community Upvotes" value="78" icon={<Users size={24}/>} change="+5.2%" />
      </div>

      <div>
        <AnalyticsChart data={analyticsData} title="Activity Overview (Last 6 Months)"/>
      </div>
      
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
               <h3 className="text-lg font-semibold mb-4">Top Performing Prompts</h3>
               <ul className="space-y-3">
                   <li className="flex justify-between items-center"><span>Ultimate Essay Writing Assistant</span> <span className="font-bold">45 copies</span></li>
                   <li className="flex justify-between items-center"><span>Python Code Refactor</span> <span className="font-bold">32 copies</span></li>
                   <li className="flex justify-between items-center"><span>Marketing Slogan Generator</span> <span className="font-bold">28 copies</span></li>
               </ul>
           </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
               <h3 className="text-lg font-semibold mb-4">Most Popular Categories</h3>
               <ul className="space-y-3">
                   <li className="flex justify-between items-center"><span>Coding</span> <span className="font-bold">40%</span></li>
                   <li className="flex justify-between items-center"><span>Education</span> <span className="font-bold">25%</span></li>
                   <li className="flex justify-between items-center"><span>Business</span> <span className="font-bold">15%</span></li>
               </ul>
           </div>
       </div>

    </div>
  );
};

export default DashboardPage;
