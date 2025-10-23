import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Search, UserCheck, UserX, Mail, Phone, Calendar, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

interface UserData {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: 'user' | 'admin';
  status: 'active' | 'pending' | 'suspended';
  registeredAt: string;
  documentsCount: number;
}

const Admin = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  // Mock user data
  const [users] = useState<UserData[]>([
    {
      id: '1',
      fullName: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      role: 'user',
      status: 'active',
      registeredAt: '2024-01-15',
      documentsCount: 12,
    },
    {
      id: '2',
      fullName: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+1234567891',
      role: 'user',
      status: 'pending',
      registeredAt: '2024-01-20',
      documentsCount: 0,
    },
    {
      id: '3',
      fullName: 'Admin User',
      email: 'admin@test.com',
      phone: '+1234567892',
      role: 'admin',
      status: 'active',
      registeredAt: '2024-01-01',
      documentsCount: 45,
    },
    {
      id: '4',
      fullName: 'Maria Garcia',
      email: 'maria@example.com',
      phone: '+1234567893',
      role: 'user',
      status: 'active',
      registeredAt: '2024-01-18',
      documentsCount: 8,
    },
    {
      id: '5',
      fullName: 'Alex Johnson',
      email: 'alex@example.com',
      phone: '+1234567894',
      role: 'user',
      status: 'suspended',
      registeredAt: '2024-01-10',
      documentsCount: 3,
    },
  ]);

  // Redirect if not admin
  if (user?.role !== 'admin') {
    return <Navigate to="/documents" replace />;
  }

  const filteredUsers = users.filter(u =>
    u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApproveUser = (userId: string, userName: string) => {
    toast.success(`${userName} approved successfully`);
  };

  const handleSuspendUser = (userId: string, userName: string) => {
    toast.success(`${userName} suspended`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'suspended':
        return 'destructive';
      default:
        return 'default';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    pending: users.filter(u => u.status === 'pending').length,
    suspended: users.filter(u => u.status === 'suspended').length,
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                  <Shield className="h-8 w-8 text-primary" />
                  Admin Dashboard
                </h1>
                <p className="text-muted-foreground mt-1">
                  Manage users and monitor platform activity
                </p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <p className="text-xs text-muted-foreground">Total Users</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-primary">{stats.active}</div>
                  <p className="text-xs text-muted-foreground">Active Users</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-accent">{stats.pending}</div>
                  <p className="text-xs text-muted-foreground">Pending Approval</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-destructive">{stats.suspended}</div>
                  <p className="text-xs text-muted-foreground">Suspended</p>
                </CardContent>
              </Card>
            </div>

            {/* User Management */}
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  View and manage all registered users
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="space-y-3">
                  {filteredUsers.map((userData) => (
                    <motion.div
                      key={userData.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors gap-4"
                    >
                      <div className="flex items-start md:items-center gap-4 flex-1">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {getInitials(userData.fullName)}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium">{userData.fullName}</p>
                            <Badge variant={getStatusColor(userData.status)}>
                              {userData.status}
                            </Badge>
                            {userData.role === 'admin' && (
                              <Badge variant="outline" className="bg-primary/10">
                                <Shield className="h-3 w-3 mr-1" />
                                Admin
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {userData.email}
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {userData.phone}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(userData.registeredAt).toLocaleDateString()}
                            </span>
                          </div>
                          
                          <div className="text-sm text-muted-foreground mt-1">
                            {userData.documentsCount} documents verified
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {userData.status === 'pending' && (
                          <Button
                            size="sm"
                            onClick={() => handleApproveUser(userData.id, userData.fullName)}
                          >
                            <UserCheck className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                        )}
                        {userData.status === 'active' && userData.role !== 'admin' && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleSuspendUser(userData.id, userData.fullName)}
                          >
                            <UserX className="h-4 w-4 mr-1" />
                            Suspend
                          </Button>
                        )}
                        {userData.status === 'suspended' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleApproveUser(userData.id, userData.fullName)}
                          >
                            <UserCheck className="h-4 w-4 mr-1" />
                            Reactivate
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {filteredUsers.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No users found matching your search
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Admin;
