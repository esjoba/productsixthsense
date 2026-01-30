-- Create tables for customer feedback triage app

-- Feedback table: raw ingested Slack messages
CREATE TABLE IF NOT EXISTS feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source VARCHAR(50) NOT NULL DEFAULT 'slack',
  source_ref VARCHAR(255) UNIQUE, -- Slack ts
  channel_id VARCHAR(255),
  message_permalink TEXT,
  raw_text TEXT NOT NULL,
  who_text TEXT,
  topic_text TEXT,
  issue_text TEXT,
  company VARCHAR(255),
  "user" VARCHAR(255),
  classification_status VARCHAR(50) NOT NULL DEFAULT 'unclassified',
  created_at TIMESTAMP NOT NULL,
  ingested_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Idea table: canonical backlog items
CREATE TABLE IF NOT EXISTS idea (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  summary TEXT,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  roadmap_bucket VARCHAR(50) NOT NULL DEFAULT 'unassigned',
  linear_issue_id VARCHAR(255),
  votes_count INTEGER NOT NULL DEFAULT 0,
  companies_count INTEGER NOT NULL DEFAULT 0,
  trend_score FLOAT NOT NULL DEFAULT 0,
  last_mention_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- IdeaSignal table: link between Feedback and Idea (vote record)
CREATE TABLE IF NOT EXISTS idea_signal (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id UUID NOT NULL REFERENCES idea(id) ON DELETE CASCADE,
  feedback_id UUID NOT NULL REFERENCES feedback(id) ON DELETE CASCADE,
  company VARCHAR(255),
  "user" VARCHAR(255),
  weight INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_feedback_classification_status ON feedback(classification_status);
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON feedback(created_at);
CREATE INDEX IF NOT EXISTS idx_feedback_source_ref ON feedback(source_ref);
CREATE INDEX IF NOT EXISTS idx_idea_roadmap_bucket ON idea(roadmap_bucket);
CREATE INDEX IF NOT EXISTS idx_idea_trend_score ON idea(trend_score DESC);
CREATE INDEX IF NOT EXISTS idx_idea_signal_idea_id ON idea_signal(idea_id);
CREATE INDEX IF NOT EXISTS idx_idea_signal_feedback_id ON idea_signal(feedback_id);
CREATE INDEX IF NOT EXISTS idx_idea_signal_created_at ON idea_signal(created_at);

-- Insert sample data
INSERT INTO idea (title, summary, tags, roadmap_bucket, votes_count, companies_count, trend_score, last_mention_at, created_at)
VALUES
  (
    'Dark mode support',
    'Implement dark theme for the entire application',
    ARRAY['UI', 'Design', 'Enhancement'],
    'next',
    12,
    5,
    28.0,
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '30 days'
  ),
  (
    'Export feedback to CSV',
    'Allow users to download feedback data as CSV',
    ARRAY['Export', 'Feature', 'Tools'],
    'later',
    8,
    3,
    18.5,
    NOW() - INTERVAL '5 days',
    NOW() - INTERVAL '25 days'
  ),
  (
    'API for third-party integrations',
    'Public API for integrating with external tools',
    ARRAY['API', 'Integration', 'Platform'],
    'now',
    15,
    7,
    35.0,
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '20 days'
  ),
  (
    'Real-time notifications',
    'Notify users immediately when new feedback arrives',
    ARRAY['Notifications', 'Feature', 'Real-time'],
    'unassigned',
    5,
    2,
    12.5,
    NOW() - INTERVAL '10 days',
    NOW() - INTERVAL '15 days'
  ),
  (
    'Advanced search & filters',
    'Improve search capability with more filter options',
    ARRAY['Search', 'Enhancement'],
    'next',
    10,
    4,
    23.0,
    NOW() - INTERVAL '3 days',
    NOW() - INTERVAL '28 days'
  );

-- Insert sample feedback
INSERT INTO feedback (source_ref, channel_id, raw_text, who_text, topic_text, issue_text, company, "user", classification_status, created_at, ingested_at)
VALUES
  (
    '1706559600.001234',
    'C123456',
    'WHO: John from TechCorp\nTOPIC: UI/UX\nISSUE/REQUEST: Dark mode would be amazing',
    'John from TechCorp',
    'UI/UX',
    'Dark mode would be amazing',
    'TechCorp',
    'John',
    'classified',
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '1 day'
  ),
  (
    '1706559700.001235',
    'C123456',
    'WHO: Sarah from DataFlow\nTOPIC: Export\nISSUE/REQUEST: Need CSV export functionality',
    'Sarah from DataFlow',
    'Export',
    'Need CSV export functionality',
    'DataFlow',
    'Sarah',
    'classified',
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '1 day'
  ),
  (
    '1706559800.001236',
    'C123456',
    'WHO: Mike\nTOPIC: Performance\nISSUE/REQUEST: App is slow when loading large datasets',
    'Mike',
    'Performance',
    'App is slow when loading large datasets',
    NULL,
    'Mike',
    'unclassified',
    NOW() - INTERVAL '2 hours',
    NOW() - INTERVAL '2 hours'
  ),
  (
    '1706559900.001237',
    'C123456',
    'WHO: Lisa from CloudBase\nTOPIC: Integrations\nISSUE/REQUEST: Would love Slack integration for notifications',
    'Lisa from CloudBase',
    'Integrations',
    'Would love Slack integration for notifications',
    'CloudBase',
    'Lisa',
    'unclassified',
    NOW() - INTERVAL '1 hour',
    NOW() - INTERVAL '1 hour'
  );

-- Link feedback to ideas
INSERT INTO idea_signal (idea_id, feedback_id, company, "user", created_at)
SELECT
  (SELECT id FROM idea WHERE title = 'Dark mode support' LIMIT 1),
  (SELECT id FROM feedback WHERE source_ref = '1706559600.001234' LIMIT 1),
  'TechCorp',
  'John',
  NOW() - INTERVAL '1 day'
WHERE EXISTS (SELECT 1 FROM idea WHERE title = 'Dark mode support')
  AND EXISTS (SELECT 1 FROM feedback WHERE source_ref = '1706559600.001234');

INSERT INTO idea_signal (idea_id, feedback_id, company, "user", created_at)
SELECT
  (SELECT id FROM idea WHERE title = 'Export feedback to CSV' LIMIT 1),
  (SELECT id FROM feedback WHERE source_ref = '1706559700.001235' LIMIT 1),
  'DataFlow',
  'Sarah',
  NOW() - INTERVAL '1 day'
WHERE EXISTS (SELECT 1 FROM idea WHERE title = 'Export feedback to CSV')
  AND EXISTS (SELECT 1 FROM feedback WHERE source_ref = '1706559700.001235');
