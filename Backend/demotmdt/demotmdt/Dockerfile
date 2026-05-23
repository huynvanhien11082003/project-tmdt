# Giai đoạn 1: Build ứng dụng
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Copy pom.xml và tải dependency trước để tận dụng Docker layer cache
COPY pom.xml .
RUN mvn dependency:go-offline

# Sau đó mới copy mã nguồn
COPY src ./src
RUN mvn clean package -DskipTests

# Giai đoạn 2: Tạo image chạy ứng dụng
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# Thiết lập biến môi trường để chạy ổn định hơn trên cloud
ENV JAVA_OPTS="-Xmx512m -Xms256m"

EXPOSE 8080
ENTRYPOINT ["java", $JAVA_OPTS, "-jar", "app.jar"]