package com.autodeal.ShreeGaneshAutodeal.web;

import com.autodeal.ShreeGaneshAutodeal.dto.ApiError;
import com.autodeal.ShreeGaneshAutodeal.service.DocumentStorageException;
import jakarta.persistence.EntityNotFoundException;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(EntityNotFoundException.class)
	public ResponseEntity<ApiError> notFound(EntityNotFoundException ex) {
		return ResponseEntity.status(HttpStatus.NOT_FOUND)
				.body(ApiError.of(HttpStatus.NOT_FOUND.value(), ex.getMessage()));
	}

	@ExceptionHandler({ IllegalArgumentException.class, DocumentStorageException.class })
	public ResponseEntity<ApiError> badRequest(RuntimeException ex) {
		return ResponseEntity.badRequest()
				.body(ApiError.of(HttpStatus.BAD_REQUEST.value(), ex.getMessage()));
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<ApiError> validation(MethodArgumentNotValidException ex) {
		Map<String, String> errors = new LinkedHashMap<>();
		for (FieldError fieldError : ex.getBindingResult().getFieldErrors()) {
			errors.put(fieldError.getField(), fieldError.getDefaultMessage());
		}
		return ResponseEntity.badRequest()
				.body(ApiError.of(HttpStatus.BAD_REQUEST.value(), "Validation failed", errors));
	}

	@ExceptionHandler(MaxUploadSizeExceededException.class)
	public ResponseEntity<ApiError> fileTooLarge(MaxUploadSizeExceededException ex) {
		return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE)
				.body(ApiError.of(HttpStatus.PAYLOAD_TOO_LARGE.value(), "Uploaded file is too large"));
	}
}
