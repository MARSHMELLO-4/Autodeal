package com.autodeal.ShreeGaneshAutodeal.dto.llm;

import java.util.List;

public record ChatResponse(
        List<Choice> choices
) {

    public record Choice(
            ResponseMessage message
    ) {
    }

    public record ResponseMessage(
            String content
    ) {
    }
}