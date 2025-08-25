-- Create partner_applications table
CREATE TABLE IF NOT EXISTS partner_applications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  store_name VARCHAR(255) NOT NULL,
  store_description TEXT,
  business_type ENUM('individual', 'company') NOT NULL,
  business_license VARCHAR(255),
  phone VARCHAR(20) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  district VARCHAR(100) NOT NULL,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  rejection_reason TEXT,
  documents JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_status (status)
);

-- Create partner_stores table
CREATE TABLE IF NOT EXISTS partner_stores (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  store_name VARCHAR(255) NOT NULL,
  store_description TEXT,
  store_logo VARCHAR(255),
  store_banner VARCHAR(255),
  phone VARCHAR(20) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  district VARCHAR(100) NOT NULL,
  business_type ENUM('individual', 'company') NOT NULL,
  business_license VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_store (user_id),
  INDEX idx_user_id (user_id),
  INDEX idx_is_active (is_active)
);

-- Add partner_id column to users table if not exists
ALTER TABLE users ADD COLUMN partner_id INT NULL;
ALTER TABLE users ADD CONSTRAINT fk_user_partner FOREIGN KEY (partner_id) REFERENCES partner_stores(id) ON DELETE SET NULL;
