import { Response, Request } from "express";
import { Db, Collection, ObjectID } from "mongodb";
import { validateIssue } from "../helpers/validation";
import { IIssue } from "../../../interfaces/IIssue";

const COLLECTION_NAME = 'default';
const STEP = 1000;

function getListName(req: Request): string {
  const { list }: { list?: string } = req.query;
  return list || COLLECTION_NAME;
}

function getCollection(db: Db, req: Request): Collection {
  return db.collection(getListName(req));
}

async function createCollectionIfNotExists(db: Db, req: Request): Promise<{ isNew: boolean, collection: Collection }> {
  const existingCollections = await db.listCollections().toArray();
  const listName = getListName(req);


  if (existingCollections.some((col) => col.name === listName)) {
    return { isNew: false, collection: db.collection(listName) };
  }

  const collection = await db.createCollection(listName);
  collection.createIndex({ order: 1 });

  return { isNew: true, collection };
}

export async function deleteIssue(db: Db, req: Request, res: Response): Promise<void> {
  const collection = getCollection(db, req);

  const { id } = req.params;

  try {
    const { deletedCount } = await collection.deleteOne({ _id: new ObjectID(id) });

    if (deletedCount !== 1) {
      res.status(404).send({ error: `Could not find issue "${id}"` });
      return;
    }

    res.status(204).end();

  } catch (ex) {
    res.status(500).send({ error: ex.message });
  }
}

export async function deleteAll(db: Db, req: Request, res: Response): Promise<void> {
  const collection = getCollection(db, req);

  try {
    const result = await collection.drop();

    if (result) {
      res.status(204).end();
      return;
    }
    res.status(500).send({ error: 'An unknown error occurred' });

  } catch (ex) {
    // send 404 if list was not found
    if (ex.codeName === 'NamespaceNotFound') {
      res.status(404).send({ error: `Issue list "${getListName(req)}" was not found` });
      return
    }
    res.status(500).send({ error: ex.message });
  }
}

export async function getIssue(db: Db, req: Request, res: Response): Promise<void> {
  const collection = getCollection(db, req);

  const { id } = req.params;

  try {
    const issue = await collection.findOne({ _id: new ObjectID(id) });

    if (!issue) {
      res.status(404).send({ error: `Could not find issue "${id}"` });
      return;
    }

    res.send({ ...issue });

  } catch (ex) {
    res.status(500).send({ error: ex.message });
  }
}

export async function getIssues(db: Db, req: Request, res: Response): Promise<void> {
  const collection = getCollection(db, req);

  try {
    const issues = await collection.find({}).sort({ order: 1 }).toArray();
    res.send({ issues });
  } catch (ex) {
    res.status(500).send({ error: ex.message });
  }
}

export async function postIssue(db: Db, req: Request, res: Response): Promise<void> {
  const issue: IIssue = req.body;

  const issueValidationMessage = validateIssue(issue);

  // if we have an invalid issue, bail out
  if (issueValidationMessage) {
    res.status(400).send({ error: issueValidationMessage });
    return;
  }

  // otherwise add it to the DB

  const { isNew, collection } = await createCollectionIfNotExists(db, req);

  issue.order = await collection.countDocuments();
  issue.order = (issue.order + 1) * STEP;


  try {
    const { result, ops } = await collection.insertOne(issue);

    if (!result.ok) {
      res.status(500).send({ error: 'An Unknown error occurred' });
      return;
    }

    res.send({ issue: ops[0], newList: isNew })
  } catch (ex) {
    res.status(500).send({ error: ex.message });
  }
}

export async function putIssue(db: Db, req: Request, res: Response): Promise<void> {
  const issue: IIssue = req.body;
  const { id } = req.params;

  const issueValidationMessage = validateIssue(issue);

  // if we have an invalid issue, bail out
  if (issueValidationMessage) {
    res.status(400).send({ error: issueValidationMessage });
    return;
  }

  // otherwise update it the DB

  const collection = getCollection(db, req);

  try {
    // TODO should validate order hasn't changed and make order changes go through the setSortOrder endpoint
    const { result, ops } = await collection.replaceOne({ _id: new ObjectID(id) }, issue, { upsert: false });

    if (result.nModified !== 1) {
      res.status(404).send({ error: `Failed to find "${id}" to update` });
      return;
    }

    if (!result.ok) {
      res.status(500).send({ error: 'An Unknown error occurred' });
      return;
    }

    res.send({ ...ops[0] })
  } catch (ex) {
    res.status(500).send({ error: ex.message });
  }
}

export async function setSortOrder(db: Db, req: Request, res: Response): Promise<void> {
  const { id, previousId }: { id: string; previousId: string } = req.body;

  const collection = getCollection(db, req);

  try {
    const issue: IIssue = await collection.findOne({ _id: new ObjectID(id) });

    if (!previousId) {
      const updatedIssue = await collection.findOneAndUpdate({ _id: new ObjectID(id) }, { $set: { order: 0 } });

      res.send(updatedIssue.value);
      return
    }

    const previousIssue: IIssue = await collection.findOne({ _id: new ObjectID(previousId) });

    if (!issue) {
      res.status(404).send({ error: `Failed to find issue "${id}"` });
      return;
    }

    if (!previousIssue) {
      res.status(404).send({ error: `Failed to find previous issue "${id}"` });
      return;
    }

    const updated = await collection.findOneAndUpdate({ _id: new ObjectID(id) }, { $set: { order: previousIssue.order + 100 } });

    res.send({ ...updated.value, order: previousIssue.order + 100 });
  } catch (ex) {
    res.status(500).send({ error: ex.message });
  }
}