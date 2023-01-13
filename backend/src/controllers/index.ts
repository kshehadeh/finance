import { Request } from "express";
import { AppDataSource } from "@src/data-source";
import { DataSource } from "typeorm/data-source";

/**
 * The base controller should be used as the parent class for any of the controller
 * classes.  Controllers are meant to be used as the repository for any business logic
 * that has to be done.  It acts as a intermediary between the API request layer and the
 * data store - doing transformations, applying rules, aggregating data, etc.
 */
abstract class Controller {
  private _req: Request;
  private _db: DataSource
  
  constructor(req: Request) {
    this._req = req
    this._db = AppDataSource
  }

  protected get request() {
    return this._req
  }

  protected get db() {
    return this._db
  }
  
}

export default Controller;
