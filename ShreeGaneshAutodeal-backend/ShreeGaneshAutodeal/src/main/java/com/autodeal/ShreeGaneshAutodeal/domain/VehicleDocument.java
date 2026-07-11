package com.autodeal.ShreeGaneshAutodeal.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.Instant;

@Entity
@Table(name = "vehicle_documents")
public class VehicleDocument {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "vehicle_id", nullable = false)
	private Vehicle vehicle;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 30)
	private DocumentType type = DocumentType.OTHER;

	@Column(nullable = false, length = 160)
	private String title;

	@Column(nullable = false, length = 1400)
	private String fileUrl;

	@Column(nullable = false, length = 700)
	private String storagePath;

	@Column(length = 120)
	private String contentType;

	private Long fileSize;

	@Column(nullable = false, updatable = false)
	private Instant uploadedAt;

	@PrePersist
	void onCreate() {
		uploadedAt = Instant.now();
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Vehicle getVehicle() {
		return vehicle;
	}

	public void setVehicle(Vehicle vehicle) {
		this.vehicle = vehicle;
	}

	public DocumentType getType() {
		return type;
	}

	public void setType(DocumentType type) {
		this.type = type;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getFileUrl() {
		return fileUrl;
	}

	public void setFileUrl(String fileUrl) {
		this.fileUrl = fileUrl;
	}

	public String getStoragePath() {
		return storagePath;
	}

	public void setStoragePath(String storagePath) {
		this.storagePath = storagePath;
	}

	public String getContentType() {
		return contentType;
	}

	public void setContentType(String contentType) {
		this.contentType = contentType;
	}

	public Long getFileSize() {
		return fileSize;
	}

	public void setFileSize(Long fileSize) {
		this.fileSize = fileSize;
	}

	public Instant getUploadedAt() {
		return uploadedAt;
	}
}
