package com.colegio.material_service;

import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@EnableDiscoveryClient
public class MaterialServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(MaterialServiceApplication.class, args);
	}

}
