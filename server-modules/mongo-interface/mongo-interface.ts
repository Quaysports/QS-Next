"use strict";
import * as mongoDB from 'mongodb'
import {dbURL, dbName} from '../../config/config.json'

export const connect = async () => {
  return await new mongoDB.MongoClient(dbURL).connect()
}

export const ping = async () => {
  const client = await connect()
  try {
    const db = client.db(dbName);
    const newPing = await db.command({ ping: 1 })
    return newPing.ok === 1 ? { status: 'Success' } : { status: 'Failure' }
  } catch (e) {
    console.error(e)
  } finally {
    await client.close()
  }
}

export const setData = async (collection: string, filter: object, data: object) => {
  const client = await connect()
  try {
    const db = client.db(dbName);
    const result = await db.collection(collection).updateOne(filter, { $set: data }, { upsert: true })
    if(result.modifiedCount > 0) console.log(`${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`);
    return result;
  } catch (e) {
    console.error(e)
  } finally {
    await client.close()
  }
}

export const unsetData = async (collection: string, filter: object, data: object) => {
  const client = await connect()
  try {
    const db = client.db(dbName);
    const result = await db.collection(collection).updateOne(filter, { $unset: data })
    console.log(`${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`);
    return result;
  } catch (e) {
    console.error(e)
  } finally {
    await client.close()
  }
}

export const bulkUpdateItems = async (merge: Map<string, sbt.Item>, websocket?: (type: string, message: object, socket?: string) => void, socket?: string) => {
  const client = await connect()
  let bulkUpdateOps: mongoDB.AnyBulkWriteOperation<mongoDB.Document>[][] = []
  let index = 0
  let counter = 0;

  for (const [_, item] of merge) {
    let updateQuery = item._id ? { _id: item._id } : { SKU: item.SKU }
    if (item._id) delete item._id
    if (!bulkUpdateOps[index]) bulkUpdateOps[index] = []
    bulkUpdateOps[index].push({
      updateOne: {
        filter: updateQuery,
        update: { $set: item as mongoDB.Document },
        upsert: true
      }
    });
    counter++;
    if (counter % 1000 === 0) index++
  }

  let page = 0
  let updatedItems = 0
  for (const bulk of bulkUpdateOps) {
    let start = new Date();
    console.log("Saving page " + page + "/" + bulkUpdateOps.length);
    try {
      const db = client.db(dbName);
      let result = await db.collection("Items").bulkWrite(bulk)
      console.log("DB write took " + (((new Date()).getTime() - start.getTime()) / 1000) + "s");
      console.log(`${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`);
      if (result) updatedItems += result.modifiedCount
      if (websocket && socket) websocket('loading', { P: page + 1, T: bulkUpdateOps.length }, socket)
    } catch (e) {
      console.error(e)
    }
    page++
  }

  await client.close()
  return { status: `BulkUpdated ${updatedItems} items` };
}

export const bulkUpdateAny = async (collection: string, arr: mongoDB.Document[], updateKey: string) => {
  const client = await connect()
  let bulkUpdateOps: mongoDB.AnyBulkWriteOperation<mongoDB.Document>[][] = []
  let index = 0
  let counter = 0;

  for (let i in arr) {
    let updateQuery = { [updateKey]: arr[i][updateKey] }
    if (arr[i]._id) delete arr[i]._id
    if (!bulkUpdateOps[index]) bulkUpdateOps[index] = []
    bulkUpdateOps[index].push({
      updateOne: {
        filter: updateQuery,
        update: { $set: arr[i] },
        upsert: true
      }
    });
    counter++;
    if (counter % 1000 === 0) index++
  }

  let page = 0
  let updatedItems = 0
  for (let bulk of bulkUpdateOps) {
    let start = new Date();
    console.log("Saving page " + page + "/" + bulkUpdateOps.length);
    try {
      const db = client.db(dbName);
      let result = await db.collection(collection).bulkWrite(bulk)
      console.log("DB write took " + (((new Date()).getTime() - start.getTime()) / 1000) + "s");
      console.log(`${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`);
      if (result) updatedItems += result.modifiedCount
    } catch (e) {
      console.error(e)
    }
    page++
  }

  await client.close()
  return { status: `BulkUpdated ${updatedItems} items` };
}

export const find = async <T>(collection: string, filter = {}, projection = {}, sort = {}, limit = 20000) => {
  const client = await connect()
  try {
    const db = client.db(dbName);
    return await db.collection(collection).find<T>(filter, {serializeFunctions:true}).project(projection).limit(limit).sort(sort).toArray() as T[]
  } catch (e) {
    console.error(e)
  } finally {
    await client.close()
  }
}

export const findAggregate = async <T>(collection: string, aggregate: object[]) => {
  const client = await connect()
  try {
    const db = client.db(dbName);
    return await db.collection(collection).aggregate<T>(aggregate, {serializeFunctions:true}).toArray()
  } catch (e) {
    console.error(e)
  } finally {
    await client.close()
  }
}

export const findOne = async <T>(collection: string, filter = {}, projection = {}, sort = {}, limit = 20000) => {
  const client = await connect()
  try {
    const db = client.db(dbName);
    return await db.collection(collection).findOne<T>(filter, { serializeFunctions:true, projection: projection, sort: sort, limit: limit })
  } catch (e) {
    console.error(e)
  } finally {
    await client.close()
  }
}

export const findDistinct = async (collection: string, key: string, filter: object) => {
  const client = await connect()
  try {
    const db = client.db(dbName);
    return await db.collection(collection).distinct(key, filter)
  } catch (e) {
    console.error(e)
  } finally {
    await client.close()
  }
}

export const deleteOne = async (collection: string, filter: object) => {
  const client = await connect()
  try {
    const db = client.db(dbName);
    const result = await db.collection(collection).deleteOne(filter)
    console.log(`${result.acknowledged}, deleted ${result.deletedCount} document(s)`);
  } catch (e) {
    console.error(e)
  } finally {
    await client.close()
  }
}

export const deleteMany = async (collection: string, filter: string[]) => {
  const client = await connect()
  try {
    const db = client.db(dbName);
    const result = await db.collection(collection).deleteMany({ SKU: { $in: filter } })
    console.log(`${result.acknowledged}, deleted ${result.deletedCount} document(s)`);
    return result
  } catch (e) {
    console.error(e)
  } finally {
    await client.close()
  }
}



