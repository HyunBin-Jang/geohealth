# 1. Java 17 기반 이미지 사용 (프로젝트 버전에 맞게 수정)
FROM eclipse-temurin:17-jdk-focal

# 2. 작업 디렉토리 설정
WORKDIR /app

# 3. 빌드된 JAR 파일 복사 (gradle build 후 생성된 jar 파일 경로 확인 필요)
#    보통 build/libs/*.jar 경로에 생성됩니다.
COPY build/libs/*.jar app.jar

# 4. 실행 명령어 설정
ENTRYPOINT ["java", "-jar", "app.jar"]