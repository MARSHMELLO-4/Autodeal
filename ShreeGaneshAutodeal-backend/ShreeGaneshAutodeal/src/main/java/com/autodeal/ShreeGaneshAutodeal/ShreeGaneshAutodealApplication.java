package com.autodeal.ShreeGaneshAutodeal;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class ShreeGaneshAutodealApplication {

	public static void main(String[] args) {

		SpringApplication.run(ShreeGaneshAutodealApplication.class, args);

		System.out.println("Application started at 9090");
	}

}
