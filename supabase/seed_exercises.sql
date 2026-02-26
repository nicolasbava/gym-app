-- Seeder: 40 ejercicios base
-- Reemplaza este UUID por un usuario real de auth.users/profiles
-- (si created_by es NOT NULL en tu tabla)
-- Ejemplo: '11111111-1111-1111-1111-111111111111'
DO $$
DECLARE
  seed_user_id uuid := '11111111-1111-1111-1111-111111111111';
BEGIN
  INSERT INTO exercises (name, equipment, muscle_group, description, created_by)
  SELECT v.name, v.description, v.equipment, v.muscle_group, seed_user_id
  FROM (
    VALUES
      ('Press banca con barra', 'Barra', 'Pecho', 'Ejercicio compuesto para pectoral, triceps y deltoides anterior.'),
      ('Press inclinado con mancuernas', 'Mancuernas', 'Pecho', 'Enfoque en la porcion superior del pectoral.'),
      ('Aperturas con mancuernas', 'Mancuernas', 'Pecho', 'Movimiento de aislamiento para pectoral.'),
      ('Fondos en paralelas', 'Paralelas', 'Espalda', 'Compuesto para pecho y triceps con peso corporal.'),
      ('Flexiones', 'Peso corporal', 'Espalda', 'Empuje horizontal con peso corporal.'),
      ('Dominadas pronas', 'Tiron vertical', 'Espalda', 'Tiron vertical para espalda y biceps.'),
      ('Dominadas supinas', 'Barra', 'Espalda', 'Tiron vertical con mayor participacion de biceps.'),
      ('Remo con barra', 'Barra', 'Espalda', 'Compuesto para dorsales, romboides y trapecio.'),
      ('Remo con mancuerna', 'Mancuernas', 'Espalda', 'Trabajo unilateral de espalda media.'),
      ('Jalon al pecho', 'Barra', 'Espalda', 'Alternativa guiada para dorsales.'),
      ('Peso muerto convencional', 'Barra', 'Espalda', 'Compuesto de cadena posterior de alta demanda.'),
      ('Peso muerto rumano', 'Barra', 'Espalda', 'Enfoque en isquiosurales y gluteos.'),
      ('Sentadilla trasera', 'Barra', 'Piernas', 'Compuesto principal para tren inferior.'),
      ('Sentadilla frontal', 'Barra', 'Piernas', 'Mayor enfasis en cuadriceps y core.'),
      ('Prensa de piernas', 'Máquina', 'Piernas', 'Trabajo de piernas en maquina con alta estabilidad.'),
      ('Zancadas caminando', 'Mancuernas', 'Piernas', 'Trabajo unilateral de cuadriceps y gluteos.'),
      ('Hip thrust', 'Máquina', 'Glúteos', 'Extension de cadera para gluteos.'),
      ('Curl femoral tumbado', 'Máquina', 'Isquiosurales', 'Aislamiento de isquiosurales.'),
      ('Extension de cuadriceps', 'Maquina', 'Piernas', 'Aislamiento de cuadriceps en maquina.'),
      ('Elevacion de talones de pie', 'Maquina', 'Piernas', 'Trabajo de gemelos.'),
      ('Press militar con barra', 'Barra', 'Hombros', 'Empuje vertical para hombros.'),
      ('Press militar con mancuernas', 'Mancuernas', 'Hombros', 'Empuje vertical con mayor rango y control.'),
      ('Elevaciones laterales', 'Mancuernas', 'Hombros', 'Aislamiento del deltoides medio.'),
      ('Face pull', 'Barra', 'Espalda', 'Salud escapular y deltoides posterior.'),
      ('Pajaro con mancuernas', 'Mancuernas', 'Espalda', 'Aislamiento de deltoides posterior.'),
      ('Curl de biceps con barra', 'Barra', 'Biceps', 'Aislamiento de biceps braquial.'),
      ('Curl martillo', 'Mancuernas', 'Biceps', 'Enfoque en braquial y braquiorradial.'),
      ('Curl concentrado', 'Mancuernas', 'Biceps', 'Aislamiento unilateral de biceps.'),
      ('Press frances', 'Barra', 'Triceps', 'Aislamiento de triceps.'),
      ('Extension de triceps en polea', 'Máquina', 'Triceps', 'Trabajo controlado de triceps.'),
      ('Fondos en banco', 'Disco', 'Triceps', 'Triceps con peso corporal.'),
      ('Crunch abdominal', 'Máquina', 'Abdomen', 'Flexion de tronco para abdomen.'),
      ('Elevaciones de piernas', 'Máquina', 'Abdomen', 'Enfoque en recto abdominal inferior.'),
      ('Plancha frontal', 'Máquina', 'Core', 'Estabilidad isometrica del core.'),
      ('Plancha lateral', 'Máquina', 'Core', 'Estabilidad lateral del core.'),
      ('Mountain climbers', 'Máquina', 'Core', 'Core dinamico con componente cardiovascular.'),
      ('Burpees', 'Peso corporal', 'Core', 'Ejercicio metabolico de cuerpo completo.'),
      ('Saltar cuerda', 'Cuerda', 'Cardio', 'Trabajo cardiovascular y coordinacion.'),
      ('Bicicleta estatica', 'Máquina', 'Cardio', 'Cardio de bajo impacto.'),
      ('Remo ergonometrico', 'Máquina', 'Cardio', 'Cardio y resistencia muscular general.')
  ) AS v(name, description, equipment, muscle_group)
  WHERE NOT EXISTS (
    SELECT 1
    FROM exercises e
    WHERE lower(e.name) = lower(v.name)
      AND e.deleted_at IS NULL
  );
END $$;

-- DELETE from public.exercises;