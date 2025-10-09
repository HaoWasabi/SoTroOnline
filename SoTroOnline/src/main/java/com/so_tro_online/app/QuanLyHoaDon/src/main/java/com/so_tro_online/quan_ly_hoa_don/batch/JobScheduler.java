package com.so_tro_online.quan_ly_hoa_don.batch;

import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component

public class JobScheduler {

    private final JobLauncher jobLauncher;
    private final Job taoHoaDonJob;

    public JobScheduler(JobLauncher jobLauncher, Job taoHoaDonJob) {
        this.jobLauncher = jobLauncher;
        this.taoHoaDonJob = taoHoaDonJob;
    }

//    @Scheduled(cron = "0 0 2 1 * *") // 2h sáng ngày 1 mỗi tháng
@Scheduled(initialDelay = 20 * 1000, fixedDelay = Long.MAX_VALUE)
    public void runJob() throws Exception {

        System.out.println("Starting job...");
        JobParameters params = new JobParametersBuilder()
                .addLong("timestamp", System.currentTimeMillis())
                .toJobParameters();
        jobLauncher.run(taoHoaDonJob, params);

    }
}
