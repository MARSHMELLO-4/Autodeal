package com.autodeal.ShreeGaneshAutodeal.service;

import org.hibernate.engine.spi.SessionImplementor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender){
        this.mailSender = mailSender;
    }

    private String subject = "Verification Mail - Shree Ganesh Autodeal";

    @Value("${spring.mail.username}")
    private String senderMail;

    public void sendOtpEmail(String email, String otp) {

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(senderMail);
        message.setTo(email);
        message.setSubject(subject);

        String body = "Please find the otp attached with this mail " + otp;

        message.setText(body);

        mailSender.send(message);

//        System.out.println("Message sent successfully to " + email);


        System.out.println(
                "OTP for " + email + " = " + otp
        );
    }
}
