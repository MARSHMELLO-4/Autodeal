package com.autodeal.ShreeGaneshAutodeal.config;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
@SpringBootTest
@AutoConfigureMockMvc
class SecurityConfigTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void adminEndpointWithoutApiKeyShouldReturn401()
            throws Exception {

        mockMvc.perform(
                        post("/api/admin/vehicles")
                )
                .andExpect(status().isUnauthorized());
    }

    @Test
    void adminEndpointWithWrongApiKeyShouldReturn401()
            throws Exception {

        mockMvc.perform(
                        post("/api/admin/vehicles")
                                .header("X-ADMIN-KEY", "wrong-key")
                )
                .andExpect(status().isUnauthorized());
    }

    @Test
    void publicCatalogShouldWorkWithoutApiKey()
            throws Exception {

        mockMvc.perform(
                        get("/api/catalog/vehicles")
                )
                .andExpect(status().isOk());
    }
}
