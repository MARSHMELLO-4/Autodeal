package com.autodeal.ShreeGaneshAutodeal.service;

import com.autodeal.ShreeGaneshAutodeal.domain.Vehicle;
import java.awt.BasicStroke;
import java.awt.Color;
import java.awt.Font;
import java.awt.FontMetrics;
import java.awt.GradientPaint;
import java.awt.Graphics2D;
import java.awt.RenderingHints;
import java.awt.geom.RoundRectangle2D;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import javax.imageio.ImageIO;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

/**
 * Renders a deterministic, offline 9:16 promotional image (1080x1920 PNG) for a vehicle by
 * compositing the bike photo onto a branded template and drawing the exact text overlay.
 */
@Service
public class PromoImageService {

	private static final int WIDTH = 1080;
	private static final int HEIGHT = 1920;

	private static final Color GOLD = new Color(0xE2B453);
	private static final Color CREAM = new Color(0xF7F1E7);
	private static final Color MUTED = new Color(0xC9C1B4);
	private static final Color DARK = new Color(0x17130E);
	private static final Color GRADIENT_TOP = new Color(0x2F271A);
	private static final Color GRADIENT_BOTTOM = new Color(0x131009);

	private static final Font FONT_REGULAR = loadFont("fonts/Poppins-Regular.ttf", Font.PLAIN);
	private static final Font FONT_SEMIBOLD = loadFont("fonts/Poppins-SemiBold.ttf", Font.PLAIN);
	private static final Font FONT_BOLD = loadFont("fonts/Poppins-Bold.ttf", Font.PLAIN);
	private static final Font FONT_EXTRABOLD = loadFont("fonts/Poppins-ExtraBold.ttf", Font.PLAIN);

	private final RestClient restClient;

	public PromoImageService() {
		this.restClient = RestClient.builder().build();
	}

	public byte[] generatePromoImage(Vehicle vehicle, byte[] inputImage) {
		if (inputImage == null || inputImage.length == 0) {
			throw new IllegalArgumentException("A bike photo is required to generate the shareable image");
		}

		BufferedImage bikePhoto;
		try {
			bikePhoto = ImageIO.read(new ByteArrayInputStream(inputImage));
		} catch (IOException ex) {
			bikePhoto = null;
		}
		if (bikePhoto == null) {
			throw new IllegalArgumentException("Unable to read the bike photo. Make sure it is a valid image file.");
		}

		BufferedImage canvas = new BufferedImage(WIDTH, HEIGHT, BufferedImage.TYPE_INT_RGB);
		Graphics2D g = canvas.createGraphics();
		try {
			g.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
			g.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_ON);
			g.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
			g.setRenderingHint(RenderingHints.KEY_RENDERING, RenderingHints.VALUE_RENDER_QUALITY);

			drawBackground(g);
			drawBrand(g);
			drawPhotoCard(g, bikePhoto);
			drawTitle(g, vehicle);
			drawPrice(g, vehicle.getPrice());
			drawHighlights(g, vehicle);
			drawCta(g);
			drawFooter(g);
		} finally {
			g.dispose();
		}

		ByteArrayOutputStream out = new ByteArrayOutputStream();
		try {
			ImageIO.write(canvas, "png", out);
		} catch (IOException ex) {
			throw new IllegalStateException("Unable to encode the promotional image.", ex);
		}
		return out.toByteArray();
	}

	public byte[] downloadBikeImage(String url) {
		try {
			return restClient.get()
					.uri(url)
					.header(HttpHeaders.USER_AGENT, "ShreeGaneshAutodeal-Backend")
					.retrieve()
					.body(byte[].class);
		} catch (RuntimeException ex) {
			throw new IllegalArgumentException("Unable to download the bike photo for the shareable image.", ex);
		}
	}

	private void drawBackground(Graphics2D g) {
		g.setPaint(new GradientPaint(0, 0, GRADIENT_TOP, 0, HEIGHT, GRADIENT_BOTTOM));
		g.fillRect(0, 0, WIDTH, HEIGHT);

		Color glow = new Color(226, 180, 83, 46);
		for (int radius = 720; radius > 0; radius -= 120) {
			g.setColor(glow);
			g.fillOval(WIDTH / 2 - radius, 660 - radius / 2, radius * 2, radius);
		}
	}

	private void drawBrand(Graphics2D g) {
		drawLetterspaced(g, "SHREE GANESH AUTODEAL", at(FONT_EXTRABOLD, 46), GOLD, 8, WIDTH / 2, 158);
		g.setColor(GOLD);
		g.setStroke(new BasicStroke(3f));
		g.drawLine(WIDTH / 2 - 220, 190, WIDTH / 2 + 220, 190);
	}

	private void drawPhotoCard(Graphics2D g, BufferedImage bikePhoto) {
		int cardX = 60;
		int cardY = 252;
		int cardW = WIDTH - 120;
		int cardH = 1008;

		g.setColor(new Color(0, 0, 0, 90));
		g.fill(new RoundRectangle2D.Double(cardX + 12, cardY + 18, cardW, cardH, 44, 44));

		g.setClip(new RoundRectangle2D.Double(cardX, cardY, cardW, cardH, 40, 40));
		double scale = Math.max(cardW / (double) bikePhoto.getWidth(), cardH / (double) bikePhoto.getHeight());
		int drawW = (int) Math.ceil(bikePhoto.getWidth() * scale);
		int drawH = (int) Math.ceil(bikePhoto.getHeight() * scale);
		g.drawImage(bikePhoto, cardX + (cardW - drawW) / 2, cardY + (cardH - drawH) / 2, drawW, drawH, null);
		g.setClip(null);

		g.setColor(new Color(226, 180, 83, 90));
		g.setStroke(new BasicStroke(5f));
		g.draw(new RoundRectangle2D.Double(cardX, cardY, cardW, cardH, 40, 40));
	}

	private void drawTitle(Graphics2D g, Vehicle vehicle) {
		String title = vehicle.getTitle();
		if (title == null || title.isBlank()) {
			title = String.join(" ", vehicle.getBrand(), vehicle.getModelName()).trim();
		}

		Font font = at(FONT_BOLD, 58);
		List<String> lines = wrapText(g, title, font, 940);
		if (lines.size() > 2) {
			lines = List.of(lines.get(0), lines.get(1));
		}

		g.setColor(CREAM);
		g.setFont(font);
		FontMetrics fm = g.getFontMetrics();
		if (lines.size() == 1) {
			g.drawString(lines.get(0), (WIDTH - fm.stringWidth(lines.get(0))) / 2f, 1332f);
		} else {
			g.drawString(lines.get(0), (WIDTH - fm.stringWidth(lines.get(0))) / 2f, 1300f);
			g.drawString(lines.get(1), (WIDTH - fm.stringWidth(lines.get(1))) / 2f, 1382f);
		}
	}

	private void drawPrice(Graphics2D g, BigDecimal price) {
		String priceText = price == null ? "Best Price" : "Rs " + formatIndianPrice(price);
		Font font = at(FONT_EXTRABOLD, 92);
		g.setFont(font);
		g.setColor(GOLD);
		FontMetrics fm = g.getFontMetrics();
		g.drawString(priceText, (WIDTH - fm.stringWidth(priceText)) / 2f, 1490f);
	}

	private void drawHighlights(Graphics2D g, Vehicle vehicle) {
		List<String> parts = new ArrayList<>();
		parts.add(String.valueOf(vehicle.getManufactureYear()));
		if (vehicle.getFuelType() != null) {
			parts.add(vehicle.getFuelType().name());
		}
		parts.add(vehicle.getKilometersDriven() + " km");
		if (vehicle.getColor() != null && !vehicle.getColor().isBlank()) {
			parts.add(vehicle.getColor().trim());
		}

		String highlights = String.join(" | ", parts);
		Font font = at(FONT_SEMIBOLD, 42);
		g.setFont(font);
		g.setColor(MUTED);
		FontMetrics fm = g.getFontMetrics();
		if (fm.stringWidth(highlights) > WIDTH - 120) {
			g.setFont(at(FONT_SEMIBOLD, 36));
			fm = g.getFontMetrics();
		}
		g.drawString(highlights, (WIDTH - fm.stringWidth(highlights)) / 2f, 1582f);
	}

	private void drawCta(Graphics2D g) {
		String cta = "Visit our showroom today!";
		Font font = at(FONT_BOLD, 46);
		g.setFont(font);
		FontMetrics fm = g.getFontMetrics();
		int textW = fm.stringWidth(cta);
		int pillW = textW + 110;
		int pillH = 106;
		int pillX = (WIDTH - pillW) / 2;
		int pillY = 1664;

		g.setColor(GOLD);
		g.fill(new RoundRectangle2D.Double(pillX, pillY, pillW, pillH, pillH / 2.0, pillH / 2.0));
		g.setColor(DARK);
		g.drawString(cta, (WIDTH - textW) / 2f, pillY + 72f);
	}

	private void drawFooter(Graphics2D g) {
		Font font = at(FONT_REGULAR, 34);
		g.setFont(font);
		g.setColor(MUTED);
		FontMetrics fm = g.getFontMetrics();
		String footer = "Indore \u00B7 MP  \u2022  +91 89828 83521";
		g.drawString(footer, (WIDTH - fm.stringWidth(footer)) / 2f, 1806f);
	}

	private static void drawLetterspaced(Graphics2D g, String text, Font font, Color color,
			double tracking, int centerX, double baselineY) {
		g.setFont(font);
		g.setColor(color);
		FontMetrics fm = g.getFontMetrics();
		double total = 0;
		for (int i = 0; i < text.length(); i++) {
			total += fm.charWidth(text.charAt(i)) + (i < text.length() - 1 ? tracking : 0);
		}
		double x = centerX - total / 2.0;
		for (int i = 0; i < text.length(); i++) {
			g.drawString(text.substring(i, i + 1), (float) x, (float) baselineY);
			x += fm.charWidth(text.charAt(i)) + tracking;
		}
	}

	private static List<String> wrapText(Graphics2D g, String text, Font font, int maxWidth) {
		g.setFont(font);
		FontMetrics fm = g.getFontMetrics();
		List<String> lines = new ArrayList<>();
		StringBuilder current = new StringBuilder();
		for (String word : text.trim().split("\\s+")) {
			String candidate = current.length() == 0 ? word : current + " " + word;
			if (fm.stringWidth(candidate) <= maxWidth) {
				current = new StringBuilder(candidate);
			} else {
				if (current.length() > 0) {
					lines.add(current.toString());
				}
				current = new StringBuilder(word);
			}
		}
		if (current.length() > 0) {
			lines.add(current.toString());
		}
		return lines.isEmpty() ? List.of(text) : lines;
	}

	private static String formatIndianPrice(BigDecimal price) {
		return indianGrouping(price.setScale(0, RoundingMode.HALF_UP).toBigInteger().toString());
	}

	static String indianGrouping(String plain) {
		if (plain == null || plain.length() <= 3) {
			return plain;
		}
		String last3 = plain.substring(plain.length() - 3);
		String rest = plain.substring(0, plain.length() - 3);
		int first = rest.length() % 2;
		StringBuilder out = new StringBuilder();
		int start = 0;
		if (first > 0) {
			out.append(rest, 0, first);
			start = first;
			if (start < rest.length()) {
				out.append(',');
			}
		}
		while (start < rest.length()) {
			int next = Math.min(start + 2, rest.length());
			out.append(rest, start, next);
			start = next;
			if (start < rest.length()) {
				out.append(',');
			}
		}
		return out.append(',').append(last3).toString();
	}

	private static Font at(Font font, float size) {
		return font.deriveFont(size);
	}

	private static Font loadFont(String resourcePath, int fallbackStyle) {
		try (InputStream in = PromoImageService.class.getResourceAsStream("/" + resourcePath)) {
			if (in != null) {
				Font font = Font.createFont(Font.TRUETYPE_FONT, in);
				return font.deriveFont(Font.PLAIN, 12f);
			}
		} catch (IOException | java.awt.FontFormatException ex) {
			// fall through to logical font
		}
		return new Font("Dialog", fallbackStyle, 12);
	}
}