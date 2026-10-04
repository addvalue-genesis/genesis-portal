SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS etm_users (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 email VARCHAR(255) NOT NULL UNIQUE,
 display_name VARCHAR(255) NOT NULL,
 auth_provider VARCHAR(64) NULL,
 external_subject VARCHAR(255) NULL,
 locale VARCHAR(16) NOT NULL DEFAULT 'th',
 status ENUM('ACTIVE','SUSPENDED','DISABLED') NOT NULL DEFAULT 'ACTIVE',
 created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
 updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 metadata_json JSON NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS etm_roles (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 role_code VARCHAR(64) NOT NULL UNIQUE,
 role_name VARCHAR(255) NOT NULL,
 role_description TEXT NULL,
 role_scope ENUM('GLOBAL','PROJECT') NOT NULL DEFAULT 'PROJECT',
 is_system_role TINYINT(1) NOT NULL DEFAULT 1,
 status ENUM('ACTIVE','DISABLED') NOT NULL DEFAULT 'ACTIVE'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS etm_permissions (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 permission_code VARCHAR(128) NOT NULL UNIQUE,
 permission_group VARCHAR(64) NOT NULL,
 permission_name VARCHAR(255) NOT NULL,
 description TEXT NULL,
 sensitivity ENUM('NORMAL','INTERNAL','COMMERCIAL','RELEASE') NOT NULL DEFAULT 'NORMAL'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS etm_role_permissions (
 role_id BIGINT UNSIGNED NOT NULL,
 permission_id BIGINT UNSIGNED NOT NULL,
 allowed TINYINT(1) NOT NULL DEFAULT 1,
 PRIMARY KEY(role_id, permission_id),
 FOREIGN KEY(role_id) REFERENCES etm_roles(id) ON DELETE CASCADE,
 FOREIGN KEY(permission_id) REFERENCES etm_permissions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS etm_project_memberships (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 project_id BIGINT UNSIGNED NOT NULL,
 user_id BIGINT UNSIGNED NOT NULL,
 role_id BIGINT UNSIGNED NOT NULL,
 membership_status ENUM('ACTIVE','INVITED','SUSPENDED','REMOVED') NOT NULL DEFAULT 'ACTIVE',
 project_access ENUM('VIEW','CONTRIBUTE','MANAGE') NOT NULL DEFAULT 'VIEW',
 system_scope_mode ENUM('ALL','SELECTED') NOT NULL DEFAULT 'ALL',
 location_scope_mode ENUM('ALL','SELECTED') NOT NULL DEFAULT 'ALL',
 valid_from DATETIME NULL,
 valid_to DATETIME NULL,
 created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
 metadata_json JSON NULL,
 UNIQUE KEY uq_project_member(project_id,user_id),
 FOREIGN KEY(project_id) REFERENCES etm_projects(id),
 FOREIGN KEY(user_id) REFERENCES etm_users(id),
 FOREIGN KEY(role_id) REFERENCES etm_roles(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS etm_membership_module_access (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 membership_id BIGINT UNSIGNED NOT NULL,
 module_code VARCHAR(64) NOT NULL,
 access_level ENUM('NONE','VIEW','EDIT','APPROVE','ADMIN') NOT NULL DEFAULT 'VIEW',
 source ENUM('ROLE_DEFAULT','OVERRIDE') NOT NULL DEFAULT 'ROLE_DEFAULT',
 UNIQUE KEY uq_member_module(membership_id,module_code),
 FOREIGN KEY(membership_id) REFERENCES etm_project_memberships(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS etm_membership_system_scope (
 membership_id BIGINT UNSIGNED NOT NULL,
 system_id BIGINT UNSIGNED NOT NULL,
 access_level ENUM('VIEW','EDIT','APPROVE') NOT NULL DEFAULT 'VIEW',
 PRIMARY KEY(membership_id,system_id),
 FOREIGN KEY(membership_id) REFERENCES etm_project_memberships(id) ON DELETE CASCADE,
 FOREIGN KEY(system_id) REFERENCES etm_systems(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS etm_membership_location_scope (
 membership_id BIGINT UNSIGNED NOT NULL,
 location_id BIGINT UNSIGNED NOT NULL,
 access_level ENUM('VIEW','EDIT','APPROVE') NOT NULL DEFAULT 'VIEW',
 PRIMARY KEY(membership_id,location_id),
 FOREIGN KEY(membership_id) REFERENCES etm_project_memberships(id) ON DELETE CASCADE,
 FOREIGN KEY(location_id) REFERENCES etm_locations(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS etm_user_permission_overrides (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 project_id BIGINT UNSIGNED NOT NULL,
 user_id BIGINT UNSIGNED NOT NULL,
 permission_id BIGINT UNSIGNED NOT NULL,
 allowed TINYINT(1) NOT NULL,
 reason_text TEXT NULL,
 created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
 UNIQUE KEY uq_user_perm_override(project_id,user_id,permission_id),
 FOREIGN KEY(project_id) REFERENCES etm_projects(id),
 FOREIGN KEY(user_id) REFERENCES etm_users(id),
 FOREIGN KEY(permission_id) REFERENCES etm_permissions(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS etm_access_audit_log (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 project_id BIGINT UNSIGNED NULL,
 user_id BIGINT UNSIGNED NULL,
 action_code VARCHAR(128) NOT NULL,
 resource_type VARCHAR(64) NULL,
 resource_id BIGINT UNSIGNED NULL,
 decision ENUM('ALLOW','DENY') NOT NULL,
 reason_text VARCHAR(500) NULL,
 occurred_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
 request_context_json JSON NULL,
 INDEX ix_access_audit_project_time(project_id,occurred_at),
 FOREIGN KEY(project_id) REFERENCES etm_projects(id),
 FOREIGN KEY(user_id) REFERENCES etm_users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
