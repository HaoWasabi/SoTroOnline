package com.so_tro_online.quan_ly_hop_dong_phong.scheduler;

import com.so_tro_online.quan_ly_hop_dong_phong.service.HopDongPhongService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class ContractScheduler {
    
    @Autowired
    private HopDongPhongService hopDongPhongService;
    
    /**
     * Automatically update expired contracts every day at 00:30
     */
    @Scheduled(cron = "0 30 0 * * ?")
    public void updateExpiredContractsDaily() {
        System.out.println("Running daily contract expiration check...");
        try {
            hopDongPhongService.updateExpiredContracts();
            System.out.println("Daily contract expiration check completed successfully");
        } catch (Exception e) {
            System.err.println("Error in daily contract expiration check: " + e.getMessage());
        }
    }
    
    /**
     * Sync room statuses every day at 01:00
     */
    @Scheduled(cron = "0 0 1 * * ?")
    public void syncRoomStatusDaily() {
        System.out.println("Running daily room status sync...");
        try {
            hopDongPhongService.syncRoomStatusWithContracts();
            System.out.println("Daily room status sync completed successfully");
        } catch (Exception e) {
            System.err.println("Error in daily room status sync: " + e.getMessage());
        }
    }
    
    /**
     * Manual trigger for testing - runs every 10 minutes if enabled
     * Comment out @Scheduled annotation to disable
     */
    @Scheduled(initialDelay = 30000, fixedDelay = Long.MAX_VALUE) // Run once after 30 seconds for testing
    public void updateExpiredContractsForTesting() {
        System.out.println("=== CONTRACT SCHEDULER TEST ===");
        System.out.println("Running test contract expiration check...");
        hopDongPhongService.updateExpiredContracts();
        System.out.println("Running test room status sync...");
        hopDongPhongService.syncRoomStatusWithContracts();
        System.out.println("=== CONTRACT SCHEDULER TEST COMPLETED ===");
    }
}