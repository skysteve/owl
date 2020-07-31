import { Application } from 'express';
import { getIndex } from './controllers';
import { Db } from 'mongodb';
import { getIssue, getIssues, postIssue, putIssue, deleteAll, deleteIssue, setSortOrder } from './controllers/issues';

export function initRouter(app: Application, db: Db): void {
  app.get('/', getIndex);

  app.delete('/issues/:id', deleteIssue.bind(deleteIssue, db));
  app.delete('/issues', deleteAll.bind(deleteAll, db));

  app.get('/issues/:id', getIssue.bind(getIssue, db));
  app.get('/issues', getIssues.bind(getIssues, db));

  app.post('/issues', postIssue.bind(postIssue, db));
  app.put('/issues/:id', putIssue.bind(putIssue, db));

  app.patch('/issues/setSortOrder', setSortOrder.bind(setSortOrder, db));
}