CREATE TABLE `class` (
	`class_id` int AUTO_INCREMENT NOT NULL,
	`class_name` varchar(150) NOT NULL,
	`school_id` varchar(30) NOT NULL,
	`class_teacher_id` varchar(30) NOT NULL,
	CONSTRAINT `class_class_id` PRIMARY KEY(`class_id`)
);
--> statement-breakpoint
CREATE TABLE `student_class` (
	`id` int AUTO_INCREMENT NOT NULL,
	`student_id` varchar(30) NOT NULL,
	`class_id` int NOT NULL,
	CONSTRAINT `student_class_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `discipline_record` (
	`recordID` int AUTO_INCREMENT NOT NULL,
	`student_id` varchar(30) NOT NULL,
	`incident_date` timestamp NOT NULL,
	`description` varchar(255) NOT NULL,
	`score` varchar(30) NOT NULL,
	CONSTRAINT `discipline_record_recordID` PRIMARY KEY(`recordID`)
);
--> statement-breakpoint
CREATE TABLE `grade` (
	`gradeID` int AUTO_INCREMENT NOT NULL,
	`studentID` varchar(30) NOT NULL,
	`subjectID` varchar(30) NOT NULL,
	`grade_level` varchar(30) NOT NULL,
	`term` varchar(30) NOT NULL,
	CONSTRAINT `grade_gradeID` PRIMARY KEY(`gradeID`)
);
--> statement-breakpoint
CREATE TABLE `school` (
	`school_id` varchar(30) NOT NULL,
	`school_name` varchar(150) NOT NULL,
	`address` varchar(150) NOT NULL,
	`phone` varchar(15) NOT NULL,
	CONSTRAINT `school_school_id` PRIMARY KEY(`school_id`)
);
--> statement-breakpoint
CREATE TABLE `class_subject` (
	`id` int AUTO_INCREMENT NOT NULL,
	`classID` int NOT NULL,
	`subjectID` varchar(30) NOT NULL,
	CONSTRAINT `class_subject_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `subject` (
	`subjectID` varchar(30) NOT NULL,
	`subject_name` varchar(30) NOT NULL,
	`school_id` varchar(30) NOT NULL,
	CONSTRAINT `subject_subjectID` PRIMARY KEY(`subjectID`)
);
--> statement-breakpoint
CREATE TABLE `school_members` (
	`user_id` varchar(30) NOT NULL,
	`school_id` varchar(30) NOT NULL,
	`first_name` varchar(100) NOT NULL,
	`last_name` varchar(100) NOT NULL,
	`gender` enum('male','female') NOT NULL,
	`address` varchar(255) NOT NULL,
	`role` enum('student','teacher') NOT NULL,
	`grade` varchar(10),
	`hire_date` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `school_members_user_id` PRIMARY KEY(`user_id`),
	CONSTRAINT `school_members_user_id_unique` UNIQUE(`user_id`)
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` int AUTO_INCREMENT NOT NULL,
	`username` varchar(30) NOT NULL,
	`password` varchar(30) NOT NULL,
	`school_id` varchar(30) NOT NULL,
	`last_login` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_username_unique` UNIQUE(`username`)
);
--> statement-breakpoint
ALTER TABLE `class` ADD CONSTRAINT `class_school_id_school_school_id_fk` FOREIGN KEY (`school_id`) REFERENCES `school`(`school_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `class` ADD CONSTRAINT `class_class_teacher_id_school_members_user_id_fk` FOREIGN KEY (`class_teacher_id`) REFERENCES `school_members`(`user_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `student_class` ADD CONSTRAINT `student_class_student_id_school_members_user_id_fk` FOREIGN KEY (`student_id`) REFERENCES `school_members`(`user_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `student_class` ADD CONSTRAINT `student_class_class_id_class_class_id_fk` FOREIGN KEY (`class_id`) REFERENCES `class`(`class_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `discipline_record` ADD CONSTRAINT `discipline_record_student_id_school_members_user_id_fk` FOREIGN KEY (`student_id`) REFERENCES `school_members`(`user_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `grade` ADD CONSTRAINT `grade_studentID_school_members_user_id_fk` FOREIGN KEY (`studentID`) REFERENCES `school_members`(`user_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `grade` ADD CONSTRAINT `grade_subjectID_subject_subjectID_fk` FOREIGN KEY (`subjectID`) REFERENCES `subject`(`subjectID`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `class_subject` ADD CONSTRAINT `class_subject_classID_class_class_id_fk` FOREIGN KEY (`classID`) REFERENCES `class`(`class_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `class_subject` ADD CONSTRAINT `class_subject_subjectID_subject_subjectID_fk` FOREIGN KEY (`subjectID`) REFERENCES `subject`(`subjectID`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `subject` ADD CONSTRAINT `subject_school_id_school_school_id_fk` FOREIGN KEY (`school_id`) REFERENCES `school`(`school_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `school_members` ADD CONSTRAINT `school_members_school_id_school_school_id_fk` FOREIGN KEY (`school_id`) REFERENCES `school`(`school_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user` ADD CONSTRAINT `user_school_id_school_school_id_fk` FOREIGN KEY (`school_id`) REFERENCES `school`(`school_id`) ON DELETE cascade ON UPDATE no action;