package com.colegio.student_record_service;

import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@EnableDiscoveryClient
public class StudentRecordServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(StudentRecordServiceApplication.class, args);
	}

}
