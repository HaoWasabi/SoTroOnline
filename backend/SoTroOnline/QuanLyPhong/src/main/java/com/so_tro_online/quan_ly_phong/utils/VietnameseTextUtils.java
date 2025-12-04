package com.so_tro_online.quan_ly_phong.utils;

import java.text.Normalizer;
import java.util.regex.Pattern;

public class VietnameseTextUtils {
    
    private static final Pattern DIACRITICS_AND_FRIENDS = Pattern.compile("[\\p{InCombiningDiacriticalMarks}\\p{IsLm}\\p{IsSk}]+");
    
    /**
     * Normalizes Vietnamese text by removing accents and converting to lowercase
     * @param text The text to normalize
     * @return The normalized text
     */
    public static String normalizeVietnameseText(String text) {
        if (text == null) {
            return null;
        }
        
        // First normalize using Java's built-in normalizer
        String normalized = Normalizer.normalize(text, Normalizer.Form.NFD);
        
        // Remove diacritical marks
        normalized = DIACRITICS_AND_FRIENDS.matcher(normalized).replaceAll("");
        
        // Handle special Vietnamese characters that NFD doesn't handle
        normalized = normalized
            .replace("đ", "d")
            .replace("Đ", "d")
            .replace("ð", "d")
            .replace("Ð", "d");
        
        // Convert to lowercase for case-insensitive comparison
        return normalized.toLowerCase().trim();
    }
    
    /**
     * Checks if two Vietnamese texts are equivalent (ignoring accents and case)
     * @param text1 First text
     * @param text2 Second text
     * @return true if texts are equivalent
     */
    public static boolean isEquivalent(String text1, String text2) {
        return normalizeVietnameseText(text1).equals(normalizeVietnameseText(text2));
    }
    
    /**
     * Checks if text contains the search term (ignoring accents and case)
     * @param text The text to search in
     * @param searchTerm The term to search for
     * @return true if text contains the search term
     */
    public static boolean containsIgnoreAccents(String text, String searchTerm) {
        if (text == null || searchTerm == null) {
            return false;
        }
        
        String normalizedText = normalizeVietnameseText(text);
        String normalizedSearchTerm = normalizeVietnameseText(searchTerm);
        
        return normalizedText.contains(normalizedSearchTerm);
    }
}