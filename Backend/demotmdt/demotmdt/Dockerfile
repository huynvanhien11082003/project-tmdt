# Giai đoạn 1: Build
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Copy trực tiếp vì file nằm cùng cấp với Dockerfile
COPY pom.xml .
RUN mvn dependency:go-offline

COPY src ./src
RUN mvn clean package -DskipTests

# Giai đoạn 2: Chạy
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

ENV JAVA_OPTS="-Xmx512m -Xms256m"
EXPOSE 8080

# Dùng sh -c để chạy biến môi trường ổn định
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]