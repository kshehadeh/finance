import { Request } from 'express';
import { AppDataSource } from '@src/data-source';
import { DataSource } from 'typeorm/data-source';
import { QueryFailedError } from 'typeorm';

/**
 * The base controller should be used as the parent class for any of the controller
 * classes.  Controllers are meant to be used as the repository for any business logic
 * that has to be done.  It acts as a intermediary between the API request layer and the
 * data store - doing transformations, applying rules, aggregating data, etc.
 */
abstract class Controller<T> {
  private _req: Request;
  private _db: DataSource;
  private _lastError: QueryFailedError | null;

  constructor(req: Request) {
    this._req = req;
    this._db = AppDataSource;
    this._lastError = null;
  }

  protected get request() {
    return this._req;
  }

  protected get db() {
    return this._db;
  }

  public get lastError() {
    return this._lastError;
  }

  public set lastError(err: QueryFailedError | null) {
    this._lastError = err;
  }

  abstract getAll(): Promise<T[] | null>;
  abstract getById(id: number): Promise<T | null>;

  /**
   * This helper can be used to wrap function that executes some kind of query.  It will
   * automatically catch query errors and store them in the lastError property then
   * return null.  This helps to ensure that we handle errors consistently across controllers.
   * @param func The function that executes the code that could throw an exception
   * @returns <T> or null depending on the success of the func given.
   */
  async wrap<P>(func: () => Promise<P>): Promise<P | null> {
    try {
      const response = await func();
      this.lastError = null;
      return response;
    } catch (e) {
      if (e instanceof QueryFailedError) {
        this.lastError = e;
        return null;
      }
      return null;
    }
  }
}

export default Controller;
