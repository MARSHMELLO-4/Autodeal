package com.autodeal.ShreeGaneshAutodeal.web;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import com.autodeal.ShreeGaneshAutodeal.dto.ApiError;
import com.autodeal.ShreeGaneshAutodeal.service.DocumentStorageException;
import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

class GlobalExceptionHandlerTest {

	private GlobalExceptionHandler exceptionHandler;

	@BeforeEach
	void setUp() {
		exceptionHandler = new GlobalExceptionHandler();
	}

	@Test
	@DisplayName("Should handle EntityNotFoundException and return 404 NOT_FOUND")
	void shouldHandleEntityNotFoundException() {
		EntityNotFoundException ex = new EntityNotFoundException("Vehicle not found: 42");

		ResponseEntity<ApiError> response = exceptionHandler.notFound(ex);

		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
		assertThat(response.getBody()).isNotNull();
		assertThat(response.getBody().status()).isEqualTo(404);
		assertThat(response.getBody().message()).isEqualTo("Vehicle not found: 42");
	}

	@Test
	@DisplayName("Should handle IllegalArgumentException and return 400 BAD_REQUEST")
	void shouldHandleIllegalArgumentException() {
		IllegalArgumentException ex = new IllegalArgumentException("Invalid vehicle price");

		ResponseEntity<ApiError> response = exceptionHandler.badRequest(ex);

		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
		assertThat(response.getBody()).isNotNull();
		assertThat(response.getBody().status()).isEqualTo(400);
		assertThat(response.getBody().message()).isEqualTo("Invalid vehicle price");
	}

	@Test
	@DisplayName("Should handle DocumentStorageException and return 400 BAD_REQUEST")
	void shouldHandleDocumentStorageException() {
		DocumentStorageException ex = new DocumentStorageException("Upload file is required");

		ResponseEntity<ApiError> response = exceptionHandler.badRequest(ex);

		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
		assertThat(response.getBody()).isNotNull();
		assertThat(response.getBody().status()).isEqualTo(400);
		assertThat(response.getBody().message()).isEqualTo("Upload file is required");
	}

	@Test
	@DisplayName("Should handle MethodArgumentNotValidException and return 400 with field errors")
	void shouldHandleValidationException() {
		MethodArgumentNotValidException ex = mock(MethodArgumentNotValidException.class);
		BindingResult bindingResult = mock(BindingResult.class);

		FieldError fieldError1 = new FieldError("vehicleRequest", "title", "must not be blank");
		FieldError fieldError2 = new FieldError("vehicleRequest", "price", "must be positive");

		when(ex.getBindingResult()).thenReturn(bindingResult);
		when(bindingResult.getFieldErrors()).thenReturn(List.of(fieldError1, fieldError2));

		ResponseEntity<ApiError> response = exceptionHandler.validation(ex);

		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
		assertThat(response.getBody()).isNotNull();
		assertThat(response.getBody().status()).isEqualTo(400);
		assertThat(response.getBody().message()).isEqualTo("Validation failed");
		assertThat(response.getBody().errors()).containsEntry("title", "must not be blank");
		assertThat(response.getBody().errors()).containsEntry("price", "must be positive");
	}

	@Test
	@DisplayName("Should handle MaxUploadSizeExceededException and return 413 PAYLOAD_TOO_LARGE")
	void shouldHandleMaxUploadSizeExceededException() {
		MaxUploadSizeExceededException ex = new MaxUploadSizeExceededException(10485760);

		ResponseEntity<ApiError> response = exceptionHandler.fileTooLarge(ex);

		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.PAYLOAD_TOO_LARGE);
		assertThat(response.getBody()).isNotNull();
		assertThat(response.getBody().status()).isEqualTo(413);
		assertThat(response.getBody().message()).isEqualTo("Uploaded file is too large");
	}
}
