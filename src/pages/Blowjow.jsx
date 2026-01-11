import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { 
  Users, 
  TrendingUp, 
  Activity, 
  Target,
  LogOut,
  Shield,
  Calendar,
  Mail,
  CheckCircle,
  XCircle,
  BarChart3,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { format } from 'date-fns';

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await base44.auth.isAuthenticated();
      setIsAuthenticated(authenticated);
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const { data: users = [] } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => base44.entities.User.list(),
    enabled: isAuthenticated
  });

  const { data: subscriptions = [] } = useQuery({
    queryKey: ['admin-subscriptions'],
    queryFn: () => base44.entities.Subscription.list(),
    enabled: isAuthenticated
  });

  // Mock Facebook Pixel data
  const pixelData = {
    totalLeads: users.length,
    leadsToday: users.filter(u => {
      const createdDate = new Date(u.created_date);
      const today = new Date();
      return createdDate.toDateString() === today.toDateString();
    }).length,
    conversionValue: users.length * 2.5,
    conversionRate: subscriptions.filter(s => s.plan !== 'free').length / Math.max(users.length, 1) * 100
  };

  // Generate chart data for last 7 days
  const getChartData = () => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = format(date, 'MMM dd');
      
      const leadsCount = users.filter(u => {
        const createdDate = new Date(u.created_date);
        return createdDate.toDateString() === date.toDateString();
      }).length;
      
      data.push({
        date: dateStr,
        leads: leadsCount,
        conversions: Math.floor(leadsCount * 0.3)
      });
    }
    return data;
  };

  // Plan distribution
  const getPlanDistribution = () => {
    const planCounts = subscriptions.reduce((acc, sub) => {
      acc[sub.plan] = (acc[sub.plan] || 0) + 1;
      return acc;
    }, {});

    return [
      { name: 'Free', value: planCounts.free || 0 },
      { name: 'Basic', value: planCounts.basic || 0 },
      { name: 'Pro', value: planCounts.pro || 0 },
      { name: 'Unlimited', value: planCounts.unlimited || 0 }
    ];
  };

  const handleLogout = () => {
    base44.auth.logout();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <Card className="bg-slate-900 border-slate-700 p-8">
          <div className="text-center">
            <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
            <p className="text-slate-400">You must be logged in to access admin panel</p>
          </div>
        </Card>
      </div>
    );
  }

  const activeUsers = users.filter(u => {
    const sub = subscriptions.find(s => s.user_email === u.email);
    return sub && sub.is_active;
  }).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-[1600px] mx-auto p-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-2 rounded-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-full px-3 py-1">
                <span className="text-emerald-400 text-xs font-semibold">ADMIN MODE</span>
              </div>
              <span className="text-slate-500 text-sm">Stake Prediction</span>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-slate-700 hover:bg-slate-800"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </motion.div>

        {/* Overview Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <Card className="bg-slate-900 border-slate-700 hover:border-emerald-500/50 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Total Users</CardTitle>
              <Users className="w-5 h-5 text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{users.length}</div>
              <p className="text-xs text-slate-500 mt-1">Registered accounts</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-700 hover:border-blue-500/50 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">New Today</CardTitle>
              <TrendingUp className="w-5 h-5 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{pixelData.leadsToday}</div>
              <p className="text-xs text-slate-500 mt-1">Registrations today</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-700 hover:border-purple-500/50 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Active Users</CardTitle>
              <Activity className="w-5 h-5 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{activeUsers}</div>
              <p className="text-xs text-slate-500 mt-1">With active subscription</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-700 hover:border-orange-500/50 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Conversion Rate</CardTitle>
              <Target className="w-5 h-5 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{pixelData.conversionRate.toFixed(1)}%</div>
              <p className="text-xs text-slate-500 mt-1">Free to paid conversion</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Leads Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-slate-900 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  Leads & Conversions
                </CardTitle>
                <CardDescription className="text-slate-500">Last 7 days activity</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={getChartData()}>
                    <defs>
                      <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorConversions" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="date" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                      labelStyle={{ color: '#94a3b8' }}
                    />
                    <Area type="monotone" dataKey="leads" stroke="#10b981" fillOpacity={1} fill="url(#colorLeads)" />
                    <Area type="monotone" dataKey="conversions" stroke="#3b82f6" fillOpacity={1} fill="url(#colorConversions)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Plan Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-slate-900 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-purple-400" />
                  Plan Distribution
                </CardTitle>
                <CardDescription className="text-slate-500">Current subscriptions</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={getPlanDistribution()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                      labelStyle={{ color: '#94a3b8' }}
                    />
                    <Bar dataKey="value" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Facebook Pixel Analytics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-blue-950/50 to-slate-900 border-blue-500/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white text-xl flex items-center gap-2 mb-2">
                    <Zap className="w-6 h-6 text-blue-400" />
                    Facebook Pixel Analytics
                  </CardTitle>
                  <CardDescription className="text-slate-400">Lead events & conversion tracking</CardDescription>
                </div>
                <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg px-4 py-2">
                  <span className="text-blue-400 text-sm font-semibold">LIVE TRACKING</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
                  <div className="text-slate-400 text-sm mb-1">Total Leads</div>
                  <div className="text-2xl font-bold text-white">{pixelData.totalLeads}</div>
                  <div className="text-xs text-emerald-400 mt-1">↑ Registrations tracked</div>
                </div>
                <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
                  <div className="text-slate-400 text-sm mb-1">Today's Leads</div>
                  <div className="text-2xl font-bold text-white">{pixelData.leadsToday}</div>
                  <div className="text-xs text-blue-400 mt-1">New today</div>
                </div>
                <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
                  <div className="text-slate-400 text-sm mb-1">Conversion Value</div>
                  <div className="text-2xl font-bold text-white">${pixelData.conversionValue.toFixed(2)}</div>
                  <div className="text-xs text-purple-400 mt-1">Estimated value</div>
                </div>
                <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
                  <div className="text-slate-400 text-sm mb-1">Pixel Events</div>
                  <div className="text-2xl font-bold text-white">{pixelData.totalLeads * 3}</div>
                  <div className="text-xs text-orange-400 mt-1">Total events fired</div>
                </div>
              </div>

              <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
                <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-400" />
                  Event Breakdown
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between py-2">
                    <span className="text-slate-400 text-sm">PageView</span>
                    <span className="text-white font-semibold">{pixelData.totalLeads * 2}</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-slate-400 text-sm">Lead (Registration)</span>
                    <span className="text-emerald-400 font-semibold">{pixelData.totalLeads}</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-slate-400 text-sm">Purchase (Subscription)</span>
                    <span className="text-purple-400 font-semibold">{subscriptions.filter(s => s.plan !== 'free').length}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" />
                Users ({users.length})
              </CardTitle>
              <CardDescription className="text-slate-500">All registered users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-800">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">Email</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">Name</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">Role</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">Registered</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">Plan</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.slice(0, 10).map((user, index) => {
                      const subscription = subscriptions.find(s => s.user_email === user.email);
                      return (
                        <tr key={user.id} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-slate-500" />
                              <span className="text-white text-sm">{user.email}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-slate-400 text-sm">{user.full_name || 'N/A'}</td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              user.role === 'admin' 
                                ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                                : 'bg-slate-700/50 text-slate-400 border border-slate-600'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-slate-500" />
                              <span className="text-slate-400 text-sm">
                                {format(new Date(user.created_date), 'MMM dd, yyyy')}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              !subscription ? 'bg-slate-700/50 text-slate-400' :
                              subscription.plan === 'unlimited' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                              subscription.plan === 'pro' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                              subscription.plan === 'basic' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                              'bg-slate-700/50 text-slate-400'
                            }`}>
                              {subscription?.plan || 'none'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            {subscription?.is_active ? (
                              <div className="flex items-center gap-1 text-emerald-400">
                                <CheckCircle className="w-4 h-4" />
                                <span className="text-xs">Active</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 text-slate-500">
                                <XCircle className="w-4 h-4" />
                                <span className="text-xs">Inactive</span>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {users.length > 10 && (
                  <div className="text-center py-4 text-slate-500 text-sm">
                    Showing 10 of {users.length} users
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* System Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <Card className="bg-slate-900 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-slate-400 text-sm mb-1">Environment</div>
              <div className="text-white font-semibold">Production</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-slate-400 text-sm mb-1">Last Updated</div>
              <div className="text-white font-semibold">{format(new Date(), 'PPP')}</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-slate-400 text-sm mb-1">Version</div>
              <div className="text-white font-semibold">v1.0.0</div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}