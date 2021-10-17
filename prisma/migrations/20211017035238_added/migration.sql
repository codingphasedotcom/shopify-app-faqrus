-- RedefineIndex
CREATE UNIQUE INDEX `faq_slug_key` ON `faq`(`slug`);
DROP INDEX `Plan_slug_key` ON `faq`;
