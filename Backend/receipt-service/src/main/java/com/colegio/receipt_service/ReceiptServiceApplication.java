package com.colegio.receipt_service;

import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@EnableDiscoveryClient
public class ReceiptServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(ReceiptServiceApplication.class, args);
	}

}
