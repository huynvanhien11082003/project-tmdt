# Giai đoạn 1: Build ứng dụng
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn clean package -DskipTests

# Giai đoạn 2: Tạo image chạy ứng dụng
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# Copy từ build stage
COPY --from=build /app/target/*.jar app.jar

# Thiết lập biến môi trường để giới hạn RAM
ENV JAVA_OPTS="-Xmx512m -Xms256m"

EXPOSE 8080

# SỬA LỖI Ở ĐÂY: Dùng lệnh shell để Docker hiểu biến môi trường
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]