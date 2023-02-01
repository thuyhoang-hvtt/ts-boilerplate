import { isEmpty } from 'lodash';
import { createConnection, getManager } from 'typeorm';

import dbConnection from '@/db';

class ScriptAlreadyRun extends Error {}

export async function persistScript(scriptName: string) {
  await createConnection(dbConnection);
  return {
    check: async () => {
      const db = getManager();
      await db.query(
        `
        CREATE TABLE IF NOT EXISTS _scripts
        (
          id   int PRIMARY KEY NOT NULL AUTO_INCREMENT,
          name varchar(255) UNIQUE NOT NULL
        ) ENGINE=InnoDB;
      `,
        [scriptName],
      );

      const existing = await db.query('SELECT id, name FROM _scripts WHERE name = ?', [scriptName]);

      if (!isEmpty(existing)) {
        throw new ScriptAlreadyRun('Script already run.');
      }
    },
    commit: async () => {
      const db = getManager();
      const existing = await db.query('SELECT id, name FROM _scripts WHERE name = ?', [scriptName]);

      if (isEmpty(existing)) {
        await db.query('INSERT INTO _scripts (name) VALUES (?)', [scriptName]);
      }
      return Promise.resolve();
    },
    rollback: async reason => {
      console.log(reason);
      if (reason instanceof ScriptAlreadyRun) {
        return;
      }
      const db = getManager();
      await db.query('DELETE FROM _scripts WHERE name = ?', [scriptName]);
      return Promise.reject();
    },
  };
}
