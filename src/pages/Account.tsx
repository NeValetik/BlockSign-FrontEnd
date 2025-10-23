import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { FileText, Search, Calendar, Download } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  hash: string;
  status: 'verified' | 'pending' | 'signed';
  date: string;
  size: string;
}

const Account = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [documents] = useState<Document[]>([
    {
      id: '1',
      name: 'Contract_2024.pdf',
      hash: '0x1234...5678',
      status: 'verified',
      date: '2024-01-15',
      size: '2.4 MB',
    },
    {
      id: '2',
      name: 'Agreement.pdf',
      hash: '0xabcd...efgh',
      status: 'pending',
      date: '2024-01-20',
      size: '1.8 MB',
    },
    {
      id: '3',
      name: 'Invoice_001.pdf',
      hash: '0x9876...5432',
      status: 'signed',
      date: '2024-01-10',
      size: '856 KB',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingDocuments = documents.filter(doc => doc.status === 'pending');

  const handleSavePersonalInfo = () => {
    toast.success(t('common.success'));
  };

  const handleChangePassword = () => {
    toast.success('Password changed successfully');
  };

  const handleSignDocument = (docId: string) => {
    toast.success('Document signed successfully');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'signed':
        return 'outline';
      default:
        return 'default';
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold mb-8">{t('nav.account')}</h1>

            <Tabs defaultValue="history" className="space-y-8">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
                <TabsTrigger value="history">{t('documents.history')}</TabsTrigger>
                <TabsTrigger value="pending">{t('documents.pending')}</TabsTrigger>
                <TabsTrigger value="personal">{t('account.personalInfo')}</TabsTrigger>
                <TabsTrigger value="security">{t('account.security')}</TabsTrigger>
                <TabsTrigger value="settings">{t('account.settings')}</TabsTrigger>
              </TabsList>

              {/* Document History */}
              <TabsContent value="history" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('documents.history')}</CardTitle>
                    <CardDescription>
                      View and manage your verified documents
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder={t('documents.search')}
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="verified">Verified</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="signed">Signed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      {filteredDocuments.map((doc) => (
                        <motion.div
                          key={doc.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center space-x-4 flex-1">
                            <FileText className="h-8 w-8 text-primary" />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{doc.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {doc.hash} • {doc.size}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Badge variant={getStatusColor(doc.status)}>
                              {doc.status}
                            </Badge>
                            <Button variant="ghost" size="icon">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Pending Documents */}
              <TabsContent value="pending" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('documents.pending')}</CardTitle>
                    <CardDescription>
                      Documents waiting for your signature
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {pendingDocuments.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        No pending documents
                      </p>
                    ) : (
                      pendingDocuments.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div className="flex items-center space-x-4">
                            <FileText className="h-8 w-8 text-primary" />
                            <div>
                              <p className="font-medium">{doc.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {doc.size}
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              {t('documents.preview')}
                            </Button>
                            <Button size="sm" onClick={() => handleSignDocument(doc.id)}>
                              {t('documents.sign')}
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Personal Info */}
              <TabsContent value="personal" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('account.personalInfo')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>{t('auth.fullName')}</Label>
                        <Input defaultValue={user?.fullName} />
                      </div>
                      <div className="space-y-2">
                        <Label>{t('auth.email')}</Label>
                        <Input defaultValue={user?.email} disabled />
                      </div>
                      <div className="space-y-2">
                        <Label>{t('auth.phone')}</Label>
                        <Input defaultValue={user?.phone} />
                      </div>
                      <div className="space-y-2">
                        <Label>{t('account.organization')}</Label>
                        <Input defaultValue={user?.organization} placeholder="Organization name" />
                      </div>
                      <div className="space-y-2">
                        <Label>{t('auth.idnp')}</Label>
                        <Input defaultValue={user?.idnp} />
                      </div>
                    </div>
                    <Button onClick={handleSavePersonalInfo}>{t('common.save')}</Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Security */}
              <TabsContent value="security" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('account.security')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="font-medium">{t('account.changePassword')}</h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Current Password</Label>
                          <Input type="password" />
                        </div>
                        <div className="space-y-2">
                          <Label>New Password</Label>
                          <Input type="password" />
                        </div>
                        <div className="space-y-2">
                          <Label>Confirm New Password</Label>
                          <Input type="password" />
                        </div>
                        <Button onClick={handleChangePassword}>
                          {t('account.changePassword')}
                        </Button>
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{t('account.enableMFA')}</h3>
                          <p className="text-sm text-muted-foreground">
                            Add an extra layer of security
                          </p>
                        </div>
                        <Switch />
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <h3 className="font-medium mb-4">{t('account.verifyPhone')}</h3>
                      <div className="flex space-x-2">
                        <Input placeholder="Enter verification code" />
                        <Button>Verify</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Settings */}
              <TabsContent value="settings" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('account.settings')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label>{t('account.hashingAlgorithm')}</Label>
                      <Select defaultValue="sha256">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sha256">SHA-256</SelectItem>
                          <SelectItem value="sha512">SHA-512</SelectItem>
                          <SelectItem value="md5">MD5</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>{t('account.language')}</Label>
                      <Select
                        value={i18n.language}
                        onValueChange={(value) => {
                          i18n.changeLanguage(value);
                          localStorage.setItem('language', value);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="ro">Română</SelectItem>
                          <SelectItem value="ru">Русский</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>{t('account.theme')}</Label>
                        <p className="text-sm text-muted-foreground">
                          {theme === 'light' ? t('account.light') : t('account.dark')}
                        </p>
                      </div>
                      <Switch
                        checked={theme === 'dark'}
                        onCheckedChange={toggleTheme}
                      />
                    </div>

                    <Button onClick={() => toast.success(t('common.success'))}>
                      {t('common.save')}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Account;
