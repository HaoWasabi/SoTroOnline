-- Migration script to update phieu_thu table 
-- Remove ma_khach_dai_dien and add ma_khach foreign key reference

USE so_tro_online;

-- Step 1: Add the new ma_khach column
ALTER TABLE phieu_thu 
ADD COLUMN ma_khach int DEFAULT NULL AFTER ma_hoa_don;

-- Step 2: Copy data from ma_khach_dai_dien to ma_khach
-- Since ma_khach_dai_dien was a foreign key to khach_thue.ma_khach, we can copy directly
UPDATE phieu_thu 
SET ma_khach = ma_khach_dai_dien 
WHERE ma_khach_dai_dien IS NOT NULL;

-- Step 3: Add foreign key constraint for ma_khach
ALTER TABLE phieu_thu 
ADD CONSTRAINT FK_phieu_thu_khach_thue 
FOREIGN KEY (ma_khach) REFERENCES khach_thue(ma_khach) 
ON DELETE CASCADE ON UPDATE CASCADE;

-- Step 4: Drop the old ma_khach_dai_dien column and its constraint
ALTER TABLE phieu_thu DROP FOREIGN KEY FKkqyx48vge1ays3fv5mp7tia6s;
ALTER TABLE phieu_thu DROP COLUMN ma_khach_dai_dien;

-- Step 5: Verify the changes
SELECT 'PhieuThu migration completed' as status, COUNT(*) as total_records 
FROM phieu_thu;