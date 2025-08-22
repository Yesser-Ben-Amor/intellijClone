// Project Management System for IntelliJ Clone
class ProjectManager {
    constructor() {
        this.projects = new Map();
        this.currentProject = null;
        this.loadProjectsFromStorage();
    }
    
    loadProjectsFromStorage() {
        const savedProjects = localStorage.getItem('intellijCloneProjects');
        if (savedProjects) {
            try {
                const projectsData = JSON.parse(savedProjects);
                this.projects = new Map(Object.entries(projectsData));
            } catch (e) {
                console.warn('Could not load projects from storage:', e);
                this.projects = new Map();
            }
        }
    }
    
    saveProjectsToStorage() {
        const projectsData = Object.fromEntries(this.projects);
        localStorage.setItem('intellijCloneProjects', JSON.stringify(projectsData));
    }
    
    projectExists(projectName) {
        return this.projects.has(projectName);
    }
    
    saveProject(project) {
        this.projects.set(project.name, project);
        this.saveProjectsToStorage();
        return project;
    }
    
    getProjectTemplates() {
        return {
            'javascript': {
                name: 'JavaScript',
                description: 'Grundlegendes JavaScript-Projekt',
                files: {
                    'index.js': `// {{PROJECT_NAME}} - Hauptdatei
console.log('Willkommen bei {{PROJECT_NAME}}!');

// Deine JavaScript-Logik hier...
function main() {
    console.log('{{DESCRIPTION}}');
}

main();`,
                    'README.md': `# {{PROJECT_NAME}}

{{DESCRIPTION}}

## Installation

\`\`\`bash
node index.js
\`\`\`

## Beschreibung

Dies ist ein JavaScript-Projekt.
`
                }
            },
            'html': {
                name: 'HTML/CSS',
                description: 'Web-Projekt mit HTML, CSS und JavaScript',
                files: {
                    'index.html': `<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{PROJECT_NAME}}</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>{{PROJECT_NAME}}</h1>
        <p>{{DESCRIPTION}}</p>
        <button id="demo-btn">Klick mich!</button>
    </div>
    <script src="script.js"></script>
</body>
</html>`,
                    'styles.css': `/* {{PROJECT_NAME}} - Styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: Arial, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.container {
    background: white;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    text-align: center;
    max-width: 500px;
}

h1 {
    color: #333;
    margin-bottom: 1rem;
}

p {
    color: #666;
    margin-bottom: 2rem;
}

button {
    background: #667eea;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition: background 0.3s;
}

button:hover {
    background: #5a6fd8;
}`,
                    'script.js': `// {{PROJECT_NAME}} - JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const button = document.getElementById('demo-btn');
    
    button.addEventListener('click', function() {
        alert('Hallo von {{PROJECT_NAME}}!');
        console.log('{{DESCRIPTION}}');
    });
    
    console.log('{{PROJECT_NAME}} wurde geladen!');
});`,
                    'README.md': `# {{PROJECT_NAME}}

{{DESCRIPTION}}

## Installation

Öffne \`index.html\` in deinem Browser.

## Beschreibung

Dies ist ein HTML/CSS/JavaScript Web-Projekt.
`
                }
            },
            'java': {
                name: 'Java',
                description: 'Java-Projekt mit Main-Klasse',
                files: {
                    'Main.java': `// {{PROJECT_NAME}} - Hauptklasse
public class Main {
    public static void main(String[] args) {
        System.out.println("Willkommen bei {{PROJECT_NAME}}!");
        System.out.println("{{DESCRIPTION}}");
        
        // Beispiel-Code
        String projectName = "{{PROJECT_NAME}}";
        System.out.println("Projekt: " + projectName);
        
        // Einfache Berechnungen
        int a = 10;
        int b = 20;
        int sum = a + b;
        System.out.println("Summe von " + a + " + " + b + " = " + sum);
        
        // Array-Beispiel
        String[] languages = {"Java", "Python", "JavaScript", "C++"};
        System.out.println("\\nUnterstützte Sprachen:");
        for (String lang : languages) {
            System.out.println("- " + lang);
        }
    }
}`,
                    'Utils.java': `// {{PROJECT_NAME}} - Utility-Klasse
public class Utils {
    
    /**
     * Berechnet die Fakultät einer Zahl
     * @param n Die Zahl
     * @return Fakultät von n
     */
    public static long factorial(int n) {
        if (n <= 1) {
            return 1;
        }
        return n * factorial(n - 1);
    }
    
    /**
     * Prüft ob eine Zahl eine Primzahl ist
     * @param n Die zu prüfende Zahl
     * @return true wenn Primzahl, false sonst
     */
    public static boolean isPrime(int n) {
        if (n <= 1) return false;
        if (n <= 3) return true;
        if (n % 2 == 0 || n % 3 == 0) return false;
        
        for (int i = 5; i * i <= n; i += 6) {
            if (n % i == 0 || n % (i + 2) == 0) {
                return false;
            }
        }
        return true;
    }
    
    /**
     * Gibt eine formatierte Begrüßung zurück
     * @param name Der Name
     * @return Begrüßungstext
     */
    public static String greet(String name) {
        return "Hallo " + name + "! Willkommen in der Java-Welt!";
    }
}`,
                    'README.md': `# {{PROJECT_NAME}}

{{DESCRIPTION}}

## Kompilierung und Ausführung

\`\`\`bash
# Kompilieren
javac *.java

# Ausführen
java Main
\`\`\`

## Projektstruktur

- \`Main.java\` - Hauptklasse mit main-Methode
- \`Utils.java\` - Utility-Funktionen

## Features

- Grundlegende Java-Syntax
- Klassen und Methoden
- Arrays und Schleifen
- Rekursion (Fakultät)
- Algorithmen (Primzahltest)
`
                }
            },
            'fullstack': {
                name: 'Fullstack (HTML/JS + Spring Boot)',
                description: 'Vollständiges Fullstack-Projekt mit Frontend und Backend',
                files: {
                    // Frontend Files
                    'frontend/index.html': `<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{PROJECT_NAME}} - Frontend</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="app">
        <header>
            <h1>{{PROJECT_NAME}}</h1>
            <p>{{DESCRIPTION}}</p>
        </header>
        
        <main>
            <section class="api-demo">
                <h2>API Demo</h2>
                <button id="fetch-data">Daten vom Backend laden</button>
                <div id="data-display"></div>
            </section>
            
            <section class="user-form">
                <h2>Benutzer erstellen</h2>
                <form id="user-form">
                    <input type="text" id="username" placeholder="Benutzername" required>
                    <input type="email" id="email" placeholder="E-Mail" required>
                    <button type="submit">Benutzer erstellen</button>
                </form>
            </section>
        </main>
    </div>
    <script src="app.js"></script>
</body>
</html>`,
                    'frontend/styles.css': `/* {{PROJECT_NAME}} - Frontend Styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: #f5f5f5;
    color: #333;
    line-height: 1.6;
}

.app {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

header {
    text-align: center;
    margin-bottom: 3rem;
    padding: 2rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 10px;
}

header h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
}

main {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
}

section {
    background: white;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

h2 {
    margin-bottom: 1.5rem;
    color: #667eea;
}

button {
    background: #667eea;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition: all 0.3s;
    margin: 10px 0;
}

button:hover {
    background: #5a6fd8;
    transform: translateY(-2px);
}

input {
    width: 100%;
    padding: 12px;
    margin: 10px 0;
    border: 2px solid #ddd;
    border-radius: 5px;
    font-size: 16px;
}

input:focus {
    border-color: #667eea;
    outline: none;
}

#data-display {
    margin-top: 1rem;
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 5px;
    min-height: 100px;
}

@media (max-width: 768px) {
    main {
        grid-template-columns: 1fr;
    }
}`,
                    'frontend/app.js': `// {{PROJECT_NAME}} - Frontend JavaScript
const API_BASE_URL = 'http://localhost:8080/api';

class App {
    constructor() {
        this.initializeEventListeners();
        console.log('{{PROJECT_NAME}} Frontend gestartet!');
    }
    
    initializeEventListeners() {
        // Daten laden Button
        document.getElementById('fetch-data').addEventListener('click', () => {
            this.fetchDataFromBackend();
        });
        
        // Benutzer-Formular
        document.getElementById('user-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createUser();
        });
    }
    
    async fetchDataFromBackend() {
        const display = document.getElementById('data-display');
        display.innerHTML = 'Lade Daten...';
        
        try {
            const response = await fetch(\`\${API_BASE_URL}/users\`);
            if (!response.ok) {
                throw new Error(\`HTTP error! status: \${response.status}\`);
            }
            const data = await response.json();
            
            display.innerHTML = \`
                <h3>Benutzer vom Backend:</h3>
                <pre>\${JSON.stringify(data, null, 2)}</pre>
            \`;
        } catch (error) {
            display.innerHTML = \`
                <div style="color: red;">
                    <h3>Fehler beim Laden der Daten:</h3>
                    <p>\${error.message}</p>
                    <p><small>Stelle sicher, dass das Backend läuft (localhost:8080)</small></p>
                </div>
            \`;
        }
    }
    
    async createUser() {
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        
        try {
            const response = await fetch(\`\${API_BASE_URL}/users\`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email })
            });
            
            if (response.ok) {
                alert('Benutzer erfolgreich erstellt!');
                document.getElementById('user-form').reset();
                this.fetchDataFromBackend(); // Aktualisiere die Liste
            } else {
                throw new Error('Fehler beim Erstellen des Benutzers');
            }
        } catch (error) {
            alert(\`Fehler: \${error.message}\`);
        }
    }
}

// App starten
document.addEventListener('DOMContentLoaded', () => {
    new App();
});`,
                    // Backend Files
                    'backend/pom.xml': `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.0</version>
        <relativePath/>
    </parent>
    
    <groupId>com.example</groupId>
    <artifactId>{{PROJECT_NAME_LOWER}}</artifactId>
    <version>1.0.0</version>
    <name>{{PROJECT_NAME}}</name>
    <description>{{DESCRIPTION}}</description>
    
    <properties>
        <java.version>17</java.version>
    </properties>
    
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>com.h2database</groupId>
            <artifactId>h2</artifactId>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
    
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>`,
                    'backend/src/main/java/com/example/Application.java': `package com.example;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.*;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * {{PROJECT_NAME}} - Spring Boot Application
 * {{DESCRIPTION}}
 */
@SpringBootApplication
public class Application {
    
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
        System.out.println("🚀 {{PROJECT_NAME}} Backend gestartet auf http://localhost:8080");
    }
    
    // CORS-Konfiguration für Frontend-Integration
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins("*")
                        .allowedMethods("GET", "POST", "PUT", "DELETE")
                        .allowedHeaders("*");
            }
        };
    }
}`,
                    'backend/src/main/java/com/example/model/User.java': `package com.example.model;

import jakarta.persistence.*;

/**
 * User Entity für {{PROJECT_NAME}}
 */
@Entity
@Table(name = "users")
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String username;
    
    @Column(nullable = false)
    private String email;
    
    // Konstruktoren
    public User() {}
    
    public User(String username, String email) {
        this.username = username;
        this.email = email;
    }
    
    // Getter und Setter
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    @Override
    public String toString() {
        return "User{id=" + id + ", username='" + username + "', email='" + email + "'}";
    }
}`,
                    'backend/src/main/java/com/example/repository/UserRepository.java': `package com.example.repository;

import com.example.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * User Repository für {{PROJECT_NAME}}
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByUsername(String username);
    
    boolean existsByUsername(String username);
    
    boolean existsByEmail(String email);
}`,
                    'backend/src/main/java/com/example/controller/UserController.java': `package com.example.controller;

import com.example.model.User;
import com.example.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * User REST Controller für {{PROJECT_NAME}}
 */
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @Autowired
    private UserRepository userRepository;
    
    /**
     * Alle Benutzer abrufen
     */
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    /**
     * Benutzer nach ID abrufen
     */
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(user -> ResponseEntity.ok().body(user))
                .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * Neuen Benutzer erstellen
     */
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        // Validierung
        if (userRepository.existsByUsername(user.getUsername())) {
            return ResponseEntity.badRequest().build();
        }
        
        User savedUser = userRepository.save(user);
        return ResponseEntity.ok(savedUser);
    }
    
    /**
     * Benutzer aktualisieren
     */
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setUsername(userDetails.getUsername());
                    user.setEmail(userDetails.getEmail());
                    return ResponseEntity.ok(userRepository.save(user));
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * Benutzer löschen
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(user -> {
                    userRepository.delete(user);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}`,
                    'backend/src/main/resources/application.properties': `# {{PROJECT_NAME}} - Spring Boot Konfiguration

# Server Port
server.port=8080

# H2 Database Konfiguration
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=password

# H2 Console (für Entwicklung)
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console

# JPA/Hibernate Konfiguration
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

# Logging
logging.level.com.example=DEBUG
logging.level.org.springframework.web=DEBUG`,
                    'README.md': `# {{PROJECT_NAME}} - Fullstack Anwendung

{{DESCRIPTION}}

## 🏗️ Projektstruktur

\`\`\`
{{PROJECT_NAME}}/
├── frontend/          # HTML/CSS/JavaScript Frontend
│   ├── index.html
│   ├── styles.css
│   └── app.js
└── backend/           # Spring Boot Backend
    ├── pom.xml
    └── src/main/java/com/example/
        ├── Application.java
        ├── model/User.java
        ├── repository/UserRepository.java
        └── controller/UserController.java
\`\`\`

## 🚀 Installation & Start

### Backend (Spring Boot)
\`\`\`bash
cd backend
mvn spring-boot:run
\`\`\`

### Frontend
\`\`\`bash
cd frontend
# Öffne index.html in deinem Browser
# Oder starte einen lokalen Server:
python -m http.server 3000
\`\`\`

## 📡 API Endpoints

- \`GET /api/users\` - Alle Benutzer
- \`POST /api/users\` - Neuen Benutzer erstellen
- \`GET /api/users/{id}\` - Benutzer nach ID
- \`PUT /api/users/{id}\` - Benutzer aktualisieren
- \`DELETE /api/users/{id}\` - Benutzer löschen

## 🛠️ Technologien

**Frontend:**
- HTML5, CSS3, Vanilla JavaScript
- Responsive Design
- Fetch API für Backend-Kommunikation

**Backend:**
- Spring Boot 3.2
- Spring Data JPA
- H2 In-Memory Database
- RESTful API
- CORS-Unterstützung

## 🔧 Entwicklung

1. **Backend starten:** \`mvn spring-boot:run\`
2. **H2 Console:** http://localhost:8080/h2-console
3. **API testen:** http://localhost:8080/api/users
4. **Frontend öffnen:** frontend/index.html

## 📝 Nächste Schritte

- [ ] Benutzer-Authentifizierung hinzufügen
- [ ] Frontend-Framework (React/Vue) integrieren
- [ ] Produktions-Datenbank konfigurieren
- [ ] Docker-Container erstellen
- [ ] Tests schreiben
`
                }
            },
        };
    }
    
    createProject(name, type, description) {
        if (this.projects.has(name)) {
            throw new Error('Ein Projekt mit diesem Namen existiert bereits!');
        }
        
        const template = this.getProjectTemplates()[type];
        if (!template) {
            throw new Error('Unbekannter Projekttyp!');
        }
        
        const project = {
            name: name,
            type: type,
            description: description || 'Neues Projekt',
            created: new Date().toISOString(),
            files: {}
        };
        
        // Process template files
        for (const [fileName, content] of Object.entries(template.files)) {
            // Replace placeholders in content
            let processedContent = content
                .replace(/\{\{PROJECT_NAME\}\}/g, project.name)
                .replace(/\{\{PROJECT_NAME_LOWER\}\}/g, project.name.toLowerCase().replace(/[^a-z0-9]/g, ''))
                .replace(/\{\{DESCRIPTION\}\}/g, project.description || 'Ein neues Projekt');
            
            project.files[fileName] = processedContent;
        }
        
        this.projects.set(name, project);
        this.saveProjectsToStorage();
        
        return project;
    }
    
    openProject(projectName) {
        if (!this.projects.has(projectName)) {
            throw new Error('Projekt nicht gefunden!');
        }
        
        this.currentProject = projectName;
        localStorage.setItem('lastOpenedProject', projectName);
        
        return this.projects.get(projectName);
    }
    
    getCurrentProject() {
        return this.currentProject ? this.projects.get(this.currentProject) : null;
    }
    
    updateProjectFile(fileName, content) {
        if (!this.currentProject) return;
        
        const project = this.projects.get(this.currentProject);
        if (!project.files) project.files = {};
        project.files[fileName] = content;
        this.saveProjectsToStorage();
    }
    
    addFileToProject(fileName, content = '') {
        if (!this.currentProject) return;
        
        const project = this.projects.get(this.currentProject);
        if (!project.files) project.files = {};
        project.files[fileName] = content;
        this.saveProjectsToStorage();
    }
    
    deleteProject(projectName) {
        this.projects.delete(projectName);
        this.saveProjectsToStorage();
        
        if (this.currentProject === projectName) {
            this.currentProject = null;
            localStorage.removeItem('lastOpenedProject');
        }
    }
    
    listProjects() {
        return Array.from(this.projects.keys());
    }
    
    exportProject(projectName) {
        if (!this.projects.has(projectName)) {
            throw new Error('Projekt nicht gefunden!');
        }
        
        const project = this.projects.get(projectName);
        const blob = new Blob([JSON.stringify(project, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${projectName}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
}

// Export for use in main script
window.ProjectManager = ProjectManager;
