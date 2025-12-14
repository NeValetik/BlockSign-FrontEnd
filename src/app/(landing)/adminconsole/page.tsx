'use client';

import { useTokenContext } from "@/contexts/tokenContext";
import { useUserContext } from "@/contexts/userContext";
import { fetchFromServer } from "@/utils/fetchFromServer";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, X, Mail, Phone, User, Calendar, Shield, Loader2, Inbox, Wallet, BarChart3, FileText, ExternalLink, RefreshCw, Copy, CheckCircle2 } from "lucide-react";
import { redirect } from "next/navigation";
import { useLayoutEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";

import Container from "@/components/Container";
import Button from "@/components/Form/Button";

// Note: Metadata cannot be exported from client components
// Metadata is handled by the parent layout

interface UserRequest {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  idnp: string | null;
  createdAt: Date;
  status: "PENDING" | "APPROVED" | "DECLINED";
  decidedAt: Date | null;
  decidedBy: string | null;
  note: string | null;
}

interface WalletInfo {
  address: string;
  balance: string;
  totalAnchored: number;
  network: string;
  explorerBase: string;
}

interface BlockchainStats {
  totalDocuments: number;
  totalSigned: number;
  totalAnchored: number;
  anchorSuccessRate: string;
  pendingAnchoring: number;
}

interface AnchoredDocument {
  id: string;
  title: string;
  sha256Hex: string;
  blockchainTxId: string;
  blockchainNetwork: string;
  anchoredAt: Date;
  explorerUrl: string;
  status: string;
  owner: {
    fullName: string;
    username: string;
  };
}

const StatusBadge = ({ status }: { status: UserRequest['status'] }) => {
  const getStatusConfig = (status: UserRequest['status']) => {
    switch (status) {
      case "PENDING":
        return {
          bg: "bg-yellow-500",
          text: "Pending",
        };
      case "APPROVED":
        return {
          bg: "bg-brand",
          text: "Approved",
        };
      case "DECLINED":
        return {
          bg: "bg-destructive",
          text: "Declined",
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        config.bg,
        "rounded-md px-3 py-1 text-xs font-medium text-white"
      )}
    >
      {config.text}
    </motion.div>
  );
};

const AdminConsolePage = () => {
  const { me } = useUserContext();
  const [ userPendingDecline, setUserPendingDecline ] = useState<string[]>([]);
  const [ userPendingApprove, setUserPendingApprove ] = useState<string[]>([]);
  const [ activeTab, setActiveTab ] = useState<"registrations" | "blockchain">("registrations");
  const [ verifyingTxId, setVerifyingTxId ] = useState<string | null>(null);
  const [ retryingDocId, setRetryingDocId ] = useState<string | null>(null);
  const [ copiedAddress, setCopiedAddress ] = useState(false);
  const [ verificationResult, setVerificationResult ] = useState<{ transaction: { txId: string } } | null>(null);
  const [ retryDocIdInput, setRetryDocIdInput ] = useState("");

  const isAdmin = me?.role === "ADMIN";
  const { token } = useTokenContext();
  const queryClient = useQueryClient();

  useLayoutEffect(()=>{
    if ( !isAdmin ) {
      redirect("/");
    }
  })

  const { data: userRequests, isLoading } = useQuery<{items: UserRequest[]}>({
    queryKey: ["admin-console", token],
    queryFn: async () =>{ 
      const resp = await fetchFromServer(
        "/api/v1/admin/registrations", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      return resp;
    },
  });

  const { mutateAsync: approveMutate } = useMutation({
    mutationFn: async (id: string) => {
      const resp = await fetchFromServer(
        `/api/v1/admin/registrations/${id}/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      return resp;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-console"] });
    },
  });

  const { mutateAsync: declineMutate } = useMutation({
    mutationFn: async (id: string) => {
      const resp = await fetchFromServer(
        `/api/v1/admin/registrations/${id}/decline`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      return resp;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-console"] });
    },
  });

  // Wallet Info Query
  const { data: walletInfo, isLoading: walletLoading } = useQuery<WalletInfo>({
    queryKey: ["wallet-info", token],
    queryFn: async () => {
      const resp = await fetchFromServer(
        "/api/v1/admin/blockchain/wallet/info", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      return resp;
    },
    enabled: activeTab === "blockchain",
  });

  // Blockchain Stats Query
  const { data: blockchainStats, isLoading: statsLoading } = useQuery<BlockchainStats>({
    queryKey: ["blockchain-stats", token],
    queryFn: async () => {
      const resp = await fetchFromServer(
        "/api/v1/admin/blockchain/stats", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      return resp;
    },
    enabled: activeTab === "blockchain",
  });

  // Anchored Documents Query
  const { data: anchoredDocs, isLoading: docsLoading } = useQuery<{ documents: AnchoredDocument[], total: number }>({
    queryKey: ["anchored-documents", token],
    queryFn: async () => {
      const resp = await fetchFromServer(
        "/api/v1/admin/blockchain/documents", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      return resp;
    },
    enabled: activeTab === "blockchain",
  });

  // Verify Transaction Mutation
  const { mutateAsync: verifyTransaction } = useMutation({
    mutationFn: async (txId: string) => {
      const resp = await fetchFromServer(
        `/api/v1/admin/blockchain/verify/${txId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      return resp;
    },
  });

  // Retry Anchor Mutation
  const { mutateAsync: retryAnchor } = useMutation({
    mutationFn: async (docId: string) => {
      const resp = await fetchFromServer(
        `/api/v1/admin/blockchain/documents/${docId}/retry-anchor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      return resp;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["anchored-documents"] });
      queryClient.invalidateQueries({ queryKey: ["blockchain-stats"] });
      queryClient.invalidateQueries({ queryKey: ["wallet-info"] });
    },
  });

  const handleApprove = async (id: string) => {
    if (userPendingApprove.includes(id)) {
      return;
    }
    setUserPendingApprove(prev => [...prev, id]);
    approveMutate(id, {
      onSettled: () => {
        setUserPendingApprove(prev => prev.filter(pendingId => pendingId !== id));
      }
    });
  }

  const handleDecline = async (id: string) => {
    if (userPendingDecline.includes(id)) {
      return;
    }
    setUserPendingDecline(prev => [...prev, id]);
    declineMutate(id, {
      onSettled: () => {
        setUserPendingDecline(prev => prev.filter(pendingId => pendingId !== id));
      }
    });
  }

  const handleVerifyTransaction = async (txId: string) => {
    setVerifyingTxId(txId);
    try {
      const result = await verifyTransaction(txId);
      setVerificationResult(result);
    } catch (error) {
      console.error("Verification failed:", error);
    } finally {
      setVerifyingTxId(null);
    }
  };

  const handleRetryAnchor = async (docId: string) => {
    setRetryingDocId(docId);
    try {
      await retryAnchor(docId);
    } catch (error) {
      console.error("Retry anchor failed:", error);
    } finally {
      setRetryingDocId(null);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    },
  };

  const emptyStateVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    },
  };

  const items = userRequests?.items || [];
  const pendingItems = items.filter(item => item.status === "PENDING");

  return (
    <Container className="flex flex-col gap-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-3 mb-2"
      >
        <h1 className="text-3xl font-semibold text-foreground">Admin Console</h1>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        <button
          onClick={() => setActiveTab("registrations")}
          className={cn(
            "px-4 py-2 font-medium text-sm transition-colors border-b-2",
            activeTab === "registrations"
              ? "border-brand text-brand"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          User Registrations
        </button>
        <button
          onClick={() => setActiveTab("blockchain")}
          className={cn(
            "px-4 py-2 font-medium text-sm transition-colors border-b-2",
            activeTab === "blockchain"
              ? "border-brand text-brand"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          Blockchain & Wallet
        </button>
      </div>

      {activeTab === "registrations" && (
        <>
          {pendingItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-4 py-3 text-sm text-foreground"
            >
              <span className="font-medium">{pendingItems.length}</span> pending request{pendingItems.length !== 1 ? 's' : ''} awaiting review
            </motion.div>
          )}

          {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-brand" />
        </div>
      ) : items.length === 0 ? (
        <motion.div
          variants={emptyStateVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center justify-center py-16 gap-4"
        >
          <Inbox className="h-16 w-16 text-muted-foreground" />
          <p className="text-xl font-medium text-muted-foreground">No requests found</p>
          <p className="text-sm text-muted-foreground">All registration requests have been processed</p>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-4"
        >
          <AnimatePresence mode="popLayout">
            {items.map((item) => {
              const isApproving = userPendingApprove.includes(item.id);
              const isDeclining = userPendingDecline.includes(item.id);
              const isPending = item.status === "PENDING";
              
              return (
                <motion.div
                  key={item.id}
                  variants={cardVariants}
                  layout
                  whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
                  className={cn(
                    "p-6 border rounded-lg bg-card shadow-xs",
                    "transition-all duration-200",
                    isPending && "border-yellow-500/30 bg-yellow-500/5"
                  )}
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                          <User className="h-5 w-5 text-brand" />
                          <h2 className="text-xl font-semibold text-foreground">
                            {item.fullName}
                          </h2>
                          <StatusBadge status={item.status} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-8">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Email:</span>
                            <span className="text-foreground font-medium">{item.email}</span>
                          </div>

                          {item.phone && (
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">Phone:</span>
                              <span className="text-foreground font-medium">{item.phone}</span>
                            </div>
                          )}

                          {item.idnp && (
                            <div className="flex items-center gap-2 text-sm">
                              <Shield className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">IDNP:</span>
                              <span className="text-foreground font-medium">{item.idnp}</span>
                            </div>
                          )}

                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Created:</span>
                            <span className="text-foreground font-medium">
                              {new Date(item.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {isPending && (
                        <motion.div
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex gap-2 shrink-0"
                        >
                          <Button 
                            onClick={() => handleApprove(item.id)}
                            variant="brand"
                            size="sm"
                            disabled={isApproving || isDeclining}
                            className="min-w-[100px]"
                          >
                            {isApproving ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Approving...
                              </>
                            ) : (
                              <>
                                <Check className="w-4 h-4" />
                                Approve
                              </>
                            )}
                          </Button>
                          <Button 
                            onClick={() => handleDecline(item.id)}
                            variant="destructive"
                            size="sm"
                            disabled={isApproving || isDeclining}
                            className="min-w-[100px]"
                          >
                            {isDeclining ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Declining...
                              </>
                            ) : (
                              <>
                                <X className="w-4 h-4" />
                                Decline
                              </>
                            )}
                          </Button>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
        </>
      )}

      {activeTab === "blockchain" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col gap-6"
        >
          {/* Wallet Info Section */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="p-6 border rounded-lg bg-card shadow-xs"
          >
            <div className="flex items-center gap-3 mb-4">
              <Wallet className="h-5 w-5 text-brand" />
              <h2 className="text-xl font-semibold text-foreground">Wallet Information</h2>
            </div>
            {walletLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-brand" />
              </div>
            ) : walletInfo ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Wallet Address</p>
                  <div className="flex items-center gap-2">
                    <code className="text-sm font-mono bg-muted px-3 py-2 rounded flex-1 break-all">
                      {walletInfo.address}
                    </code>
                    <button
                      onClick={() => copyToClipboard(walletInfo.address)}
                      className="p-2 hover:bg-muted rounded transition-colors"
                      title="Copy address"
                    >
                      {copiedAddress ? (
                        <CheckCircle2 className="h-4 w-4 text-brand" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Balance</p>
                  <p className="text-lg font-semibold text-foreground">{walletInfo.balance}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Network</p>
                  <p className="text-foreground font-medium">{walletInfo.network}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Total Anchored Documents</p>
                  <p className="text-foreground font-medium">{walletInfo.totalAnchored}</p>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">Failed to load wallet information</p>
            )}
          </motion.div>

          {/* Blockchain Stats Section */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="p-6 border rounded-lg bg-card shadow-xs"
          >
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 className="h-5 w-5 text-brand" />
              <h2 className="text-xl font-semibold text-foreground">Blockchain Statistics</h2>
            </div>
            {statsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-brand" />
              </div>
            ) : blockchainStats ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Total Documents</p>
                    <p className="text-2xl font-bold text-foreground">{blockchainStats.totalDocuments}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Signed</p>
                    <p className="text-2xl font-bold text-brand">{blockchainStats.totalSigned}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Anchored</p>
                    <p className="text-2xl font-bold text-green-500">{blockchainStats.totalAnchored}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Success Rate</p>
                    <p className="text-2xl font-bold text-foreground">{blockchainStats.anchorSuccessRate}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Pending</p>
                    <p className="text-2xl font-bold text-yellow-500">{blockchainStats.pendingAnchoring}</p>
                  </div>
                </div>
                {blockchainStats.pendingAnchoring > 0 && (
                  <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground mb-2">
                          {blockchainStats.pendingAnchoring} document{blockchainStats.pendingAnchoring !== 1 ? 's' : ''} signed but not yet anchored
                        </p>
                        <p className="text-xs text-muted-foreground mb-3">
                          If a document failed to anchor automatically, you can retry anchoring by entering its document ID below.
                        </p>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={retryDocIdInput}
                            onChange={(e) => setRetryDocIdInput(e.target.value)}
                            placeholder="Enter document ID to retry anchoring"
                            className="flex-1 px-3 py-2 text-sm border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-brand"
                          />
                          <Button
                            variant="brand"
                            size="sm"
                            onClick={() => {
                              if (retryDocIdInput.trim()) {
                                handleRetryAnchor(retryDocIdInput.trim());
                                setRetryDocIdInput("");
                              }
                            }}
                            disabled={!retryDocIdInput.trim() || retryingDocId === retryDocIdInput.trim()}
                          >
                            {retryingDocId === retryDocIdInput.trim() ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                Retrying...
                              </>
                            ) : (
                              <>
                                <RefreshCw className="w-4 h-4 mr-1" />
                                Retry Anchor
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p className="text-muted-foreground">Failed to load statistics</p>
            )}
          </motion.div>

          {/* Anchored Documents Section */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="p-6 border rounded-lg bg-card shadow-xs"
          >
            <div className="flex items-center gap-3 mb-4">
              <FileText className="h-5 w-5 text-brand" />
              <h2 className="text-xl font-semibold text-foreground">Anchored Documents</h2>
            </div>
            {docsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-brand" />
              </div>
            ) : anchoredDocs && anchoredDocs.documents.length > 0 ? (
              <div className="space-y-4">
                {anchoredDocs.documents.map((doc) => (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-foreground">{doc.title}</h3>
                          <span className={cn(
                            "px-2 py-0.5 rounded text-xs font-medium",
                            doc.status === "SIGNED" ? "bg-green-500/20 text-green-600" : "bg-yellow-500/20 text-yellow-600"
                          )}>
                            {doc.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Owner: </span>
                            <span className="text-foreground font-medium">{doc.owner.fullName}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Anchored: </span>
                            <span className="text-foreground">
                              {new Date(doc.anchoredAt).toLocaleString()}
                            </span>
                          </div>
                          <div className="md:col-span-2">
                            <span className="text-muted-foreground">Transaction ID: </span>
                            <code className="text-xs font-mono bg-background px-2 py-1 rounded">
                              {doc.blockchainTxId}
                            </code>
                          </div>
                          <div className="md:col-span-2">
                            <span className="text-muted-foreground">SHA256: </span>
                            <code className="text-xs font-mono bg-background px-2 py-1 rounded break-all">
                              {doc.sha256Hex}
                            </code>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 shrink-0">
                        {doc.explorerUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(doc.explorerUrl, '_blank')}
                            className="text-xs"
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            View on Explorer
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleVerifyTransaction(doc.blockchainTxId)}
                          disabled={verifyingTxId === doc.blockchainTxId}
                          className="text-xs"
                        >
                          {verifyingTxId === doc.blockchainTxId ? (
                            <>
                              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                              Verifying...
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Verify
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                    {verificationResult && verificationResult.transaction?.txId === doc.blockchainTxId && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-3 p-3 bg-green-500/10 border border-green-500/20 rounded text-sm"
                      >
                        <p className="font-medium text-green-600 mb-1">Verification Result:</p>
                        <pre className="text-xs overflow-auto">
                          {JSON.stringify(verificationResult.transaction, null, 2)}
                        </pre>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <FileText className="h-16 w-16 text-muted-foreground" />
                <p className="text-lg font-medium text-muted-foreground">No anchored documents</p>
                <p className="text-sm text-muted-foreground">Documents will appear here once they are anchored to the blockchain</p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </Container>
  )
}

export default AdminConsolePage;