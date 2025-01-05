'use client'
import { useState } from "react"
import { ReactNode } from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'

interface ReactQueryProviderProps {
  children: ReactNode;
}

const ReactQueryProvider: React.FC<ReactQueryProviderProps> = ({ children }) => {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: Infinity,
                    },
                },
            }),
    )    
    
    return (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
}

export default ReactQueryProvider