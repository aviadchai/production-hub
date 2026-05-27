DROP VIEW IF EXISTS project_stats;
CREATE VIEW project_stats AS
SELECT
  p.*,
  p.department_id AS department_slug,
  d.name_en AS department_name,
  COUNT(DISTINCT s.id)  AS scene_count,
  COUNT(DISTINCT pr.id) AS prompt_count
FROM projects p
LEFT JOIN departments d  ON d.id  = p.department_id
LEFT JOIN scenes s       ON s.project_id = p.id
LEFT JOIN prompts pr     ON pr.scene_id  = s.id
GROUP BY p.id, d.name_en;
