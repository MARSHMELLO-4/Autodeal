package com.autodeal.ShreeGaneshAutodeal.service;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

import com.autodeal.ShreeGaneshAutodeal.config.SupabaseProperties;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;

@ExtendWith(MockitoExtension.class)
class SupabaseStorageServiceTest {

	@Mock
	private SupabaseProperties properties;

	@InjectMocks
	private SupabaseStorageService supabaseStorageService;

	@Nested
	@DisplayName("uploadVehicleImage Validation Tests")
	class ImageValidationTests {

		@Test
		@DisplayName("Should throw exception when file has non-image content type")
		void shouldThrowExceptionWhenFileIsNotAnImage() {
			MockMultipartFile pdfFile = new MockMultipartFile(
					"file", "document.pdf", "application/pdf", "PDF_DATA".getBytes());

			assertThatThrownBy(() -> supabaseStorageService.uploadVehicleImage(1L, pdfFile))
					.isInstanceOf(DocumentStorageException.class)
					.hasMessage("Only image files can be uploaded as vehicle photos");
		}

		@Test
		@DisplayName("Should throw exception when file is null")
		void shouldThrowExceptionWhenFileIsNull() {
			assertThatThrownBy(() -> supabaseStorageService.uploadVehicleImage(1L, null))
					.isInstanceOf(DocumentStorageException.class)
					.hasMessage("Upload file is required");
		}

		@Test
		@DisplayName("Should throw exception when file is empty")
		void shouldThrowExceptionWhenFileIsEmpty() {
			MockMultipartFile emptyFile = new MockMultipartFile(
					"file", "empty.jpg", "image/jpeg", new byte[0]);

			assertThatThrownBy(() -> supabaseStorageService.uploadVehicleImage(1L, emptyFile))
					.isInstanceOf(DocumentStorageException.class)
					.hasMessage("Upload file is required");
		}

		@Test
		@DisplayName("Should throw exception when Supabase is not configured")
		void shouldThrowExceptionWhenStorageNotConfigured() {
			MockMultipartFile imageFile = new MockMultipartFile(
					"file", "photo.jpg", "image/jpeg", "IMAGE_DATA".getBytes());

			when(properties.storageConfigured()).thenReturn(false);

			assertThatThrownBy(() -> supabaseStorageService.uploadVehicleImage(1L, imageFile))
					.isInstanceOf(DocumentStorageException.class)
					.hasMessageContaining("Supabase Storage is not configured");
		}
	}

	@Nested
	@DisplayName("uploadVehicleDocument Validation Tests")
	class DocumentValidationTests {

		@Test
		@DisplayName("Should throw exception when document file is null")
		void shouldThrowExceptionWhenDocumentFileIsNull() {
			assertThatThrownBy(() -> supabaseStorageService.uploadVehicleDocument(1L, null))
					.isInstanceOf(DocumentStorageException.class)
					.hasMessage("Upload file is required");
		}

		@Test
		@DisplayName("Should throw exception when document file is empty")
		void shouldThrowExceptionWhenDocumentFileIsEmpty() {
			MockMultipartFile emptyFile = new MockMultipartFile(
					"file", "empty.pdf", "application/pdf", new byte[0]);

			assertThatThrownBy(() -> supabaseStorageService.uploadVehicleDocument(1L, emptyFile))
					.isInstanceOf(DocumentStorageException.class)
					.hasMessage("Upload file is required");
		}

		@Test
		@DisplayName("Should throw exception when storage is not configured for document upload")
		void shouldThrowExceptionWhenStorageNotConfiguredForDoc() {
			MockMultipartFile pdfFile = new MockMultipartFile(
					"file", "rc.pdf", "application/pdf", "PDF_DATA".getBytes());

			when(properties.storageConfigured()).thenReturn(false);

			assertThatThrownBy(() -> supabaseStorageService.uploadVehicleDocument(1L, pdfFile))
					.isInstanceOf(DocumentStorageException.class)
					.hasMessageContaining("Supabase Storage is not configured");
		}
	}
}
