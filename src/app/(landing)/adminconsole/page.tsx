'use client';

import { useTokenContext } from "@/contexts/tokenContext";
import { useUserContext } from "@/contexts/userContext";
import { fetchFromServer } from "@/utils/fetchFromServer";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, X } from "lucide-react";
import { redirect } from "next/navigation";
import { useLayoutEffect, useState } from "react";

import Container from "@/components/Container";
import Button from "@/components/Form/Button";

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

const AdminConsolePage = () => {
  const { me } = useUserContext();
  const [ userPendingDecline, setUserPendingDecline ] = useState<string[]>([]);
  const [ userPendingApprove, setUserPendingApprove ] = useState<string[]>([]);
  // const isDev = process.env.NODE_ENV === "development";

  const isAdmin = me?.role === "ADMIN";
  const { token } = useTokenContext();
  const queryClient = useQueryClient();

  useLayoutEffect(()=>{
    if ( !isAdmin ) {
      redirect("/");
    }
  })

  const { data: userRequests } = useQuery<{items: UserRequest[]}>({
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
      // Invalidate and refetch the admin-console query
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
      // Invalidate and refetch the admin-console query
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

  return (
    <Container className="flex flex-col gap-4 items-center">
      <h1>Admin Console</h1>
      <div className="flex flex-col gap-4">
        {userRequests?.items?.map((item) => (
          <div key={item.id} className="flex gap-2 w-full">
            <h2>{item.fullName}</h2>
            <p>{item.email}</p>
            <p>{item.phone}</p>
            <p>{item.idnp}</p>
            <p>{item.status}</p>
            <Button 
              onClick={() => handleApprove(item.id)}
              variant="outline"
              className="border-brand text-brand"
              disabled={userPendingApprove.includes(item.id)}
            >
              <Check />
            </Button>
            <Button 
              onClick={() => handleDecline(item.id)}
              variant="outline"
              className="border-destructive text-destructive"
              disabled={userPendingDecline.includes(item.id)}
            >
              <X />
            </Button>
          </div>
        ))}
        {!userRequests?.items?.length && (
          <div
            className="flex flex-col gap-2 items-center justify-center text-2xl"
          >
            No requests found
          </div>
        )}
      </div>
    </Container>
  )
}

export default AdminConsolePage;