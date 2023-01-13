import { Logger, QueryRunner } from 'typeorm';
import pino from 'pino';

// Logger interface includes `any` type
/* eslint-disable  @typescript-eslint/no-explicit-any */

/**
 * TypeORM Logging adapter that targets pino
 */
export class PinoTypeORMLogger implements Logger {
  _logger: pino.Logger;

  constructor(logger: pino.Logger) {
    this._logger = logger;
  }

  logQuery(query: string, parameters?: any[], _queryRunner?: QueryRunner): void {
    this._logger.info(
      {
        query,
        parameters,
      },
      'run query',
    );
  }
  /**
   * Logs query that is failed.
   */
  logQueryError(error: string | Error, query: string, parameters?: any[], _queryRunner?: QueryRunner): void {
    this._logger.error(
      {
        query,
        error,
        parameters,
      },
      'query failed',
    );
  }

  /**
   * Logs query that is slow.
   */
  logQuerySlow(queryTime: number, query: string, parameters?: any[], _queryRunner?: QueryRunner): void {
    this._logger.warn(
      {
        query,
        queryTime,
        parameters,
      },
      'query slow',
    );
  }
  /**
   * Logs events from the schema build process.
   */
  logSchemaBuild(message: string, _queryRunner?: QueryRunner): void {
    this._logger.info(
      {
        message,
      },
      'schema',
    );
  }
  /**
   * Logs events from the migrations run process.
   */
  logMigration(message: string, _queryRunner?: QueryRunner): void {
    this._logger.info(
      {
        message,
      },
      'migration',
    );
  }

  /**
   * Perform logging using given logger, or by default to the console.
   * Log has its own level and message.
   */
  log(level: 'log' | 'info' | 'warn', message: any, _queryRunner?: QueryRunner): void {
    switch (level) {
      case 'log':
        // level included in message
        this._logger.info({ message });
        break;
      case 'info':
        this._logger.info({ message });
        break;
      case 'warn':
        this._logger.warn({ message });
        break;
    }
  }
}
