'use client'
import { useSession } from "next-auth/react"
import { useEffect } from "react";
import axios from 'axios';
import { ReactNode } from 'react';

interface SessionReloaderProps {
  children: ReactNode;
}

const SessionReloader: React.FC<SessionReloaderProps> = ({ children }) => {
    const { data : session, status } = useSession();
  
    useEffect(() => {
      if (status == "authenticated") {
        const interval = setInterval(async () => {
          const response = await fetch("/api/session-status");
          if (!response.ok) {
            try {
              await axios.post("/api/auth/sessionApi", {
                sesionToken : session.user.token
              })
            } catch (error) {
              console.error(error)
            }
          }
        }, 5 * 60 * 1000);
    
        return () => clearInterval(interval);
      }
    }, []);
  
    return <>{children}</>;
  };
  
  export default SessionReloader;