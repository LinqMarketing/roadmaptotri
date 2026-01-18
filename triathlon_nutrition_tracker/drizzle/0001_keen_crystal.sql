CREATE TABLE `hydration_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`water_intake_ml` int NOT NULL,
	`logged_date` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `hydration_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `meal_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`meal_time` enum('pre-workout-7am','post-workout','lunch-3pm','dinner-6pm','snack') NOT NULL,
	`recipe_id` int,
	`custom_meal_name` varchar(255),
	`custom_calories` int,
	`custom_carbs` int,
	`custom_protein` int,
	`custom_fats` int,
	`servings` int NOT NULL DEFAULT 1,
	`logged_date` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `meal_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `meal_prep_recipes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`category` enum('pre-workout','post-workout','lunch','dinner','snack') NOT NULL,
	`description` text,
	`ingredients` text NOT NULL,
	`instructions` text NOT NULL,
	`calories_per_serving` int NOT NULL,
	`carbs` int NOT NULL,
	`protein` int NOT NULL,
	`fats` int NOT NULL,
	`serving_size` varchar(100) NOT NULL,
	`prep_time` int NOT NULL,
	`cook_time` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `meal_prep_recipes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `progress_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`weight` int NOT NULL,
	`body_fat_percentage` int,
	`notes` text,
	`logged_date` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `progress_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `race_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`race_name` varchar(255) NOT NULL,
	`race_date` timestamp NOT NULL,
	`carb_loading_start_date` timestamp,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `race_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `supplement_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`supplement_name` enum('creatine','electrolytes','omega-3','vitamin-d','beta-alanine','caffeine') NOT NULL,
	`dosage` varchar(100) NOT NULL,
	`logged_date` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `supplement_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `training_sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`session_date` timestamp NOT NULL,
	`session_type` enum('swim','bike','run','brick') NOT NULL,
	`duration_minutes` int NOT NULL,
	`distance_km` int,
	`intensity` enum('easy','moderate','hard','race-pace') NOT NULL,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `training_sessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `hydration_logs` ADD CONSTRAINT `hydration_logs_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `meal_logs` ADD CONSTRAINT `meal_logs_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `meal_logs` ADD CONSTRAINT `meal_logs_recipe_id_meal_prep_recipes_id_fk` FOREIGN KEY (`recipe_id`) REFERENCES `meal_prep_recipes`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `progress_logs` ADD CONSTRAINT `progress_logs_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `race_events` ADD CONSTRAINT `race_events_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `supplement_logs` ADD CONSTRAINT `supplement_logs_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `training_sessions` ADD CONSTRAINT `training_sessions_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;