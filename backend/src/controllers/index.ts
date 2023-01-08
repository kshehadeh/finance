/**
 * The base controller should be used as the parent class for any of the controller
 * classes.  Controllers are meant to be used as the repository for any business logic
 * that has to be done.  It acts as a intermediary between the API request layer and the
 * data store - doing transformations, applying rules, aggregating data, etc.
 */
abstract class Controller {
  abstract initialize(): void;
}

export default Controller;
