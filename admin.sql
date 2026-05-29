-- Admins table for authentication (per admintemplate reference)

CREATE TABLE admins (
  id INT NOT NULL AUTO_INCREMENT,
  username VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Example insert (password needs to be a bcrypt hash produced by PHP password_hash)
-- INSERT INTO admins (username, password_hash) VALUES ('admin', '$2y$10$replace_with_password_hash');


