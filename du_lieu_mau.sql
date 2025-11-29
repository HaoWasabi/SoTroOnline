-- tai_khoan --
INSERT INTO tai_khoan (dien_thoai, email, ho_ten, ma_can_cuoc, mat_khau, ngay_sinh, ngay_tao, thuong_tru, trang_thai)
VALUES
('0912345678', 'quanly1@example.com', 'Nguyễn Văn An', '001200000001', '123456', '1999-01-01', NOW(), 'Hà Nội', 'hoatDong'),
('0912345679', 'quanly2@example.com', 'Trần Thị Bình', '001200000002', '123456', '1998-02-10', NOW(), 'Hà Nội', 'hoatDong'),
('0912345680', 'quanly3@example.com', 'Phạm Văn Cường', '001200000003', '123456', '1997-03-15', NOW(), 'Hải Phòng', 'hoatDong'),
('0912345681', 'quanly4@example.com', 'Lê Thị Dung', '001200000004', '123456', '1996-04-20', NOW(), 'Đà Nẵng', 'hoatDong'),
('0912345682', 'quanly5@example.com', 'Đỗ Văn Em', '001200000005', '123456', '1995-05-25', NOW(), 'HCM', 'hoatDong'),
('0912345683', 'quanly6@example.com', 'Hoàng Thị Hạnh', '001200000006', '123456', '1994-06-12', NOW(), 'Cần Thơ', 'hoatDong'),
('0912345684', 'quanly7@example.com', 'Vũ Văn Khang', '001200000007', '123456', '1993-07-07', NOW(), 'Hà Nam', 'hoatDong'),
('0912345685', 'quanly8@example.com', 'Ngô Thị Lan', '001200000008', '123456', '1992-08-18', NOW(), 'Nghệ An', 'hoatDong'),
('0912345686', 'quanly9@example.com', 'Bùi Văn Minh', '001200000009', '123456', '1991-09-22', NOW(), 'Thanh Hóa', 'hoatDong'),
('0912345687', 'quanly10@example.com', 'Phan Thị Ngọc', '001200000010', '123456', '1990-10-30', NOW(), 'Huế', 'hoatDong');


-- khach_thue -- 
INSERT INTO khach_thue (ma_khach, email, ma_can_cuoc, ho_ten, dien_thoai, thuong_tru, ngay_sinh, ngay_tao, trang_thai, ma_nguoi_quan_ly) VALUES (1, 'huynhhaidat@gmail.com', '377701563042', 'Huỳnh Hải Đạt',  '0373910855', 'Bình Dương', '1978-08-31', '2025-10-30 09:06:43', 'daXoa');
INSERT INTO khach_thue (ma_khach, email, ma_can_cuoc, ho_ten, dien_thoai, thuong_tru, ngay_sinh, ngay_tao, trang_thai, ma_nguoi_quan_ly) VALUES (2, 'dohuudat@gmail.com', '770753388798', 'Đỗ Hữu Đạt', '0627165659', 'Bình Dương', '1967-11-10', '2025-10-30 09:06:43', 'hoatdong');
INSERT INTO khach_thue (ma_khach, email, ma_can_cuoc, ho_ten, dien_thoai, thuong_tru, ngay_sinh, ngay_tao, trang_thai, ma_nguoi_quan_ly) VALUES (3, 'hoangvandat@gmail.com', '451136735867', 'Hoàng Văn Đạt', '0311159467', 'Cần Thơ', '2004-05-26', '2025-10-30 09:06:43', 'hoatdong');
INSERT INTO khach_thue (ma_khach, email, ma_can_cuoc, ho_ten, dien_thoai, thuong_tru, ngay_sinh, ngay_tao, trang_thai, ma_nguoi_quan_ly) VALUES (4, 'dangthanhhang@gmail.com', '235970024915', 'Đặng Thanh Hằng', '0126402784', 'Bình Dương', '1984-07-12', '2025-10-30 09:06:43', 'daXoa');
INSERT INTO khach_thue (ma_khach, email, ma_can_cuoc, ho_ten, dien_thoai, thuong_tru, ngay_sinh, ngay_tao, trang_thai, ma_nguoi_quan_ly) VALUES (5, 'tranngochang@gmail.com', '516452834154', 'Trần Ngọc Hằng', '0200583278', 'Thanh Hóa', '2000-05-08', '2025-10-30 09:06:43', 'daxoa');
INSERT INTO khach_thue (ma_khach, email, ma_can_cuoc, ho_ten, dien_thoai, thuong_tru, ngay_sinh, ngay_tao, trang_thai, ma_nguoi_quan_ly) VALUES (6, 'dothanhtrang@gmail.com', '593997825827', 'Đỗ Thanh Trang','0775856649', 'Huế', '1993-08-25', '2025-10-30 09:06:43', 'daxoa');
INSERT INTO khach_thue (ma_khach, email, ma_can_cuoc, ho_ten, dien_thoai, thuong_tru, ngay_sinh, ngay_tao, trang_thai, ma_nguoi_quan_ly) VALUES (7, '937489045595', 'Phan Hữu Dũng', 'phanhuudung@gmail.com', '0255695733', 'Cần Thơ', '1969-12-05', '2025-10-30 09:06:43', 'hoatdong');
INSERT INTO khach_thue (ma_khach, email, ma_can_cuoc, ho_ten, dien_thoai, thuong_tru, ngay_sinh, ngay_tao, trang_thai, ma_nguoi_quan_ly) VALUES (8, '694112808043', 'Nguyễn Thị Tuấn', '0618237876', 'Hải Phòng', '1994-08-05', '2025-10-30 09:06:43', 'hoatdong');
INSERT INTO khach_thue (ma_khach, email, ma_can_cuoc, ho_ten, dien_thoai, thuong_tru, ngay_sinh, ngay_tao, trang_thai, ma_nguoi_quan_ly) VALUES (9, '659254498000', 'Hồ Đức Trang', '0371185123', 'Quảng Ninh', '2006-02-26', '2025-10-30 09:06:43', 'hoatdong');
INSERT INTO khach_thue (ma_khach, email, ma_can_cuoc, ho_ten, dien_thoai, thuong_tru, ngay_sinh, ngay_tao, trang_thai, ma_nguoi_quan_ly) VALUES (10, '986295567983', 'Hồ Minh Phương', '0585612615', 'Quảng Ninh', '2001-02-18', '2025-10-30 09:06:43', 'hoatdong');
INSERT INTO khach_thue (ma_khach, email, ma_can_cuoc, ho_ten, dien_thoai, thuong_tru, ngay_sinh, ngay_tao, trang_thai, ma_nguoi_quan_ly) VALUES (11, '370733690530', 'Hoàng Thị Nam', '0474419704', 'Bình Dương', '1979-11-10', '2025-10-30 09:06:43', 'daxoa');
INSERT INTO khach_thue (ma_khach, email, ma_can_cuoc, ho_ten, dien_thoai, thuong_tru, ngay_sinh, ngay_tao, trang_thai, ma_nguoi_quan_ly) VALUES (12, '246359985144', 'Phan Hải Tuấn', '0506803759', 'Thanh Hóa', '2001-01-22', '2025-10-30 09:06:43', 'hoatdong');
INSERT INTO khach_thue (ma_khach, email, ma_can_cuoc, ho_ten, dien_thoai, thuong_tru, ngay_sinh, ngay_tao, trang_thai, ma_nguoi_quan_ly) VALUES (13, '240005001699', 'Bùi Văn Tuấn', '0234854182', 'TP. Hồ Chí Minh', '1967-08-09', '2025-10-30 09:06:43', 'daxoa');
INSERT INTO khach_thue (ma_khach, email, ma_can_cuoc, ho_ten, dien_thoai, thuong_tru, ngay_sinh, ngay_tao, trang_thai, ma_nguoi_quan_ly) VALUES (14, '271830779423', 'Huỳnh Văn Đạt', '0871700095', 'Cần Thơ', '1999-04-30', '2025-10-30 09:06:43', 'daxoa');
INSERT INTO khach_thue (ma_khach, email, ma_can_cuoc, ho_ten, dien_thoai, thuong_tru, ngay_sinh, ngay_tao, trang_thai, ma_nguoi_quan_ly) VALUES (15, '460167785084', 'Bùi Anh Tú', '0847938886', 'Cần Thơ', '1972-09-02', '2025-10-30 09:06:43', 'daxoa');
INSERT INTO khach_thue (ma_khach, email, ma_can_cuoc, ho_ten, dien_thoai, thuong_tru, ngay_sinh, ngay_tao, trang_thai, ma_nguoi_quan_ly) VALUES (16, '554780106983', 'Trần Đức Trang', '0503417487', 'Hà Nội', '1965-02-14', '2025-10-30 09:06:43', 'hoatdong');
INSERT INTO khach_thue (ma_khach, email, ma_can_cuoc, ho_ten, dien_thoai, thuong_tru, ngay_sinh, ngay_tao, trang_thai, ma_nguoi_quan_ly) VALUES (17, '725889105981', 'Võ Văn Nam', '0247922630', 'Hải Phòng', '2005-10-07', '2025-10-30 09:06:43', 'hoatdong');
INSERT INTO khach_thue (ma_khach, email, ma_can_cuoc, ho_ten, dien_thoai, thuong_tru, ngay_sinh, ngay_tao, trang_thai, ma_nguoi_quan_ly) VALUES (18, '940058154473', 'Nguyễn Hữu Nam', '0356420548', 'Thanh Hóa', '1969-12-27', '2025-10-30 09:06:43', 'daxoa');
INSERT INTO khach_thue (ma_khach, email, ma_can_cuoc, ho_ten, dien_thoai, thuong_tru, ngay_sinh, ngay_tao, trang_thai, ma_nguoi_quan_ly) VALUES (19, '398959941002', 'Trần Văn Nam', '0440219918', 'Huế', '1978-01-14', '2025-10-30 09:06:43', 'daxoa');
INSERT INTO khach_thue (ma_khach, email, ma_can_cuoc, ho_ten, dien_thoai, thuong_tru, ngay_sinh, ngay_tao, trang_thai, ma_nguoi_quan_ly) VALUES (20, '173962016137', 'Đặng Thanh Linh', '0208377980', 'Cần Thơ', '2007-08-04', '2025-10-30 09:06:43', 'hoatdong');
INSERT INTO khach_thue (ma_khach, email, ma_can_cuoc, ho_ten, dien_thoai, thuong_tru, ngay_sinh, ngay_tao, trang_thai, ma_nguoi_quan_ly) VALUES (21, '465659318889', 'Hoàng Khánh Thảo', '0949610139', 'Bình Dương', '1996-05-17', '2025-10-30 09:06:43', 'daxoa');
INSERT INTO khach_thue (ma_khach, email, ma_can_cuoc, ho_ten, dien_thoai, thuong_tru, ngay_sinh, ngay_tao, trang_thai, ma_nguoi_quan_ly) VALUES (22, '731136976175', 'Nguyễn Khánh Tú', '0686107168', 'Huế', '1986-04-14', '2025-10-30 09:06:43', 'hoatdong');
INSERT INTO khach_thue (ma_khach, email, ma_can_cuoc, ho_ten, dien_thoai, thuong_tru, ngay_sinh, ngay_tao, trang_thai, ma_nguoi_quan_ly) VALUES (23, '458328738778', 'Đặng Văn Tuấn', '0222792435', 'Thanh Hóa', '1972-08-22', '2025-10-30 09:06:43', 'daxoa');
INSERT INTO khach_thue (ma_khach, email, ma_can_cuoc, ho_ten, dien_thoai, thuong_tru, ngay_sinh, ngay_tao, trang_thai, ma_nguoi_quan_ly) VALUES (24, '528007188068', 'Đặng Anh Nam', '0935114162', 'Nghệ An', '1975-10-18', '2025-10-30 09:06:43', 'daxoa');
INSERT INTO khach_thue (ma_khach, email, ma_can_cuoc, ho_ten, dien_thoai, thuong_tru, ngay_sinh, ngay_tao, trang_thai, ma_nguoi_quan_ly) VALUES (25, '135831775566', 'Lê Minh Lan', '0537265917', 'Thanh Hóa', '1970-09-01', '2025-10-30 09:06:43', 'daxoa');
INSERT INTO khach_thue (ma_khach, email, ma_can_cuoc, ho_ten, dien_thoai, thuong_tru, ngay_sinh, ngay_tao, trang_thai, ma_nguoi_quan_ly) VALUES (26, '414485466648', 'Hoàng Khánh Tuấn', '0711264035', 'Thanh Hóa', '1972-04-16', '2025-10-30 09:06:43', 'daxoa');
INSERT INTO khach_thue (ma_khach, email, ma_can_cuoc, ho_ten, dien_thoai, thuong_tru, ngay_sinh, ngay_tao, trang_thai, ma_nguoi_quan_ly) VALUES (27, '304459058813', 'Hồ Hữu Dũng', '0537800238', 'Hải Phòng', '2006-07-10', '2025-10-30 09:06:43', 'daxoa');
INSERT INTO khach_thue (ma_khach, email, ma_can_cuoc, ho_ten, dien_thoai, thuong_tru, ngay_sinh, ngay_tao, trang_thai, ma_nguoi_quan_ly) VALUES (28, '150096028241', 'Đặng Hữu Hùng', '0284878082', 'Hải Phòng', '2007-11-12', '2025-10-30 09:06:43', 'daxoa', 2);
INSERT INTO khach_thue (ma_khach, email, ma_can_cuoc, ho_ten, dien_thoai, thuong_tru, ngay_sinh, ngay_tao, trang_thai, ma_nguoi_quan_ly) VALUES (29, '995172667084', 'Phạm Khánh Tú', '0607682971', 'Hà Nội', '1992-05-05', '2025-10-30 09:06:43', 'hoatdong', 2);
INSERT INTO khach_thue (ma_khach, email, ma_can_cuoc, ho_ten, dien_thoai, thuong_tru, ngay_sinh, ngay_tao, trang_thai, ma_nguoi_quan_ly) VALUES (30, '318580852451', 'Nguyễn Hải Thảo', '0636103048', 'TP. Hồ Chí Minh', '2005-08-17', '2025-10-30 09:06:43', 'daxoa', 2);
INSERT INTO khach_thue (ma_khach, email, ma_can_cuoc, ho_ten, dien_thoai, thuong_tru, ngay_sinh, ngay_tao, trang_thai, ma_nguoi_quan_ly) VALUES (31, '970555623169', 'Nguyễn Hải Lan', '0910975832', 'Hải Phòng', '1972-06-07', '2025-10-30 09:06:43', 'daxoa', 2);
INSERT INTO khach_thue (ma_khach, email, ma_can_cuoc, ho_ten, dien_thoai, thuong_tru, ngay_sinh, ngay_tao, trang_thai, ma_nguoi_quan_ly) VALUES (32, '468640900244', 'Hoàng Ngọc Hằng', '0516440896', 'Hà Nội', '1991-09-29', '2025-10-30 09:06:43', 'hoatdong', 2);
INSERT INTO khach_thue (ma_khach, email, ma_can_cuoc, ho_ten, dien_thoai, thuong_tru, ngay_sinh, ngay_tao, trang_thai, ma_nguoi_quan_ly) VALUES (33, '365123199813', 'Phạm Thị Hùng', '0514981382', 'Quảng Ninh', '1988-03-27', '2025-10-30 09:06:43', 'daxoa', 2);
INSERT INTO khach_thue (ma_khach, email, ma_can_cuoc, ho_ten, dien_thoai, thuong_tru, ngay_sinh, ngay_tao, trang_thai, ma_nguoi_quan_ly) VALUES (34, '533422359740', 'Đỗ Minh Trang', '0366767712', 'Bình Dương', '1990-04-21', '2025-10-30 09:06:43', 'hoatdong', 2);
INSERT INTO khach_thue (ma_khach, email, ma_can_cuoc, ho_ten, dien_thoai, thuong_tru, ngay_sinh, ngay_tao, trang_thai, ma_nguoi_quan_ly) VALUES (35, '158148271609', 'Võ Văn Nam', '0906411185', 'Huế', '1996-06-25', '2025-10-30 09:06:43', 'hoatdong', 2);
INSERT INTO khach_thue (ma_khach, email, ma_can_cuoc, ho_ten, dien_thoai, thuong_tru, ngay_sinh, ngay_tao, trang_thai, ma_nguoi_quan_ly) VALUES (36, '232877505602', 'Bùi Thanh Đạt', '0982815757', 'Nghệ An', '1997-09-08', '2025-10-30 09:06:43', 'hoatdong', 2);
INSERT INTO khach_thue (ma_khach, email, ma_can_cuoc, ho_ten, dien_thoai, thuong_tru, ngay_sinh, ngay_tao, trang_thai, ma_nguoi_quan_ly) VALUES (37, '229666516436', 'Hoàng Hải Trang', '0931943945', 'Bình Dương', '2002-12-06', '2025-10-30 09:06:43', 'hoatdong', 2);
INSERT INTO khach_thue (ma_khach, email, ma_can_cuoc, ho_ten, dien_thoai, thuong_tru, ngay_sinh, ngay_tao, trang_thai, ma_nguoi_quan_ly) VALUES (38, '287452806918', 'Nguyễn Hải Thảo', '0860032314', 'Hà Nội', '2005-04-15', '2025-10-30 09:06:43', 'daxoa', 2);
INSERT INTO khach_thue (ma_khach, email, ma_can_cuoc, ho_ten, dien_thoai, thuong_tru, ngay_sinh, ngay_tao, trang_thai, ma_nguoi_quan_ly) VALUES (39, '677535337728', 'Phạm Đức Tuấn', '0628398897', 'Hải Phòng', '1996-08-01', '2025-10-30 09:06:43', 'hoatdong', 2);
INSERT INTO khach_thue (ma_khach, email, ma_can_cuoc, ho_ten, dien_thoai, thuong_tru, ngay_sinh, ngay_tao, trang_thai, ma_nguoi_quan_ly) VALUES (40, '506141721260', 'Phan Đức Tuấn', '0583743341', 'Đà Nẵng', '1990-02-20', '2025-10-30 09:06:43', 'hoatdong', 2);
INSERT INTO khach_thue (ma_khach, email, ma_can_cuoc, ho_ten, dien_thoai, thuong_tru, ngay_sinh, ngay_tao, trang_thai, ma_nguoi_quan_ly) VALUES (41, '415669023816', 'Phạm Khánh Phương', '0349020904', 'Huế', '1998-11-23', '2025-10-30 09:06:43', 'daxoa', 2);
INSERT INTO khach_thue (ma_khach, email, ma_can_cuoc, ho_ten, dien_thoai, thuong_tru, ngay_sinh, ngay_tao, trang_thai, ma_nguoi_quan_ly) VALUES (42, '479199479665', 'Hồ Thanh Tuấn', '0730483872', 'Hải Phòng', '1982-12-12', '2025-10-30 09:06:43', 'daxoa', 2);
INSERT INTO khach_thue (ma_khach, email, ma_can_cuoc, ho_ten, dien_thoai, thuong_tru, ngay_sinh, ngay_tao, trang_thai, ma_nguoi_quan_ly) VALUES (43, '334521726963', 'Nguyễn Ngọc Đạt', '0986200001', 'Cần Thơ', '1966-07-05', '2025-10-30 09:06:43', 'daxoa', 2);
INSERT INTO khach_thue (ma_khach, email, ma_can_cuoc, ho_ten, dien_thoai, thuong_tru, ngay_sinh, ngay_tao, trang_thai, ma_nguoi_quan_ly) VALUES (44, '261110239893', 'Huỳnh Thanh Thảo', '0890055998', 'Cần Thơ', '1991-11-26', '2025-10-30 09:06:43', 'daxoa');
INSERT INTO khach_thue (ma_khach, email, ma_can_cuoc, ho_ten, dien_thoai, thuong_tru, ngay_sinh, ngay_tao, trang_thai, ma_nguoi_quan_ly) VALUES (45, '281692448516', 'Hoàng Anh Hùng', '0621114145', 'Hải Phòng', '1980-11-29', '2025-10-30 09:06:43', 'hoatdong', 2);
INSERT INTO khach_thue (ma_khach, email, ma_can_cuoc, ho_ten, dien_thoai, thuong_tru, ngay_sinh, ngay_tao, trang_thai, ma_nguoi_quan_ly) VALUES (46, '910464678235', 'Hoàng Hải Tú', '0813668092', 'Hà Nội', '1989-03-31', '2025-10-30 09:06:43', 'daxoa', 2);
INSERT INTO khach_thue (ma_khach, email, ma_can_cuoc, ho_ten, dien_thoai, thuong_tru, ngay_sinh, ngay_tao, trang_thai, ma_nguoi_quan_ly) VALUES (47, '820110491845', 'Phạm Khánh Tú', '0328590851', 'Nghệ An', '1984-10-26', '2025-10-30 09:06:43', 'daxoa', 2);
INSERT INTO khach_thue (ma_khach, email, ma_can_cuoc, ho_ten, dien_thoai, thuong_tru, ngay_sinh, ngay_tao, trang_thai, ma_nguoi_quan_ly) VALUES (48, '323491967009', 'Đặng Văn Tuấn', '0559855375', 'Đà Nẵng', '1978-09-07', '2025-10-30 09:06:43', 'hoatdong', 2);
INSERT INTO khach_thue (ma_khach, email, ma_can_cuoc, ho_ten, dien_thoai, thuong_tru, ngay_sinh, ngay_tao, trang_thai, ma_nguoi_quan_ly) VALUES (49, '545786287477', 'Phạm Thị Dũng', '0760685956', 'Quảng Ninh', '1980-04-20', '2025-10-30 09:06:43', 'daxoa', 2);
INSERT INTO khach_thue (ma_khach, email, ma_can_cuoc, ho_ten, dien_thoai, thuong_tru, ngay_sinh, ngay_tao, trang_thai, ma_nguoi_quan_ly) VALUES (50, '155746726252', 'Lê Thanh Linh', '0982324956', 'Quảng Ninh', '1969-01-10', '2025-10-30 09:06:43', 'hoatdong', 2);

-- dich_vu --
INSERT INTO dich_vu (ma_quan_ly, ten_dich_vu, don_gia_co_ban, don_vi_co_ban, mo_ta, trang_thai) VALUES
(7, 'Điện sinh hoạt', 3500, 'kWh', 'Dịch vụ cung cấp điện cho phòng trọ', 'hoatDong'),
(7, 'Nước sinh hoạt', 12000, 'm³', 'Dịch vụ cung cấp nước cho phòng trọ', 'hoatDong'),
(8, 'Internet Wifi', 100000, 'tháng', 'Gói cước Internet tốc độ cao', 'hoatDong'),
(8, 'Gửi xe máy', 50000, 'tháng', 'Phí gửi xe máy trong khu trọ', 'hoatDong'),
(9, 'Vệ sinh phòng', 80000, 'lần', 'Dịch vụ dọn vệ sinh phòng trọ theo yêu cầu', 'baoTri'),
(7, 'Thu gom rác', 15000, 'tháng', 'Phí thu gom và xử lý rác thải', 'hoatDong'),
(9, 'Nước uống bình 20L', 18000, 'bình', 'Nước uống tinh khiết loại bình 20 lít', 'hoatDong'),
(10, 'Sửa chữa điện nước', 50000, 'lần', 'Dịch vụ xử lý các vấn đề điện nước hỏng', 'baoTri'),
(7, 'Dịch vụ giữ đồ', 30000, 'tháng', 'Giữ đồ cá nhân có khóa riêng', 'hoatDong'),
(11, 'Dọn vệ sinh khu vực công cộng', 20000, 'tháng', 'Phí vệ sinh hành lang, sân, khu chung', 'hoatDong');

-- phong_tro --
INSERT INTO phong (chieu_dai, chieu_rong, dia_chi, gia_thue_co_ban, loai_phong, ten_phong, trang_thai, vat_dung, ma_quan_ly) VALUES
(4.0, 3.5, 'Số 1 - Hà Nội', 1200000, 'Phòng đơn', 'Phòng 1', 'phongTrong', 'Giường, Tủ, Quạt', 1),
(4.2, 3.6, 'Số 2 - Hà Nội', 1300000, 'Phòng đơn', 'Phòng 2', 'phongTrong', 'Giường, Tủ, Quạt', 1),
(4.5, 4.0, 'Số 3 - Hà Nội', 1500000, 'Phòng đôi', 'Phòng 3', 'phongTrong', 'Giường, Tủ, Điều hòa', 1),
(5.0, 4.2, 'Số 4 - Hà Nội', 1700000, 'Phòng đôi', 'Phòng 4', 'phongTrong', 'Giường, Tủ, Điều hòa', 1),
(3.8, 3.2, 'Số 5 - HCM', 1100000, 'Phòng đơn', 'Phòng 5', 'baoTri', 'Giường, Quạt', 1),
(4.0, 3.5, 'Số 6 - HCM', 1250000, 'Phòng đơn', 'Phòng 6', 'phongTrong', 'Giường, Quạt', 1),
(4.8, 4.1, 'Số 7 - HCM', 1600000, 'Phòng đôi', 'Phòng 7', 'phongTrong', 'Giường, Điều hòa', 1),
(4.1, 3.9, 'Số 8 - HCM', 1350000, 'Phòng đơn', 'Phòng 8', 'baoTri', 'Giường, Quạt', 1),
(4.9, 4.0, 'Số 9 - Đà Nẵng', 1550000, 'Phòng đôi', 'Phòng 9', 'phongTrong', 'Giường, Điều hòa', 1),
(5.2, 4.4, 'Số 10 - Đà Nẵng', 1800000, 'Phòng đôi', 'Phòng 10', 'baoTri', 'Giường, Điều hòa', 12),
(4.0, 3.5, 'Số 11 - Hà Nội', 1200000, 'Phòng đơn', 'Phòng 11', 'phongTrong', 'Giường, Tủ, Quạt', 2),
(4.2, 3.7, 'Số 12 - Hà Nội', 1300000, 'Phòng đơn', 'Phòng 12', 'phongTrong', 'Giường, Tủ, Quạt', 2),
(4.4, 3.9, 'Số 13 - Hà Nội', 1400000, 'Phòng đơn', 'Phòng 13', 'baoTri', 'Giường, Quạt', 2),
(4.1, 3.6, 'Số 14 - Hà Nội', 1250000, 'Phòng đơn', 'Phòng 14', 'phongTrong', 'Giường, Tủ', 2),
(4.3, 3.8, 'Số 15 - Hà Nội', 1350000, 'Phòng đơn', 'Phòng 15', 'phongTrong', 'Giường, Quạt', 2),
(4.7, 4.0, 'Số 16 - Hà Nội', 1550000, 'Phòng đôi', 'Phòng 16', 'phongTrong', 'Giường, Điều hòa', 2),
(4.9, 4.2, 'Số 17 - Hà Nội', 1650000, 'Phòng đôi', 'Phòng 17', 'phongTrong', 'Giường, Điều hòa', 2),
(5.1, 4.3, 'Số 18 - HCM', 1750000, 'Phòng đôi', 'Phòng 18', 'baoTri', 'Giường, Điều hòa', 2),
(4.3, 3.6, 'Số 19 - HCM', 1300000, 'Phòng đơn', 'Phòng 19', 'phongTrong', 'Giường, Quạt', 2),
(4.1, 3.4, 'Số 20 - HCM', 1150000, 'Phòng đơn', 'Phòng 20', 'phongTrong', 'Giường, Quạt', 2),
(4.0, 3.5, 'Số 21 - HCM', 1200000, 'Phòng đơn', 'Phòng 21', 'baoTri', 'Giường, Quạt', 2),
(4.6, 3.9, 'Số 22 - HCM', 1450000, 'Phòng đơn', 'Phòng 22', 'phongTrong', 'Giường, Quạt', 2),
(4.9, 4.0, 'Số 23 - HCM', 1600000, 'Phòng đôi', 'Phòng 23', 'phongTrong', 'Giường, Điều hòa', 3),
(4.2, 3.8, 'Số 24 - HCM', 1350000, 'Phòng đơn', 'Phòng 24', 'baoTri', 'Giường, Tủ', 4),
(4.7, 4.1, 'Số 25 - Cần Thơ', 1500000, 'Phòng đôi', 'Phòng 25', 'phongTrong', 'Giường, Điều hòa', 5),
(4.0, 3.5, 'Số 26 - Cần Thơ', 1250000, 'Phòng đơn', 'Phòng 26', 'phongTrong', 'Giường, Quạt', 6),
(4.8, 4.0, 'Số 27 - Cần Thơ', 1550000, 'Phòng đôi', 'Phòng 27', 'phongTrong', 'Giường, Điều hòa', 7),
(4.9, 4.4, 'Số 28 - Cần Thơ', 1700000, 'Phòng đôi', 'Phòng 28', 'phongTrong', 'Giường, Điều hòa', 8),
(4.1, 3.5, 'Số 29 - Cần Thơ', 1200000, 'Phòng đơn', 'Phòng 29', 'baoTri', 'Giường, Tủ, Quạt', 9),
(4.2, 3.6, 'Số 30 - Cần Thơ', 1300000, 'Phòng đơn', 'Phòng 30', 'phongTrong', 'Giường, Tủ, Quạt', 10),
(4.3, 3.7, 'Số 31 - Đà Nẵng', 1350000, 'Phòng đơn', 'Phòng 31', 'phongTrong', 'Giường, Quạt', 1),
(4.5, 3.9, 'Số 32 - Đà Nẵng', 1450000, 'Phòng đơn', 'Phòng 32', 'baoTri', 'Giường, Quạt', 2),
(4.8, 4.0, 'Số 33 - Đà Nẵng', 1600000, 'Phòng đôi', 'Phòng 33', 'phongTrong', 'Giường, Điều hòa', 3),
(5.0, 4.2, 'Số 34 - Đà Nẵng', 1700000, 'Phòng đôi', 'Phòng 34', 'phongTrong', 'Giường, Điều hòa', 4),
(4.0, 3.5, 'Số 35 - Đà Nẵng', 1200000, 'Phòng đơn', 'Phòng 35', 'baoTri', 'Giường, Quạt', 5),
(4.6, 3.9, 'Số 36 - Đà Nẵng', 1450000, 'Phòng đơn', 'Phòng 36', 'phongTrong', 'Giường, Quạt', 6),
(4.9, 4.0, 'Số 37 - Đà Nẵng', 1600000, 'Phòng đôi', 'Phòng 37', 'baoTri', 'Giường, Điều hòa', 7),
(4.1, 3.8, 'Số 38 - Đà Nẵng', 1350000, 'Phòng đơn', 'Phòng 38', 'phongTrong', 'Giường, Quạt', 8),
(4.7, 4.0, 'Số 39 - Đà Nẵng', 1550000, 'Phòng đôi', 'Phòng 39', 'phongTrong', 'Giường, Điều hòa', 9),
(5.1, 4.3, 'Số 40 - Đà Nẵng', 1750000, 'Phòng đôi', 'Phòng 40', 'phongTrong', 'Giường, Điều hòa', 10),
(4.0, 3.5, 'Số 41 - Huế', 1200000, 'Phòng đơn', 'Phòng 41', 'phongTrong', 'Giường, Tủ, Quạt', 1),
(4.3, 3.7, 'Số 42 - Huế', 1350000, 'Phòng đơn', 'Phòng 42', 'phongTrong', 'Giường, Tủ, Quạt', 2),
(4.6, 3.9, 'Số 43 - Huế', 1500000, 'Phòng đơn', 'Phòng 43', 'phongTrong', 'Giường, Quạt', 3),
(4.9, 4.1, 'Số 44 - Huế', 1650000, 'Phòng đôi', 'Phòng 44', 'phongTrong', 'Giường, Điều hòa', 4),
(4.1, 3.5, 'Số 45 - Huế', 1250000, 'Phòng đơn', 'Phòng 45', 'phongTrong', 'Giường, Tủ', 5),
(4.8, 4.0, 'Số 46 - Huế', 1600000, 'Phòng đôi', 'Phòng 46', 'phongTrong', 'Giường, Điều hòa', 6),
(4.2, 3.6, 'Số 47 - Huế', 1300000, 'Phòng đơn', 'Phòng 47', 'phongTrong', 'Giường, Tủ', 7),
(4.5, 3.8, 'Số 48 - Huế', 1450000, 'Phòng đơn', 'Phòng 48', 'phongTrong', 'Giường, Quạt', 8),
(4.7, 4.1, 'Số 49 - Huế', 1600000, 'Phòng đôi', 'Phòng 49', 'phongTrong', 'Giường, Điều hòa', 9),
(5.0, 4.3, 'Số 50 - Huế', 1750000, 'Phòng đôi', 'Phòng 50', 'phongTrong', 'Giường, Điều hòa', 10);

-- INSERT statements for hop_dong_phong table
INSERT INTO hop_dong_phong (ma_hop_dong_phong, ngay_bat_dau, ngay_ket_thuc, ngay_tao, tien_coc, tien_phong, trang_thai, ma_khach_dai_dien, ma_phong, ma_quan_ly) VALUES
(1, '2024-01-15', '2025-01-14', '2024-01-10', 2400000, 1200000, 'hoatDong', 2, 1, 1),
(2, '2024-02-01', '2025-01-31', '2024-01-25', 2600000, 1300000, 'hoatDong', 3, 2, 2),
(3, '2024-03-10', '2025-03-09', '2024-03-05', 3000000, 1500000, 'hoatDong', 7, 4, 4),
(4, '2024-01-20', '2025-01-19', '2024-01-15', 2500000, 1250000, 'hoatDong', 8, 6, 6),
(5, '2024-04-01', '2025-03-31', '2024-03-25', 2700000, 1350000, 'hoatDong', 9, 8, 8),
(6, '2024-02-15', '2025-02-14', '2024-02-10', 3100000, 1550000, 'hoatDong', 10, 9, 9),
(7, '2024-05-01', '2025-04-30', '2024-04-25', 2600000, 1300000, 'hoatDong', 12, 12, 2),
(8, '2024-03-20', '2025-03-19', '2024-03-15', 2500000, 1250000, 'hoatDong', 16, 14, 4),
(9, '2024-04-10', '2025-04-09', '2024-04-05', 2700000, 1350000, 'hoatDong', 17, 15, 5),
(10, '2024-01-25', '2025-01-24', '2024-01-20', 3100000, 1550000, 'hoatDong', 20, 16, 6),
(11, '2024-06-01', '2025-05-31', '2024-05-25', 3300000, 1650000, 'hoatDong', 22, 17, 7),
(12, '2024-02-20', '2025-02-19', '2024-02-15', 2600000, 1300000, 'hoatDong', 29, 19, 9),
(13, '2024-03-15', '2025-03-14', '2024-03-10', 2300000, 1150000, 'hoatDong', 32, 20, 10),
(14, '2024-05-10', '2025-05-09', '2024-05-05', 2900000, 1450000, 'hoatDong', 34, 22, 2),
(15, '2024-04-20', '2025-04-19', '2024-04-15', 3000000, 1500000, 'hoatDong', 35, 25, 5),
(16, '2024-01-30', '2025-01-29', '2024-01-25', 2500000, 1250000, 'hoatDong', 36, 26, 6),
(17, '2024-06-15', '2025-06-14', '2024-06-10', 3400000, 1700000, 'hoatDong', 37, 28, 8),
(18, '2024-03-25', '2025-03-24', '2024-03-20', 2600000, 1300000, 'hoatDong', 39, 30, 10),
(19, '2024-07-01', '2025-06-30', '2024-06-25', 3200000, 1600000, 'hoatDong', 40, 33, 3),
(20, '2024-02-25', '2025-02-24', '2024-02-20', 3400000, 1700000, 'hoatDong', 45, 34, 4),
(21, '2024-05-20', '2025-05-19', '2024-05-15', 2900000, 1450000, 'hoatDong', 48, 36, 6),
(22, '2024-04-25', '2025-04-24', '2024-04-20', 2700000, 1350000, 'hoatDong', 50, 38, 8),
(23, '2024-07-10', '2025-07-09', '2024-07-05', 3500000, 1750000, 'hoatDong', 2, 40, 10),
(24, '2024-03-30', '2025-03-29', '2024-03-25', 2400000, 1200000, 'hoatDong', 3, 41, 1),
(25, '2024-06-20', '2025-06-19', '2024-06-15', 2700000, 1350000, 'hoatDong', 7, 42, 2),
(26, '2024-05-25', '2025-05-24', '2024-05-20', 3000000, 1500000, 'hoatDong', 8, 43, 3),
(27, '2024-04-30', '2025-04-29', '2024-04-25', 2500000, 1250000, 'hoatDong', 9, 45, 5),
(28, '2024-07-15', '2025-07-14', '2024-07-10', 2600000, 1300000, 'hoatDong', 10, 47, 7),
(29, '2024-08-01', '2025-07-31', '2024-07-25', 3200000, 1600000, 'hoatDong', 12, 49, 9),
(30, '2023-09-01', '2024-08-31', '2023-08-25', 2400000, 1200000, 'daXoa', 16, 3, 3),
(31, '2023-10-15', '2024-10-14', '2023-10-10', 2200000, 1100000, 'daXoa', 17, 5, 5),
(32, '2023-11-01', '2024-10-31', '2023-10-25', 3200000, 1600000, 'daXoa', 20, 7, 7),
(33, '2023-12-10', '2024-12-09', '2023-12-05', 2700000, 1350000, 'daXoa', 22, 8, 8),
(34, '2024-01-05', '2025-01-04', '2023-12-30', 3600000, 1800000, 'daXoa', 29, 10, 10),
(35, '2023-08-20', '2024-08-19', '2023-08-15', 2600000, 1300000, 'daXoa', 32, 13, 3),
(36, '2023-09-15', '2024-09-14', '2023-09-10', 3500000, 1750000, 'daXoa', 34, 18, 8),
(37, '2023-10-20', '2024-10-19', '2023-10-15', 2400000, 1200000, 'daXoa', 35, 21, 1),
(38, '2023-11-25', '2024-11-24', '2023-11-20', 2700000, 1350000, 'daXoa', 36, 24, 4),
(39, '2023-12-15', '2024-12-14', '2023-12-10', 2400000, 1200000, 'daXoa', 37, 29, 9),
(40, '2024-02-10', '2025-02-09', '2024-02-05', 2900000, 1450000, 'daXoa', 39, 32, 2),
(41, '2024-06-25', '2025-06-24', '2024-06-20', 2400000, 1200000, 'hoatDong', 40, 35, 5),
(42, '2024-08-10', '2025-08-09', '2024-08-05', 3200000, 1600000, 'hoatDong', 45, 37, 7),
(43, '2024-09-01', '2025-08-31', '2024-08-25', 2900000, 1450000, 'hoatDong', 48, 11, 1),
(44, '2024-07-20', '2025-07-19', '2024-07-15', 3100000, 1550000, 'hoatDong', 50, 23, 3),
(45, '2024-10-01', '2025-09-30', '2024-09-25', 3400000, 1700000, 'hoatDong', 2, 27, 7),
(46, '2024-08-15', '2025-08-14', '2024-08-10', 2700000, 1350000, 'hoatDong', 3, 31, 1),
(47, '2024-09-10', '2025-09-09', '2024-09-05', 3300000, 1650000, 'hoatDong', 7, 44, 4),
(48, '2024-10-05', '2025-10-04', '2024-09-30', 2900000, 1450000, 'hoatDong', 8, 48, 8),
(49, '2024-09-20', '2025-09-19', '2024-09-15', 3100000, 1550000, 'hoatDong', 9, 39, 9),
(50, '2024-10-10', '2025-10-09', '2024-10-05', 3500000, 1750000, 'hoatDong', 10, 50, 10);
