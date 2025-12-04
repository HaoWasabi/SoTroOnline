"use client";

import ContractCard from "./contract-card";
import type { Contract } from "../types/contract";
import { useEffect, useState, useCallback, useMemo } from "react";
import { getAllActiveContractsPaged } from "../api/api-quan-ly-hop-dong";
import PaginationComponent from "@/components/pagination";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface GridOfContractCardProps {
  refreshTrigger?: number;
  searchTerm?: string;
  selectedFilter?: string;
  startDate?: Date;
  endDate?: Date;
}

export default function GridOfContractCard({ 
  refreshTrigger, 
  searchTerm = "", 
  selectedFilter = "",
  startDate,
  endDate
}: GridOfContractCardProps) {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [allContracts, setAllContracts] = useState<Contract[]>([]); // Store all contracts for filtering
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
        const contractsData = res.data.content;
        setAllContracts(contractsData); // Store all contracts
        setContracts(contractsData);
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

  // Enhanced filtering with useMemo for better performance
  const filteredContracts = useMemo(() => {
    if (!allContracts.length) return [];
    
    let filtered = [...allContracts];
    
    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(contract => {
        // Search by contract ID (maHopDongPhong) or room ID (maPhong)
        const contractIdMatch = contract.maHopDongPhong?.toString().toLowerCase().includes(searchLower);
        const roomIdMatch = contract.maPhong?.toString().toLowerCase().includes(searchLower);
        const roomNameMatch = contract.tenPhong?.toLowerCase().includes(searchLower);
        // Use tenKhachThue from backend response, not tenKhachDaiDien
        const tenantNameMatch = (contract as any).tenKhachThue?.toLowerCase().includes(searchLower);
        // Also check maKhachDaiDien and maKhachThue fields
        const tenantIdMatch = contract.maKhachDaiDien?.toString().toLowerCase().includes(searchLower) ||
                             contract.maKhachThue?.toString().toLowerCase().includes(searchLower);
        
        return contractIdMatch || roomIdMatch || roomNameMatch || tenantNameMatch || tenantIdMatch;
      });
    }
    
    // Apply status filter
    if (selectedFilter.trim()) {
      const filterLower = selectedFilter.toLowerCase();
      filtered = filtered.filter(contract => {
        if (filterLower.includes('active') || filterLower.includes('hoạt động')) {
          return contract.trangThai === 'hoatDong';
        }
        if (filterLower.includes('expired') || filterLower.includes('hết hạn')) {
          // Check if contract is expired
          if (contract.ngayKetThuc) {
            const endDate = new Date(contract.ngayKetThuc);
            const now = new Date();
            return endDate < now && contract.trangThai === 'hoatDong';
          }
        }
        return true;
      });
    }
    
    // Apply date range filter - filter contracts that have ANY overlap with the date range
    if (startDate || endDate) {
      filtered = filtered.filter(contract => {
        if (!contract.ngayBatDau || !contract.ngayKetThuc) return false;
        
        const contractStart = new Date(contract.ngayBatDau);
        const contractEnd = new Date(contract.ngayKetThuc);
        
        // Set time to start/end of day for accurate comparison
        const searchStart = startDate ? new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 0, 0, 0) : null;
        const searchEnd = endDate ? new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 23, 59, 59) : null;
        
        // Check for overlap: contract overlaps with search period if:
        // contract start <= search end AND contract end >= search start
        if (searchStart && searchEnd) {
          // Both dates provided - check for any overlap
          return contractStart <= searchEnd && contractEnd >= searchStart;
        } else if (searchStart) {
          // Only start date provided - contracts that end after start date
          return contractEnd >= searchStart;
        } else if (searchEnd) {
          // Only end date provided - contracts that start before end date
          return contractStart <= searchEnd;
        }
        
        return true;
      });
    }
    
    return filtered;
  }, [searchTerm, selectedFilter, startDate, endDate, allContracts]);
  
  // Update state when filtered results change
  useEffect(() => {
    setCurrentPage(0); // Reset to first page when filter changes
  }, [filteredContracts]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Calculate pagination for filtered results
  const startIndex = currentPage * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedContracts = filteredContracts.slice(startIndex, endIndex);
  const filteredTotalPages = Math.ceil(filteredContracts.length / pageSize);
  const filteredHasNext = currentPage < filteredTotalPages - 1;
  const filteredHasPrevious = currentPage > 0;
  
  console.log('🔍 Contract Filtering Debug:', {
    searchTerm, 
    selectedFilter, 
    startDate: startDate?.toISOString(), 
    endDate: endDate?.toISOString(),
    totalContracts: allContracts.length, 
    filteredCount: filteredContracts.length,
    currentPage,
    paginatedCount: paginatedContracts.length
  });

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
        <p className="text-gray-600">
          {searchTerm || selectedFilter 
            ? "No contracts match your search criteria."
            : "No contracts found."
          }
        </p>
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
            {filteredContracts.length} contract{filteredContracts.length !== 1 ? 's' : ''}
            {(searchTerm || selectedFilter) && (
              <span className="text-sm text-blue-600 font-normal">
                {" "}
                (filtered from {allContracts.length} total)
              </span>
            )}
          </p>
          <p className="text-sm text-gray-600">
            Showing {paginatedContracts.length} of {filteredContracts.length} contracts
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
        {paginatedContracts.length > 0 ? (
          paginatedContracts.map((contract) => (
            <ContractCard 
              key={String(contract.maHopDongPhong)} 
              contract={contract} 
              onUpdate={handleContractUpdate}
              onDelete={handleContractDelete}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500">
              {searchTerm || selectedFilter 
                ? "No contracts match your search criteria."
                : "No contracts available."
              }
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredTotalPages > 1 && (
        <div className="flex justify-center py-4">
          <PaginationComponent
            currentPage={currentPage}
            totalPages={filteredTotalPages}
            onPageChange={handlePageChange}
            hasNext={filteredHasNext}
            hasPrevious={filteredHasPrevious}
          />
        </div>
      )}
    </div>
  );
}