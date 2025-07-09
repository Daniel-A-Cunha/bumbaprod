/*
  # Sample Data for BumbáLog

  1. Sample Data
    - Create sample allegories
    - Create sample materials
    - Create sample alerts
    - Create sample material consumption records

  Note: User profiles will be created automatically when users sign up
*/

-- Insert sample allegories
INSERT INTO allegories (id, name, status, description, image_url, design_progress, structure_progress, painting_progress, electrical_progress, finishing_progress) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Boto Encantado', 'onTrack', 'Alegoria principal representando o boto encantado', 'https://images.pexels.com/photos/1179229/pexels-photo-1179229.jpeg', 100, 85, 70, 60, 30),
  ('550e8400-e29b-41d4-a716-446655440002', 'Cunhã Poranga', 'alert', 'Alegoria da personagem Cunhã Poranga', 'https://images.pexels.com/photos/2444429/pexels-photo-2444429.jpeg', 100, 90, 60, 40, 20),
  ('550e8400-e29b-41d4-a716-446655440003', 'Pajé', 'delayed', 'Alegoria representando o Pajé', 'https://images.pexels.com/photos/11418920/pexels-photo-11418920.jpeg', 100, 75, 30, 20, 10),
  ('550e8400-e29b-41d4-a716-446655440004', 'Porta Estandarte', 'onTrack', 'Alegoria do porta estandarte do boi', 'https://images.pexels.com/photos/8838888/pexels-photo-8838888.jpeg', 100, 100, 90, 80, 70);

-- Insert sample materials
INSERT INTO materials (id, name, category, unit, current_stock, minimum_stock) VALUES
  ('660e8400-e29b-41d4-a716-446655440001', 'Tinta acrílica branca', 'Pintura', 'Litro', 25, 20),
  ('660e8400-e29b-41d4-a716-446655440002', 'Ferro quadrado 20mm', 'Estrutura', 'Metro', 50, 100),
  ('660e8400-e29b-41d4-a716-446655440003', 'Fio elétrico 2.5mm', 'Elétrica', 'Metro', 200, 150),
  ('660e8400-e29b-41d4-a716-446655440004', 'Placas de isopor 100x50cm', 'Acabamento', 'Unidade', 15, 30),
  ('660e8400-e29b-41d4-a716-446655440005', 'Resina acrílica', 'Acabamento', 'Kg', 45, 40);

-- Insert sample material consumption
INSERT INTO material_consumption (material_id, allegory_id, amount) VALUES
  ('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 10),
  ('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 8),
  ('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 70),
  ('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', 45),
  ('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 50),
  ('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 30),
  ('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 25),
  ('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440004', 40),
  ('660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', 12),
  ('660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', 10),
  ('660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440003', 8),
  ('660e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440001', 15),
  ('660e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440004', 10);

-- Insert sample alerts
INSERT INTO alerts (type, title, description, related_id, severity, read) VALUES
  ('material', 'Estoque baixo: Ferro quadrado 20mm', 'O estoque atual está abaixo do mínimo recomendado', '660e8400-e29b-41d4-a716-446655440002', 'critical', false),
  ('task', 'Tarefa atrasada: Finalização da estrutura do Pajé', 'A tarefa está 2 dias atrasada', null, 'warning', true),
  ('bottleneck', 'Gargalo identificado: Pintura', 'Múltiplas alegorias aguardando etapa de pintura', null, 'warning', false),
  ('team', 'Equipe inativa: Elétrica', 'Nenhum check-in registrado nas últimas 24h', null, 'info', false),
  ('material', 'Estoque baixo: Placas de isopor', 'O estoque atual está abaixo do mínimo recomendado', '660e8400-e29b-41d4-a716-446655440004', 'critical', false);