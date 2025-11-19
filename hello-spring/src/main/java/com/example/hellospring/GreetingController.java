package com.example.hellospring;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
public class GreetingController {

    private final java.util.concurrent.atomic.AtomicInteger counter = new java.util.concurrent.atomic.AtomicInteger();
    private final UserRepository userRepository;

    public GreetingController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/api/users")
    public java.util.List<UserSummary> getUsers() {
        return userRepository.findAll().stream()
                .map(user -> new UserSummary(user.getId(), user.getName()))
                .collect(java.util.stream.Collectors.toList());
    }

    @GetMapping("/api/users/{id}/profession")
    public Map<String, String> getProfession(@org.springframework.web.bind.annotation.PathVariable Long id) {
        return userRepository.findById(id)
                .map(user -> Map.of("profession", user.getProfession()))
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
