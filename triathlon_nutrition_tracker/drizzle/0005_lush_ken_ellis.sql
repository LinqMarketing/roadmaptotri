CREATE TABLE `daily_quotes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`quote_text` text NOT NULL,
	`category` enum('training_mindset','nutrition_discipline','race_day_focus','recovery','mental_strength') NOT NULL,
	`quote_date` timestamp NOT NULL,
	`sent` int NOT NULL DEFAULT 0,
	`sent_at` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `daily_quotes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `daily_quotes` ADD CONSTRAINT `daily_quotes_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;