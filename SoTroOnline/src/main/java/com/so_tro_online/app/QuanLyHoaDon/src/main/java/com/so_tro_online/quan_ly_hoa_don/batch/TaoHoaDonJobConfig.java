package com.so_tro_online.quan_ly_hoa_don.batch;

import com.so_tro_online.quan_ly_hoa_don.entity.HoaDon;
import com.so_tro_online.quan_ly_hop_dong_phong.entity.HopDongPhong;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.configuration.annotation.EnableBatchProcessing;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.batch.item.ItemReader;
import org.springframework.batch.item.ItemWriter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.PlatformTransactionManager;

@Configuration

public class TaoHoaDonJobConfig {

    @Bean
    public Job taoHoaDonJob(JobRepository jobRepository, Step taoHoaDonStep) {
        return new JobBuilder("taoHoaDonJob9", jobRepository)
                .start(taoHoaDonStep)
                .build();
    }

    @Bean
    public Step taoHoaDonStep(JobRepository jobRepository,
                              PlatformTransactionManager transactionManager,
                              ItemReader<HopDongPhong> reader,
                              ItemProcessor<HopDongPhong, HoaDon> processor,
                              ItemWriter<HoaDon> writer) {

        return new StepBuilder("taoHoaDonStep", jobRepository)
                .<HopDongPhong, HoaDon>chunk(10, transactionManager)
                .reader(reader)
                .processor(processor)
                .writer(writer)
                .build();
    }
}
