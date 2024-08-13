CREATE TABLE `avg_response_times` (
	`route` text PRIMARY KEY NOT NULL,
	`num_requests` integer DEFAULT 0 NOT NULL,
	`avg_response_time` integer DEFAULT 0 NOT NULL,
	`updated_at` integer
);
