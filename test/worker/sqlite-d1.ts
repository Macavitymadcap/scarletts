import { Database as Sqlite } from 'bun:sqlite';
import type { Database, Statement } from '../../src/worker/db';

type Value = string | number | null;

const statement = (
	sqlite: Sqlite,
	sql: string,
	values: Value[],
): Statement => ({
	bind: (...next: Value[]) => statement(sqlite, sql, next),
	first: async <T>() => (sqlite.query(sql).get(...values) as T | null) ?? null,
	all: async <T>() => ({ results: sqlite.query(sql).all(...values) as T[] }),
	run: async () => sqlite.query(sql).run(...values),
});

/** An in-memory database with the real migrations applied, behind the D1 interface. */
export const testDatabase = async (): Promise<{
	db: Database;
	sqlite: Sqlite;
}> => {
	const sqlite = new Sqlite(':memory:');
	sqlite.run('PRAGMA foreign_keys = ON');
	const migrations = await Array.fromAsync(
		new Bun.Glob('*.sql').scan('migrations'),
	);
	for (const file of migrations.sort()) {
		sqlite.run(await Bun.file(`migrations/${file}`).text());
	}
	return {
		db: { prepare: (sql) => statement(sqlite, sql, []) },
		sqlite,
	};
};
