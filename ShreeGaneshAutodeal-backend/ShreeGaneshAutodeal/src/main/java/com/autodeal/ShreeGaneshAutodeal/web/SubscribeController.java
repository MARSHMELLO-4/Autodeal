package com.autodeal.ShreeGaneshAutodeal.web;


import com.autodeal.ShreeGaneshAutodeal.dto.OtpRequest;
import com.autodeal.ShreeGaneshAutodeal.dto.OtpVerificationRequest;
import com.autodeal.ShreeGaneshAutodeal.service.SubscriberService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/subscribers")
public class SubscribeController {

    private final SubscriberService subscriberService;

    public SubscribeController(SubscriberService subscriberService){
        this.subscriberService = subscriberService;
    }

    @PostMapping("/request-otp")
    public ResponseEntity<?> requestOtp(
            @Valid @RequestBody OtpRequest request) {

        subscriberService.requestOtp(request.email());

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "OTP sent to your email"
                )
        );
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(
            @Valid @RequestBody OtpVerificationRequest request) {

        subscriberService.verifyOtp(
                request.email(),
                request.otp()
        );

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Email verified successfully"
                )
        );
    }


}
