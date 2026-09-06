package com.autodeal.ShreeGaneshAutodeal.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.MimeMessageHelper;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    @Autowired
    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public EmailService(JavaMailSender mailSender, String senderMail) {
        this.mailSender = mailSender;
        this.senderMail = senderMail;
    }

    private String subject = "Verification Mail - Shree Ganesh Autodeal";

    @Value("${app.mail.from:noreply@autodeal.com}")
    private String senderMail;

    public void sendOtpEmail(String email, String otp) {

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(senderMail);
        message.setTo(email);
        message.setSubject(subject);

        String body = "Please find the otp attached with this mail " + otp;

        message.setText(body);

        mailSender.send(message);

        log.info("OTP sent successfully to {}", email);
    }

    public void sendVehicleAddNotification(
            String email,
            String vehicleName,
            String brand,
            String model,
            String price,
            String imageUrl
    ) throws MessagingException {

        MimeMessage message = mailSender.createMimeMessage();

        MimeMessageHelper helper =
                new MimeMessageHelper(message, true);

        helper.setFrom(senderMail);
        helper.setTo(email);
        helper.setSubject("New Vehicle Available - Shree Ganesh Autodeal");

        String imageHtml = (imageUrl != null && !imageUrl.isBlank())
                ? """
                  <img
                      src="%s"
                      alt="%s"
                      width="500"
                      style="max-width:100%%; height:auto; border-radius: 8px;"
                  />
                  """.formatted(imageUrl.trim(), vehicleName != null ? vehicleName : "Vehicle")
                : "";

        String safeVehicleName = vehicleName != null ? vehicleName : "Vehicle";
        String safeBrand = brand != null ? brand : "N/A";
        String safeModel = model != null ? model : "N/A";
        String safePrice = price != null ? price : "N/A";

        String body = """
                <html>
                    <body>

                        <h2>🏍️ New Bike Added!</h2>

                        <p>
                            A new vehicle is now available at
                            <b>Shree Ganesh Autodeal</b>.
                        </p>

                        %s

                        <h3>%s</h3>

                        <p><b>Brand:</b> %s</p>
                        <p><b>Model:</b> %s</p>
                        <p><b>Price:</b> ₹%s</p>

                        <br>

                        <p>
                            Check out this vehicle on our website.
                        </p>

                        <hr>

                        <h3>📍 Contact Us</h3>

                        <p>
                            <a href="https://www.google.com/maps/search/?api=1&query=22.6967188284087,75.85917977589764">
                                View us on Google Maps
                            </a>
                        </p>

                        <p>
                            📞 <b>Call:</b>
                            <a href="tel:+918982883521">
                                +91 8982883521
                            </a>
                        </p>

                        <p>
                            💬 <b>WhatsApp:</b>
                            <a href="https://wa.me/918982883521">
                                Chat with us
                            </a>
                        </p>

                        <p>
                            📸 <b>Instagram:</b>
                            <a href="https://www.instagram.com/sga_indore">
                                @SGA_INDORE
                            </a>
                        </p>

                        <br>

                        <p>
                            Thank you for choosing
                            <b>Shree Ganesh Autodeal</b>.
                        </p>

                    </body>
                </html>
                """.formatted(
                imageHtml,
                safeVehicleName,
                safeBrand,
                safeModel,
                safePrice
        );

        helper.setText(body, true);

        mailSender.send(message);
    }
}
