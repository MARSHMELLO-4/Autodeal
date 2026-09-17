package com.autodeal.ShreeGaneshAutodeal.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.autodeal.ShreeGaneshAutodeal.domain.FuelType;
import com.autodeal.ShreeGaneshAutodeal.domain.Vehicle;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import javax.imageio.ImageIO;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class PromoImageServiceTest {

	private final PromoImageService promoImageService = new PromoImageService();

	@BeforeAll
	static void enableHeadless() {
		System.setProperty("java.awt.headless", "true");
	}

	private Vehicle buildVehicle() {
		Vehicle vehicle = new Vehicle();
		vehicle.setId(1L);
		vehicle.setTitle("Royal Enfield Classic 350 Signals Edition");
		vehicle.setBrand("Royal Enfield");
		vehicle.setModelName("Classic 350");
		vehicle.setVariantName("Signals");
		vehicle.setManufactureYear(2022);
		vehicle.setFuelType(FuelType.PETROL);
		vehicle.setKilometersDriven(12000);
		vehicle.setOwnerSerial(1);
		vehicle.setColor("Desert Sand");
		vehicle.setPrice(new BigDecimal("185000.00"));
		return vehicle;
	}

	private byte[] samplePhoto() throws Exception {
		BufferedImage photo = new BufferedImage(400, 600, BufferedImage.TYPE_INT_RGB);
		for (int x = 0; x < photo.getWidth(); x++) {
			for (int y = 0; y < photo.getHeight(); y++) {
				photo.setRGB(x, y, (x * 7 + y * 13) % 256);
			}
		}
		ByteArrayOutputStream out = new ByteArrayOutputStream();
		ImageIO.write(photo, "png", out);
		return out.toByteArray();
	}

	@Test
	@DisplayName("Should render a 1080x1920 PNG promo image from the bike photo")
	void shouldRenderPromoImage() throws Exception {
		byte[] result = promoImageService.generatePromoImage(buildVehicle(), samplePhoto());

		assertThat(result).isNotEmpty();
		assertThat(result[0] & 0xFF).isEqualTo(0x89);
		assertThat(result[1]).isEqualTo((byte) 'P');
		assertThat(result[2]).isEqualTo((byte) 'N');
		assertThat(result[3]).isEqualTo((byte) 'G');

		BufferedImage rendered = ImageIO.read(new java.io.ByteArrayInputStream(result));
		assertThat(rendered.getWidth()).isEqualTo(1080);
		assertThat(rendered.getHeight()).isEqualTo(1920);
	}

	@Test
	@DisplayName("Should render with fallback text when price is null")
	void shouldRenderWhenPriceIsNull() throws Exception {
		Vehicle vehicle = buildVehicle();
		vehicle.setPrice(null);

		byte[] result = promoImageService.generatePromoImage(vehicle, samplePhoto());

		assertThat(result).isNotEmpty();
	}

	@Test
	@DisplayName("Should throw when input image bytes are empty")
	void shouldThrowWhenInputImageEmpty() {
		assertThatThrownBy(() -> promoImageService.generatePromoImage(buildVehicle(), new byte[0]))
				.isInstanceOf(IllegalArgumentException.class)
				.hasMessageContaining("bike photo is required");
	}

	@Test
	@DisplayName("Should throw when input bytes are not a readable image")
	void shouldThrowWhenInputIsNotAnImage() {
		assertThatThrownBy(() -> promoImageService.generatePromoImage(buildVehicle(), new byte[]{1, 2, 3, 4}))
				.isInstanceOf(IllegalArgumentException.class)
				.hasMessageContaining("Unable to read the bike photo");
	}

	@Test
	@DisplayName("Should format price using Indian digit grouping")
	void shouldFormatIndianPrices() {
		assertThat(PromoImageService.indianGrouping("185000")).isEqualTo("1,85,000");
		assertThat(PromoImageService.indianGrouping("10000000")).isEqualTo("1,00,00,000");
		assertThat(PromoImageService.indianGrouping("999")).isEqualTo("999");
	}
}