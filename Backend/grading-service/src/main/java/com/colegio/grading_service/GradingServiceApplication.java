package com.colegio.grading_service;

import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@EnableDiscoveryClient
public class GradingServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(GradingServiceApplication.class, args);
	}

}
