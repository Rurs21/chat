package com.inf5190.chat;

import java.io.FileInputStream;
import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.inf5190.chat.auth.filter.AuthFilter;

import com.inf5190.chat.auth.session.SessionDataAccessor;
import com.inf5190.chat.auth.session.SessionManager;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;

@SpringBootApplication
public class ChatApplication {
	private static final Logger LOGGER = LoggerFactory.getLogger(ChatApplication.class);

	public static void main(String[] args) {
		try {
			if (FirebaseApp.getApps().size() == 0) {
				FileInputStream serviceAccount = new FileInputStream("firebase-key.json");

				FirebaseOptions options = FirebaseOptions.builder()
						.setCredentials(GoogleCredentials.fromStream(serviceAccount))
						.build();

				LOGGER.info("Initializing Firebase application.");
				FirebaseApp.initializeApp(options);
			}
			LOGGER.info("Firebase application already initialized.");

			SpringApplication.run(ChatApplication.class, args);
		} catch (IOException e) {
			LOGGER.error("**** Could not initialise application. Please check you service account key path. ****");
		}
	}

	@Bean
	public PasswordEncoder getPasswordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public FilterRegistrationBean<AuthFilter> authenticationFilter(
			SessionDataAccessor sessionDataAccessor,
			SessionManager sessionManager) {
		FilterRegistrationBean<AuthFilter> registrationBean = new FilterRegistrationBean<>();

		registrationBean.setFilter(new AuthFilter(sessionDataAccessor,
				sessionManager));
		registrationBean.addUrlPatterns("/messages", "/auth/logout");

		return registrationBean;
	}

}
