-- Création des moniteurs manuellement

-- 1. Youssef El Amrani (Permis B)
INSERT INTO users (nom, prenom, email, password, role, telephone, adresse, date_naissance, specialite_permis, created_at, updated_at)
VALUES ('El Amrani', 'Youssef', 'youssef@autoecole.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'moniteur', '0600000001', 'Casablanca', '1985-01-01', 'B', NOW(), NOW());

-- 2. Fatima Zahra Bennani (Permis B)
INSERT INTO users (nom, prenom, email, password, role, telephone, adresse, date_naissance, specialite_permis, created_at, updated_at)
VALUES ('Bennani', 'Fatima Zahra', 'fatima@autoecole.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'moniteur', '0600000002', 'Rabat', '1990-05-15', 'B', NOW(), NOW());

-- 3. Mohammed Alaoui (Permis A)
INSERT INTO users (nom, prenom, email, password, role, telephone, adresse, date_naissance, specialite_permis, created_at, updated_at)
VALUES ('Alaoui', 'Mohammed', 'mohammed@autoecole.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'moniteur', '0600000003', 'Fes', '1982-11-20', 'A', NOW(), NOW());

-- 4. Karima El Idrissi (Permis C)
INSERT INTO users (nom, prenom, email, password, role, telephone, adresse, date_naissance, specialite_permis, created_at, updated_at)
VALUES ('El Idrissi', 'Karima', 'karima@autoecole.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'moniteur', '0600000004', 'Marrakech', '1988-03-10', 'C', NOW(), NOW());

-- Note: Le mot de passe pour tous les comptes est 'password'
