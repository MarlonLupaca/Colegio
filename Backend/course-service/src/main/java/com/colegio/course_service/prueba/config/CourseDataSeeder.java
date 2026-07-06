package com.colegio.course_service.prueba.config;

import com.colegio.course_service.prueba.entity.AcademicArea;
import com.colegio.course_service.prueba.entity.Course;
import com.colegio.course_service.prueba.entity.EducationLevel;
import com.colegio.course_service.prueba.service.CourseService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CourseDataSeeder {

    @Bean
    CommandLineRunner initCourses(CourseService courseService) {
        return args -> {
            if (courseService.getAllCourses().isEmpty()) {
                System.out.println("🌱 Insertando cursos base (Seed) en Course Service...");

                // =========================================================================
                // 1. SEED DE CURSOS PARA PRIMARIA (Grados 1 al 6)
                // =========================================================================
                for (int grado = 1; grado <= 6; grado++) {
                    // Curso general de Matemática
                    Course matePrimaria = new Course();
                    matePrimaria.setName("Matemática " + grado + "° Primaria");
                    matePrimaria.setDescription("Desarrollo del pensamiento lógico-matemático fundamental para " + grado + "° grado.");
                    matePrimaria.setEducationLevel(EducationLevel.PRIMARIA);
                    matePrimaria.setGradeLevel(grado);
                    matePrimaria.setAcademicArea(AcademicArea.matematica);
                    matePrimaria.setHoursPerWeek(6);
                    matePrimaria.setIsActive(true);
                    courseService.saveCourse(matePrimaria); // ✅ Usa el servicio que genera el código

                    // Curso general de Comunicación
                    Course comunicacionPrimaria = new Course();
                    comunicacionPrimaria.setName("Comunicación " + grado + "° Primaria");
                    comunicacionPrimaria.setDescription("Competencias lingüísticas, comprensión lectora y escritura para " + grado + "° grado.");
                    comunicacionPrimaria.setEducationLevel(EducationLevel.PRIMARIA);
                    comunicacionPrimaria.setGradeLevel(grado);
                    comunicacionPrimaria.setAcademicArea(AcademicArea.comunicacion);
                    comunicacionPrimaria.setHoursPerWeek(6);
                    comunicacionPrimaria.setIsActive(true);
                    courseService.saveCourse(comunicacionPrimaria); // ✅ Usa el servicio que genera el código
                }

                // =========================================================================
                // 2. SEED DE CURSOS PARA SECUNDARIA
                // =========================================================================
                for (int grado = 1; grado <= 3; grado++) {
                    // Álgebra
                    Course algebraSec = new Course();
                    algebraSec.setName("Álgebra " + grado + "° Secundaria");
                    algebraSec.setDescription("Estructuras algebraicas, ecuaciones y funciones elementales correspondientes al " + grado + "° año.");
                    algebraSec.setEducationLevel(EducationLevel.SECUNDARIA);
                    algebraSec.setGradeLevel(grado);
                    algebraSec.setAcademicArea(AcademicArea.matematica);
                    algebraSec.setHoursPerWeek(4);
                    algebraSec.setIsActive(true);
                    courseService.saveCourse(algebraSec);

                    // Geometría
                    Course geometriaSec = new Course();
                    geometriaSec.setName("Geometría " + grado + "° Secundaria");
                    geometriaSec.setDescription("Estudio de formas geométricas, teoremas espaciales y trigonometría para " + grado + "° año.");
                    geometriaSec.setEducationLevel(EducationLevel.SECUNDARIA);
                    geometriaSec.setGradeLevel(grado);
                    geometriaSec.setAcademicArea(AcademicArea.matematica);
                    geometriaSec.setHoursPerWeek(3);
                    geometriaSec.setIsActive(true);
                    courseService.saveCourse(geometriaSec);

                    // Lenguaje
                    Course lenguajeSec = new Course();
                    lenguajeSec.setName("Lenguaje " + grado + "° Secundaria");
                    lenguajeSec.setDescription("Gramática normativa, sintaxis y correcto uso de la lengua para " + grado + "° año.");
                    lenguajeSec.setEducationLevel(EducationLevel.SECUNDARIA);
                    lenguajeSec.setGradeLevel(grado);
                    lenguajeSec.setAcademicArea(AcademicArea.comunicacion);
                    lenguajeSec.setHoursPerWeek(3);
                    lenguajeSec.setIsActive(true);
                    courseService.saveCourse(lenguajeSec);

                    // Literatura
                    Course literaturaSec = new Course();
                    literaturaSec.setName("Literatura " + grado + "° Secundaria");
                    literaturaSec.setDescription("Análisis literario, corrientes universales y producción de textos para " + grado + "° año.");
                    literaturaSec.setEducationLevel(EducationLevel.SECUNDARIA);
                    literaturaSec.setGradeLevel(grado);
                    literaturaSec.setAcademicArea(AcademicArea.comunicacion);
                    literaturaSec.setHoursPerWeek(3);
                    literaturaSec.setIsActive(true);
                    courseService.saveCourse(literaturaSec);
                }

                System.out.println("✅ Todos los cursos base de Primaria y Secundaria han sido inyectados.");
            } else {
                System.out.println("✨ Course Service ya cuenta con datos. Saltando inicialización.");
            }
        };
    }
}