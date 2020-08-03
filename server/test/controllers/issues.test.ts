import { getMockMongoDb, insertMockData } from '../_mocks/mongoMock';
import { getIssues } from '../../src/controllers/issues';

describe('controllers/issues', () => {
  describe('getIssues', () => {
    it('should return an array of issues', async () => {
      const mockDB = await getMockMongoDb();
      await insertMockData(mockDB, 'test', [{ _id: 1, title: 'test', order: 0 }, { _id: 2, title: 'world', order: 1 }]);
      const req: any = {
        query: {
          list: 'test'
        }
      };
      const res: any = {
        send: jest.fn(),
        status: jest.fn()
      };

      await getIssues(mockDB, req, res);

      expect(res.status.mock.calls.length).toBe(0);
      expect(res.send.mock.calls.length).toBe(1);
      expect(res.send.mock.calls[0]).toEqual([{
        issues: [{ _id: 1, title: 'test', order: 0 }, { _id: 2, title: 'world', order: 1 }]
      }]);
    });

    it('should return a 500 status if there was an error', async () => {
      const mockDB = await getMockMongoDb() as any;
      mockDB.collection = () => {
        return {
          find() {
            throw new Error('FAILED TO GET COLLECTION');
          }
        };
      };

      const req: any = {
        query: {
          list: 'test'
        }
      };

      const res: any = {
        send: jest.fn(),
        status: jest.fn()
      };

      res.status.mockReturnValue(res);

      await getIssues(mockDB, req, res);

      expect(res.status.mock.calls.length).toBe(1);
      expect(res.send.mock.calls.length).toBe(1);
      expect(res.send.mock.calls[0]).toEqual([{
        error: 'FAILED TO GET COLLECTION'
      }]);
    });
  });
});