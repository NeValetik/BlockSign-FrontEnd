'use client';

import { useTokenContext } from "@/contexts/tokenContext";
import { useUserContext } from "@/contexts/userContext";
import { fetchFromServer } from "@/utils/fetchFromServer";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, X, Mail, Phone, User, Calendar, Shield, Loader2, Inbox } from "lucide-react";
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
  })

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
    </Container>
  )
}

export default AdminConsolePage;