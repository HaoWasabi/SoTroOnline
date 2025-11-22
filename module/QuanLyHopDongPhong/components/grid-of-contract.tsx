"use client";

import ContractCard from "./contract-card";
import type { Contract } from "../types/contract";
import { useEffect, useState, useCallback } from "react";
import { getAllActiveContractsPaged } from "../api/api-quan-ly-hop-dong";
import PaginationComponent from "@/components/pagination";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface GridOfContractCardProps {
  refreshTrigger?: number;
}

export default function GridOfContractCard({ refreshTrigger }: GridOfContractCardProps) {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const pageSize = 6;

  const fetchContracts = useCallback(async (page: number) => {
    try {
      setLoading(true);
      const res = await getAllActiveContractsPaged(page, pageSize);
      console.debug('Grid getAllActiveContractsPaged response:', res);
      
      if (res.status === 'success' && res.data) {
        setContracts(res.data.content);
        setCurrentPage(res.data.page);
        setTotalPages(res.data.totalPages);
        setTotalElements(res.data.totalElements);
        setHasNext(res.data.hasNext);
        setHasPrevious(res.data.hasPrevious);
        setError(null);
      } else {
        setError(res.message || 'No contracts');
      }
    } catch (e: any) {
      setError(e?.message || 'Failed to fetch contracts');
    } finally {
      setLoading(false);
    }
  }, [pageSize]);

  useEffect(() => {
    fetchContracts(0);
  }, [fetchContracts, refreshTrigger]);

  const handlePageChange = (page: number) => {
    fetchContracts(page);
  };

  const handleContractUpdate = () => {
    // Refresh current page when a contract is updated
    fetchContracts(currentPage);
  };

  const handleContractDelete = () => {
    // After deletion, check if current page is empty and go back if needed
    const newTotalElements = totalElements - 1;
    const newTotalPages = Math.ceil(newTotalElements / pageSize);
    
    if (currentPage >= newTotalPages && newTotalPages > 0) {
      // Current page will be empty, go to previous page
      fetchContracts(newTotalPages - 1);
    } else {
      // Refresh current page
      fetchContracts(currentPage);
    }
  };

  const handleRefresh = useCallback(async () => {
    await fetchContracts(currentPage);
  }, [fetchContracts, currentPage]);

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p>Loading contracts...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-600 mb-4">{error}</div>
        <Button 
          onClick={() => fetchContracts(currentPage)}
          variant="default"
          className="gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </Button>
      </div>
    );
  }

  if (contracts.length === 0) {
    return (
      <div className="p-6 text-center space-y-4">
        <p className="text-gray-600">No contracts found.</p>
        <Button 
          onClick={handleRefresh}
          variant="outline"
          size="sm"
          className="gap-2"
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with stats and refresh button */}
      <div className="flex justify-between items-center">
        <div>
          <p className="text-lg font-semibold text-gray-900">
            {totalElements} contract{totalElements !== 1 ? 's' : ''}
          </p>
          <p className="text-sm text-gray-600">
            Showing {contracts.length} of {totalElements} contracts
          </p>
        </div>
        <Button 
          onClick={handleRefresh}
          variant="outline"
          size="sm"
          className="gap-2"
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Contract grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        {contracts.map((contract) => (
          <ContractCard 
            key={String(contract.maHopDongPhong)} 
            contract={contract} 
            onUpdate={handleContractUpdate}
            onDelete={handleContractDelete}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center py-4">
          <PaginationComponent
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            hasNext={hasNext}
            hasPrevious={hasPrevious}
          />
        </div>
      )}
    </div>
  );
}