package com.colegio.announcement_service;

import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@EnableDiscoveryClient
public class AnnouncementServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(AnnouncementServiceApplication.class, args);
	}

}
