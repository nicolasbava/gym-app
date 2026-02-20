-- Seeder: 40 ejercicios base
-- Reemplaza este UUID por un usuario real de auth.users/profiles
-- (si created_by es NOT NULL en tu tabla)
-- Ejemplo: '11111111-1111-1111-1111-111111111111'
DO $$
DECLARE
  seed_user_id uuid := '11111111-1111-1111-1111-111111111111';
BEGIN
  INSERT INTO exercises (name, description, created_by)
  SELECT v.name, v.description, seed_user_id
  FROM (
    VALUES
      ('Press banca con barra', 'Ejercicio compuesto para pectoral, triceps y deltoides anterior.'),
      ('Press inclinado con mancuernas', 'Enfoque en la porcion superior del pectoral.'),
      ('Aperturas con mancuernas', 'Movimiento de aislamiento para pectoral.'),
      ('Fondos en paralelas', 'Compuesto para pecho y triceps con peso corporal.'),
      ('Flexiones', 'Empuje horizontal con peso corporal.'),
      ('Dominadas pronas', 'Tiron vertical para espalda y biceps.'),
      ('Dominadas supinas', 'Tiron vertical con mayor participacion de biceps.'),
      ('Remo con barra', 'Compuesto para dorsales, romboides y trapecio.'),
      ('Remo con mancuerna', 'Trabajo unilateral de espalda media.'),
      ('Jalon al pecho', 'Alternativa guiada para dorsales.'),
      ('Peso muerto convencional', 'Compuesto de cadena posterior de alta demanda.'),
      ('Peso muerto rumano', 'Enfoque en isquiosurales y gluteos.'),
      ('Sentadilla trasera', 'Compuesto principal para tren inferior.'),
      ('Sentadilla frontal', 'Mayor enfasis en cuadriceps y core.'),
      ('Prensa de piernas', 'Trabajo de piernas en maquina con alta estabilidad.'),
      ('Zancadas caminando', 'Trabajo unilateral de cuadriceps y gluteos.'),
      ('Hip thrust', 'Extension de cadera para gluteos.'),
      ('Curl femoral tumbado', 'Aislamiento de isquiosurales.'),
      ('Extension de cuadriceps', 'Aislamiento de cuadriceps en maquina.'),
      ('Elevacion de talones de pie', 'Trabajo de gemelos.'),
      ('Press militar con barra', 'Empuje vertical para hombros.'),
      ('Press militar con mancuernas', 'Empuje vertical con mayor rango y control.'),
      ('Elevaciones laterales', 'Aislamiento del deltoides medio.'),
      ('Face pull', 'Salud escapular y deltoides posterior.'),
      ('Pajaro con mancuernas', 'Aislamiento de deltoides posterior.'),
      ('Curl de biceps con barra', 'Aislamiento de biceps braquial.'),
      ('Curl martillo', 'Enfoque en braquial y braquiorradial.'),
      ('Curl concentrado', 'Aislamiento unilateral de biceps.'),
      ('Press frances', 'Aislamiento de triceps.'),
      ('Extension de triceps en polea', 'Trabajo controlado de triceps.'),
      ('Fondos en banco', 'Triceps con peso corporal.'),
      ('Crunch abdominal', 'Flexion de tronco para abdomen.'),
      ('Elevaciones de piernas', 'Enfoque en recto abdominal inferior.'),
      ('Plancha frontal', 'Estabilidad isometrica del core.'),
      ('Plancha lateral', 'Estabilidad lateral del core.'),
      ('Mountain climbers', 'Core dinamico con componente cardiovascular.'),
      ('Burpees', 'Ejercicio metabolico de cuerpo completo.'),
      ('Saltar cuerda', 'Trabajo cardiovascular y coordinacion.'),
      ('Bicicleta estatica', 'Cardio de bajo impacto.'),
      ('Remo ergonometrico', 'Cardio y resistencia muscular general.')
  ) AS v(name, description)
  WHERE NOT EXISTS (
    SELECT 1
    FROM exercises e
    WHERE lower(e.name) = lower(v.name)
      AND e.deleted_at IS NULL
  );
END $$;