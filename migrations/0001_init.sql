-- The band members who can use /crew. Add them with:
-- bunx wrangler d1 execute scarletts-crew --remote \
--   --command "INSERT INTO members (email, name) VALUES ('someone@example.com', 'Name')"
CREATE TABLE members (
	email TEXT PRIMARY KEY COLLATE NOCASE,
	name TEXT NOT NULL
);

CREATE TABLE events (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	date TEXT NOT NULL,
	start_time TEXT,
	end_time TEXT,
	title TEXT NOT NULL,
	kind TEXT NOT NULL DEFAULT 'other' CHECK (kind IN ('gig', 'rehearsal', 'other')),
	venue TEXT,
	city TEXT,
	details TEXT,
	ticket_status TEXT CHECK (ticket_status IN ('on-sale', 'sold-out')),
	ticket_href TEXT,
	event_href TEXT,
	public INTEGER NOT NULL DEFAULT 0,
	updated_by TEXT NOT NULL,
	updated_at TEXT NOT NULL
);

CREATE INDEX events_by_date ON events (date);

CREATE TABLE unavailability (
	email TEXT NOT NULL REFERENCES members (email) ON DELETE CASCADE,
	date TEXT NOT NULL,
	PRIMARY KEY (email, date)
);

-- One calendar feed link per member; making a new one replaces the old.
CREATE TABLE feed_tokens (
	email TEXT PRIMARY KEY REFERENCES members (email) ON DELETE CASCADE,
	token TEXT NOT NULL UNIQUE
);
