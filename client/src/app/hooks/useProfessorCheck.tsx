"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, DocumentData } from "firebase/firestore";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

interface ProfessorData {
  role: string;
  email: string;
  name: string;
  uin: string;
  userId: string;
  createdAt: string;
}

interface ProfessorCheck {
  isProfessor: boolean;
  isLoading: boolean;
  professorData: ProfessorData | null;
}

export function useProfessorCheck(): ProfessorCheck {
  const [isProfessor, setIsProfessor] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [professorData, setProfessorData] = useState<ProfessorData | null>(null);
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    const checkProfessorRole = async () => {
      if (!isLoaded || !user) {
        setIsLoading(false);
        return;
      }

      try {
        const professorDoc = doc(db, "professors", user.id);
        const docSnap = await getDoc(professorDoc);
        
        if (docSnap.exists() && docSnap.data().role === "professor") {
          setIsProfessor(true);
          setProfessorData(docSnap.data() as ProfessorData);
        } else {
          router.push('/dashboard');
        }
      } catch (error) {
        console.error("Error checking professor role:", error);
        router.push('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    checkProfessorRole();
  }, [user, isLoaded, router]);

  return { isProfessor, isLoading, professorData };
}