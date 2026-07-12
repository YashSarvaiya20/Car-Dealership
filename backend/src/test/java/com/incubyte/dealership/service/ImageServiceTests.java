package com.incubyte.dealership.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ImageServiceTests {

    private ImageService imageService;

    @BeforeEach
    void setUp() {
        imageService = new ImageService();
    }

    @Test
    void saveImage_WithValidImage_ShouldSaveAndReturnPath() throws IOException {
        MultipartFile file = mock(MultipartFile.class);
        when(file.isEmpty()).thenReturn(false);
        when(file.getSize()).thenReturn(100L);
        when(file.getOriginalFilename()).thenReturn("test-car.png");
        when(file.getInputStream()).thenReturn(new ByteArrayInputStream("fake image content".getBytes()));

        String path = imageService.saveImage(file);

        assertNotNull(path);
        assertTrue(path.startsWith("/uploads/"));
        assertTrue(path.endsWith("-test-car.png"));

        // Cleanup
        imageService.deleteImage(path);
    }

    @Test
    void saveImage_WithEmptyFile_ShouldThrowIllegalArgumentException() {
        MultipartFile file = mock(MultipartFile.class);
        when(file.isEmpty()).thenReturn(true);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                imageService.saveImage(file));
        assertEquals("Image file is empty or missing", ex.getMessage());
    }

    @Test
    void saveImage_WithOversizedFile_ShouldThrowIllegalArgumentException() {
        MultipartFile file = mock(MultipartFile.class);
        when(file.isEmpty()).thenReturn(false);
        when(file.getSize()).thenReturn(6 * 1024 * 1024L); // 6MB

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                imageService.saveImage(file));
        assertEquals("File size exceeds the limit of 5 MB", ex.getMessage());
    }

    @Test
    void saveImage_WithInvalidExtension_ShouldThrowIllegalArgumentException() {
        MultipartFile file = mock(MultipartFile.class);
        when(file.isEmpty()).thenReturn(false);
        when(file.getSize()).thenReturn(1024L);
        when(file.getOriginalFilename()).thenReturn("unsupported.txt");

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                imageService.saveImage(file));
        assertEquals("Unsupported file type. Only JPG, JPEG, PNG, and WEBP are allowed.", ex.getMessage());
    }

    @Test
    void deleteImage_WithValidPath_ShouldDeleteFileFromDisk() throws IOException {
        Path uploadsDir = Paths.get("uploads");
        if (!Files.exists(uploadsDir)) {
            Files.createDirectories(uploadsDir);
        }
        Path file = Files.createFile(uploadsDir.resolve("test-to-delete.jpg"));
        assertTrue(Files.exists(file));

        imageService.deleteImage("/uploads/test-to-delete.jpg");

        assertFalse(Files.exists(file));
    }
}
