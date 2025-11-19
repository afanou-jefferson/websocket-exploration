package com.example.hellospring;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;

    public DataSeeder(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        userRepository.save(new User("Alice", "Engineer"));
        userRepository.save(new User("Bob", "Designer"));
        userRepository.save(new User("Charlie", "Manager"));
        userRepository.save(new User("David", "Developer"));
        userRepository.save(new User("Eve", "Architect"));
    }
}
