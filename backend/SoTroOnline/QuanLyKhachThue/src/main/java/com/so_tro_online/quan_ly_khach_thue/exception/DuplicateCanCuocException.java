package com.so_tro_online.quan_ly_khach_thue.exception;

public class DuplicateCanCuocException extends RuntimeException {
    public DuplicateCanCuocException(String maCanCuoc) {
        super("Can cuoc " + maCanCuoc + " is already in use.");
    }
}
