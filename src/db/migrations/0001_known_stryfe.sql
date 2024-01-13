ALTER TABLE `subject` DROP FOREIGN KEY `subject_school_id_school_school_id_fk`;
--> statement-breakpoint
ALTER TABLE `school_members` MODIFY COLUMN `gender` enum('Male','Female') NOT NULL;--> statement-breakpoint
ALTER TABLE `school_members` MODIFY COLUMN `role` enum('Student','Teacher') NOT NULL;--> statement-breakpoint
ALTER TABLE `school_members` ADD CONSTRAINT `school_members_ic_no_unique` UNIQUE(`ic_no`);--> statement-breakpoint
ALTER TABLE `school_members` ADD `ic_no` varchar(12) NOT NULL;--> statement-breakpoint
ALTER TABLE `subject` DROP COLUMN `school_id`;