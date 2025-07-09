/*
  # Initial BumbáLog Database Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `name` (text)
      - `role` (enum: admin, manager, worker)
      - `sector` (enum: design, structure, painting, electrical, finishing, general)
      - `avatar_url` (text, nullable)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `allegories`
      - `id` (uuid, primary key)
      - `name` (text)
      - `status` (enum: onTrack, alert, delayed)
      - `description` (text, nullable)
      - `image_url` (text, nullable)
      - Progress fields for each sector (0-100)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `tasks`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `status` (enum: todo, inProgress, done)
      - `sector` (enum: design, structure, painting, electrical, finishing, general)
      - `allegory_id` (uuid, references allegories)
      - `due_date` (timestamp)
      - `priority` (enum: low, medium, high)
      - `created_by` (uuid, references profiles)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `task_assignments`
      - `id` (uuid, primary key)
      - `task_id` (uuid, references tasks)
      - `user_id` (uuid, references profiles)
      - `assigned_at` (timestamp)

    - `materials`
      - `id` (uuid, primary key)
      - `name` (text)
      - `category` (text)
      - `unit` (text)
      - `current_stock` (integer)
      - `minimum_stock` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `material_consumption`
      - `id` (uuid, primary key)
      - `material_id` (uuid, references materials)
      - `allegory_id` (uuid, references allegories)
      - `amount` (integer)
      - `created_at` (timestamp)

    - `alerts`
      - `id` (uuid, primary key)
      - `type` (enum: task, material, bottleneck, team)
      - `title` (text)
      - `description` (text)
      - `related_id` (uuid, nullable)
      - `severity` (enum: info, warning, critical)
      - `read` (boolean, default false)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `check_ins`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `allegory_id` (uuid, references allegories)
      - `sector_id` (text)
      - `type` (enum: in, out)
      - `timestamp` (timestamp)
      - `created_at` (timestamp)

    - `chat_messages`
      - `id` (uuid, primary key)
      - `sender_id` (uuid, references profiles)
      - `message` (text)
      - `image_url` (text, nullable)
      - `timestamp` (timestamp)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users based on roles and sectors
*/

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'manager', 'worker');
CREATE TYPE sector_type AS ENUM ('design', 'structure', 'painting', 'electrical', 'finishing', 'general');
CREATE TYPE allegory_status AS ENUM ('onTrack', 'alert', 'delayed');
CREATE TYPE task_status AS ENUM ('todo', 'inProgress', 'done');
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high');
CREATE TYPE alert_type AS ENUM ('task', 'material', 'bottleneck', 'team');
CREATE TYPE alert_severity AS ENUM ('info', 'warning', 'critical');
CREATE TYPE checkin_type AS ENUM ('in', 'out');

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  name text NOT NULL,
  role user_role DEFAULT 'worker',
  sector sector_type DEFAULT 'general',
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create allegories table
CREATE TABLE IF NOT EXISTS allegories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  status allegory_status DEFAULT 'onTrack',
  description text,
  image_url text,
  design_progress integer DEFAULT 0 CHECK (design_progress >= 0 AND design_progress <= 100),
  structure_progress integer DEFAULT 0 CHECK (structure_progress >= 0 AND structure_progress <= 100),
  painting_progress integer DEFAULT 0 CHECK (painting_progress >= 0 AND painting_progress <= 100),
  electrical_progress integer DEFAULT 0 CHECK (electrical_progress >= 0 AND electrical_progress <= 100),
  finishing_progress integer DEFAULT 0 CHECK (finishing_progress >= 0 AND finishing_progress <= 100),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  status task_status DEFAULT 'todo',
  sector sector_type NOT NULL,
  allegory_id uuid REFERENCES allegories(id) ON DELETE CASCADE,
  due_date timestamptz NOT NULL,
  priority task_priority DEFAULT 'medium',
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create task_assignments table
CREATE TABLE IF NOT EXISTS task_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid REFERENCES tasks(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  assigned_at timestamptz DEFAULT now(),
  UNIQUE(task_id, user_id)
);

-- Create materials table
CREATE TABLE IF NOT EXISTS materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  unit text NOT NULL,
  current_stock integer DEFAULT 0 CHECK (current_stock >= 0),
  minimum_stock integer DEFAULT 0 CHECK (minimum_stock >= 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create material_consumption table
CREATE TABLE IF NOT EXISTS material_consumption (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  material_id uuid REFERENCES materials(id) ON DELETE CASCADE,
  allegory_id uuid REFERENCES allegories(id) ON DELETE CASCADE,
  amount integer NOT NULL CHECK (amount > 0),
  created_at timestamptz DEFAULT now()
);

-- Create alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type alert_type NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  related_id uuid,
  severity alert_severity DEFAULT 'info',
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create check_ins table
CREATE TABLE IF NOT EXISTS check_ins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  allegory_id uuid REFERENCES allegories(id) ON DELETE CASCADE,
  sector_id text NOT NULL,
  type checkin_type NOT NULL,
  timestamp timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  message text NOT NULL,
  image_url text,
  timestamp timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE allegories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE material_consumption ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE check_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Allegories policies
CREATE POLICY "Users can read all allegories"
  ON allegories FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins and managers can manage allegories"
  ON allegories FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'manager')
    )
  );

-- Tasks policies
CREATE POLICY "Users can read all tasks"
  ON tasks FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create tasks"
  ON tasks FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update tasks they created or are assigned to"
  ON tasks FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = created_by OR
    EXISTS (
      SELECT 1 FROM task_assignments
      WHERE task_assignments.task_id = tasks.id
      AND task_assignments.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Admins and managers can delete tasks"
  ON tasks FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'manager')
    )
  );

-- Task assignments policies
CREATE POLICY "Users can read all task assignments"
  ON task_assignments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage task assignments"
  ON task_assignments FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'manager')
    ) OR
    EXISTS (
      SELECT 1 FROM tasks
      WHERE tasks.id = task_assignments.task_id
      AND tasks.created_by = auth.uid()
    )
  );

-- Materials policies
CREATE POLICY "Users can read all materials"
  ON materials FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins and managers can manage materials"
  ON materials FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'manager')
    )
  );

-- Material consumption policies
CREATE POLICY "Users can read all material consumption"
  ON material_consumption FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins and managers can manage material consumption"
  ON material_consumption FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'manager')
    )
  );

-- Alerts policies
CREATE POLICY "Users can read all alerts"
  ON alerts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update alert read status"
  ON alerts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins and managers can manage alerts"
  ON alerts FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'manager')
    )
  );

-- Check-ins policies
CREATE POLICY "Users can read all check-ins"
  ON check_ins FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create their own check-ins"
  ON check_ins FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Chat messages policies
CREATE POLICY "Users can read all chat messages"
  ON chat_messages FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create chat messages"
  ON chat_messages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = sender_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_sector ON profiles(sector);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_sector ON tasks(sector);
CREATE INDEX IF NOT EXISTS idx_tasks_allegory_id ON tasks(allegory_id);
CREATE INDEX IF NOT EXISTS idx_task_assignments_task_id ON task_assignments(task_id);
CREATE INDEX IF NOT EXISTS idx_task_assignments_user_id ON task_assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_materials_category ON materials(category);
CREATE INDEX IF NOT EXISTS idx_alerts_read ON alerts(read);
CREATE INDEX IF NOT EXISTS idx_alerts_type ON alerts(type);
CREATE INDEX IF NOT EXISTS idx_check_ins_user_id ON check_ins(user_id);
CREATE INDEX IF NOT EXISTS idx_check_ins_timestamp ON check_ins(timestamp);
CREATE INDEX IF NOT EXISTS idx_chat_messages_timestamp ON chat_messages(timestamp);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_allegories_updated_at BEFORE UPDATE ON allegories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_materials_updated_at BEFORE UPDATE ON materials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_alerts_updated_at BEFORE UPDATE ON alerts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();