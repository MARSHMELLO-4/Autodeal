package com.autodeal.ShreeGaneshAutodeal.domain;

import jakarta.persistence.CascadeType;
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
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "vehicles")
public class Vehicle {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, length = 180)
	private String title;

	@Column(unique = true, length = 30)
	private String registrationNumber;

	@Column(nullable = false, length = 80)
	private String brand;

	@Column(nullable = false, length = 100)
	private String modelName;

	@Column(length = 120)
	private String variantName;

	@Column(nullable = false)
	private Integer manufactureYear;

	private Integer registrationYear;

	@Column(nullable = false)
	private Integer kilometersDriven;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 20)
	private FuelType fuelType = FuelType.PETROL;

	private Integer ownerSerial;

	@Column(length = 60)
	private String color;

	@Column(nullable = false, precision = 12, scale = 2)
	private BigDecimal price;

	@Column(length = 2500)
	private String description;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 20)
	private VehicleStatus status = VehicleStatus.AVAILABLE;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "category_id", nullable = false)
	private Category category;

	@Column(length = 1200)
	private String thumbnailUrl;

	@Column(length = 120)
	private String location;

	@OneToMany(mappedBy = "vehicle", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<VehicleImage> images = new ArrayList<>();

	@OneToMany(mappedBy = "vehicle", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<VehicleDocument> documents = new ArrayList<>();

	@OneToMany(mappedBy = "vehicle", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<SaleRecord> sales = new ArrayList<>();

	@Column(nullable = false, updatable = false)
	private Instant createdAt;

	@Column(nullable = false)
	private Instant updatedAt;

	@PrePersist
	void onCreate() {
		Instant now = Instant.now();
		createdAt = now;
		updatedAt = now;
	}

	@PreUpdate
	void onUpdate() {
		updatedAt = Instant.now();
	}

	public void replaceImages(List<VehicleImage> nextImages) {
		images.clear();
		nextImages.forEach(this::addImage);
	}

	public void addImage(VehicleImage image) {
		image.setVehicle(this);
		images.add(image);
	}

	public void addDocument(VehicleDocument document) {
		document.setVehicle(this);
		documents.add(document);
	}

	public void addSale(SaleRecord saleRecord) {
		saleRecord.setVehicle(this);
		sales.add(saleRecord);
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getRegistrationNumber() {
		return registrationNumber;
	}

	public void setRegistrationNumber(String registrationNumber) {
		this.registrationNumber = registrationNumber;
	}

	public String getBrand() {
		return brand;
	}

	public void setBrand(String brand) {
		this.brand = brand;
	}

	public String getModelName() {
		return modelName;
	}

	public void setModelName(String modelName) {
		this.modelName = modelName;
	}

	public String getVariantName() {
		return variantName;
	}

	public void setVariantName(String variantName) {
		this.variantName = variantName;
	}

	public Integer getManufactureYear() {
		return manufactureYear;
	}

	public void setManufactureYear(Integer manufactureYear) {
		this.manufactureYear = manufactureYear;
	}

	public Integer getRegistrationYear() {
		return registrationYear;
	}

	public void setRegistrationYear(Integer registrationYear) {
		this.registrationYear = registrationYear;
	}

	public Integer getKilometersDriven() {
		return kilometersDriven;
	}

	public void setKilometersDriven(Integer kilometersDriven) {
		this.kilometersDriven = kilometersDriven;
	}

	public FuelType getFuelType() {
		return fuelType;
	}

	public void setFuelType(FuelType fuelType) {
		this.fuelType = fuelType;
	}

	public Integer getOwnerSerial() {
		return ownerSerial;
	}

	public void setOwnerSerial(Integer ownerSerial) {
		this.ownerSerial = ownerSerial;
	}

	public String getColor() {
		return color;
	}

	public void setColor(String color) {
		this.color = color;
	}

	public BigDecimal getPrice() {
		return price;
	}

	public void setPrice(BigDecimal price) {
		this.price = price;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public VehicleStatus getStatus() {
		return status;
	}

	public void setStatus(VehicleStatus status) {
		this.status = status;
	}

	public Category getCategory() {
		return category;
	}

	public void setCategory(Category category) {
		this.category = category;
	}

	public String getThumbnailUrl() {
		return thumbnailUrl;
	}

	public void setThumbnailUrl(String thumbnailUrl) {
		this.thumbnailUrl = thumbnailUrl;
	}

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}

	public List<VehicleImage> getImages() {
		return images;
	}

	public List<VehicleDocument> getDocuments() {
		return documents;
	}

	public List<SaleRecord> getSales() {
		return sales;
	}

	public Instant getCreatedAt() {
		return createdAt;
	}

	public Instant getUpdatedAt() {
		return updatedAt;
	}
}
