package com.autodeal.ShreeGaneshAutodeal.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.Instant;

@Entity
@Table(
		name = "vehicle_clicks",
		indexes = {
				@Index(name = "idx_vehicle_clicks_vehicle", columnList = "vehicle_id"),
				@Index(name = "idx_vehicle_clicks_clicked_at", columnList = "clicked_at"),
				@Index(name = "idx_vehicle_clicks_region", columnList = "region")
		})
public class VehicleClick {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "vehicle_id", nullable = false)
	private Vehicle vehicle;

	@Column(name = "ip_hash", nullable = false, length = 64)
	private String ipHash;

	@Column(length = 80)
	private String country;

	@Column(length = 120)
	private String region;

	@Column(length = 120)
	private String city;

	@Column(name = "user_agent", length = 512)
	private String userAgent;

	@Column(length = 1000)
	private String referrer;

	@Column(nullable = false, length = 40)
	private String source;

	@Column(name = "clicked_at", nullable = false)
	private Instant clickedAt;

	@PrePersist
	void onCreate() {
		if (clickedAt == null) {
			clickedAt = Instant.now();
		}
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

	public String getIpHash() {
		return ipHash;
	}

	public void setIpHash(String ipHash) {
		this.ipHash = ipHash;
	}

	public String getCountry() {
		return country;
	}

	public void setCountry(String country) {
		this.country = country;
	}

	public String getRegion() {
		return region;
	}

	public void setRegion(String region) {
		this.region = region;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public String getUserAgent() {
		return userAgent;
	}

	public void setUserAgent(String userAgent) {
		this.userAgent = userAgent;
	}

	public String getReferrer() {
		return referrer;
	}

	public void setReferrer(String referrer) {
		this.referrer = referrer;
	}

	public String getSource() {
		return source;
	}

	public void setSource(String source) {
		this.source = source;
	}

	public Instant getClickedAt() {
		return clickedAt;
	}

	public void setClickedAt(Instant clickedAt) {
		this.clickedAt = clickedAt;
	}
}
