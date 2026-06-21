package com.colegio.recovery_service;

import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@EnableDiscoveryClient
public class RecoveryServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(RecoveryServiceApplication.class, args);
	}

}
