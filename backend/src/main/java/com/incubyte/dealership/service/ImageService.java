package com.incubyte.dealership.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
public class ImageService {

    private static final Path UPLOAD_DIR = Paths.get("uploads");
    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
    private static final List<String> ALLOWED_EXTENSIONS = Arrays.asList("jpg", "jpeg", "png", "webp");

    public ImageService() {
        try {
            if (!Files.exists(UPLOAD_DIR)) {
                Files.createDirectories(UPLOAD_DIR);
            }
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize upload directory", e);
        }
    }

    public String saveImage(MultipartFile image) {
        validateImage(image);

        String originalFilename = image.getOriginalFilename();
        if (originalFilename == null || originalFilename.isEmpty()) {
            originalFilename = "image.jpg";
        }
        originalFilename = Paths.get(originalFilename).getFileName().toString();

        String uniqueFilename = UUID.randomUUID().toString() + "-" + originalFilename;
        Path targetPath = UPLOAD_DIR.resolve(uniqueFilename);

        try {
            Files.copy(image.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new RuntimeException("Failed to store image file on disk", e);
        }

        return "/uploads/" + uniqueFilename;
    }

    public void deleteImage(String imageUrl) {
        if (imageUrl == null || !imageUrl.startsWith("/uploads/")) {
            return;
        }
        String filename = imageUrl.substring("/uploads/".length());
        Path filePath = UPLOAD_DIR.resolve(filename);
        try {
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            // Log warning but do not interrupt flow
            System.err.println("Could not delete file: " + filePath.toAbsolutePath() + ". Error: " + e.getMessage());
        }
    }

    private void validateImage(MultipartFile image) {
        if (image == null || image.isEmpty()) {
            throw new IllegalArgumentException("Image file is empty or missing");
        }

        if (image.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("File size exceeds the limit of 5 MB");
        }

        String originalFilename = image.getOriginalFilename();
        if (originalFilename == null) {
            throw new IllegalArgumentException("Invalid file name");
        }

        int lastDotIndex = originalFilename.lastIndexOf('.');
        if (lastDotIndex == -1) {
            throw new IllegalArgumentException("File must have an extension");
        }

        String extension = originalFilename.substring(lastDotIndex + 1).toLowerCase();
        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new IllegalArgumentException("Unsupported file type. Only JPG, JPEG, PNG, and WEBP are allowed.");
        }
    }
}
