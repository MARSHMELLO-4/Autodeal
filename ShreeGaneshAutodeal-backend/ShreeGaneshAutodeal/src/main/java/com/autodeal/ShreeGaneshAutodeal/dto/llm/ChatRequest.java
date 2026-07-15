package com.autodeal.ShreeGaneshAutodeal.dto.llm;

import java.util.List;

public record ChatRequest (
        String model,
        List<Message>messages,
        double temperature
) {
}
