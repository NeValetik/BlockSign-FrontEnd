'use client';

import { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Download,
  Share,
  MoreVertical,
  Grid3X3,
  List,
  Calendar,
  User
} from 'lucide-react';
import Container from '@/components/Container';
import Button from '@/components/Form/Button';
import { Input } from '@/components/Form/Input';
import { Badge } from '@/components/Form/Badge';
import { DropdownMenu, DropdownMenuItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/Form/DropDown';
import { useClientTranslation } from '@/hooks/useLocale';

const mockDocuments = [
  {
    id: '1',
    title: 'Contract Agreement - TechCorp',
    status: 'signed',
    date: '2024-01-15',
    participants: 3,
    type: 'Contract',
    size: '2.4 MB'
  },
  {
    id: '2', 
    title: 'NDA Template - Startup Inc',
    status: 'pending',
    date: '2024-01-14',
    participants: 2,
    type: 'Legal',
    size: '1.8 MB'
  },
  {
    id: '3',
    title: 'Employment Contract - John Doe',
    status: 'draft',
    date: '2024-01-13',
    participants: 1,
    type: 'HR',
    size: '3.2 MB'
  },
  {
    id: '4',
    title: 'Partnership Agreement - Global Corp',
    status: 'signed',
    date: '2024-01-12',
    participants: 4,
    type: 'Business',
    size: '4.1 MB'
  }
];

const DocumentsPage = () => {
  const { t } = useClientTranslation();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'signed':
        return <CheckCircle className="size-4 text-green-500" />;
      case 'pending':
        return <Clock className="size-4 text-yellow-500" />;
      case 'draft':
        return <AlertCircle className="size-4 text-gray-500" />;
      default:
        return <FileText className="size-4 text-blue-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      signed: 'default',
      pending: 'destructive', 
      draft: 'secondary'
    } as const;
    
    const statusText = {
      signed: t('documents.status.signed'),
      pending: t('documents.status.pending'),
      draft: t('documents.status.draft')
    };
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {statusText[status as keyof typeof statusText] || status}
      </Badge>
    );
  };

  return (
    <Container className="py-6 sm:py-8 md:py-12">
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              {t('documents.title')}
            </h1>
            <p className="text-muted-foreground mt-1">
              {t('documents.subtitle')}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="brand" size="sm" className="flex items-center gap-2">
              <Plus className="size-4" />
              <span className="hidden sm:inline">{t('documents.newDocument')}</span>
              <span className="sm:hidden">{t('documents.new')}</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder={t('documents.search')}
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              className="pl-10 h-10"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Filter className="size-4" />
                  <span className="hidden sm:inline">{t('documents.filter')}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setFilterStatus('all')}>
                  {t('documents.filter.all')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('signed')}>
                  {t('documents.filter.signed')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('pending')}>
                  {t('documents.filter.pending')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('draft')}>
                  {t('documents.filter.draft')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex items-center border border-border rounded-md">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid3X3 className="size-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {mockDocuments.map((doc) => (
            <div
              key={doc.id}
              className="bg-card border border-border rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getStatusIcon(doc.status)}
                  <span className="text-xs text-muted-foreground">{doc.type}</span>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Download className="size-4 mr-2" />
                      {t('documents.actions.download')}
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Share className="size-4 mr-2" />
                      {t('documents.actions.share')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                {doc.title}
              </h3>
              
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="size-3" />
                  <span>{new Date(doc.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="size-3" />
                  <span>{doc.participants} {doc.participants > 1 ? t('documents.participantsPlural') : t('documents.participants')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="size-3" />
                  <span>{doc.size}</span>
                </div>
              </div>
              
              <div className="mt-4 flex items-center justify-between">
                {getStatusBadge(doc.status)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {mockDocuments.map((doc) => (
            <div
              key={doc.id}
              className="bg-card border border-border rounded-lg p-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(doc.status)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm truncate">
                      {doc.title}
                    </h3>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                      <span>{doc.type}</span>
                      <span>{doc.size}</span>
                      <span>{doc.participants} participant{doc.participants > 1 ? 's' : ''}</span>
                      <span>{new Date(doc.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {getStatusBadge(doc.status)}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Download className="size-4 mr-2" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Share className="size-4 mr-2" />
                        Share
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {mockDocuments.length === 0 && (
        <div className="text-center py-12">
          <FileText className="size-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No documents yet</h3>
          <p className="text-muted-foreground mb-6">
            Create your first blockchain-secured document to get started.
          </p>
          <Button variant="brand">
            <Plus className="size-4 mr-2" />
            Create Document
          </Button>
        </div>
      )}
    </Container>
  );
};

export default DocumentsPage;