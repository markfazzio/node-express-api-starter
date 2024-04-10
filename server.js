const express = require('express');
const cors = require('cors');

const isDevMode = process.env.NEXT_PUBLIC_DEV_MODE;

// defaults
const API_PORT = 8080;
const API_BASE = 'api/v1';
const ENDPOINT_OBJECT = 'pokemon';

// construct endpoints from defaults
const ENDPOINTS = {
  GET: `/${API_BASE}/${ENDPOINT_OBJECT}`,
  GET_BY_ID: `/${API_BASE}/${ENDPOINT_OBJECT}/:id`,
};

// pagination
const PAGINATION_IGNORE_PARAMS = ['pageIndex', 'pageSize'];
const PAGINATION_DEFAULT_PAGE_INDEX = 0;
const PAGINATION_DEFAULT_PAGE_SIZE = 20;

// sample data - can also pull from DB or other source
const dataFilePath = './sample-data/pokemon.json';
const data = require(dataFilePath);

// init app
const app = express();

// middlewhere
app.use(cors());
app.use(express.json());

// cors
app.use(function (_req, rest, next) {
  rest.header('Access-Control-Allow-Origin', '*');
  rest.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-Width Content-Type, Accept',
  );
  next();
});

// some helper methods
// return all data []
const getAllData = () => {
  if (data) {
    return data;
  } else {
    return [];
  }
};

// return singular item {}
const getById = id => {
  if (!id) return;

  const availableData = getAllData();
  if (availableData.length) {
    const foundItem = availableData.find(item => {
      return item.id === Number(id);
    });

    return foundItem;
  }
};

const getFilteredKeys = dataQuery => {
  return Object.keys(dataQuery)
    .filter(key => !PAGINATION_IGNORE_PARAMS.includes(key))
    .reduce((obj, key) => {
      obj[key] = dataQuery[key];
      return obj;
    }, {});
};

/*
  Endpoints
*/

// api/v1/${ENDPOINT_OBJECT}
app.get(ENDPOINTS.GET, (req, res) => {
  if (isDevMode) {
    console.log(ENDPOINTS.GET);
    console.log('Query:', req.query);
  }
  const availableData = getAllData();

  try {
    // query string object
    const dataQuery = req.query;

    // pagination
    const pageIndex = dataQuery.pageIndex
      ? parseInt(dataQuery.pageIndex)
      : PAGINATION_DEFAULT_PAGE_INDEX;
    const pageSize = dataQuery.pageSize
      ? parseInt(dataQuery.pageSize)
      : PAGINATION_DEFAULT_PAGE_SIZE;

    // calculate the start and end indexes for the requested page
    const startIndex = pageIndex * pageSize;
    const endIndex = (pageIndex + 1) * pageSize;

    // ignore pagination params
    const filteredKeys = getFilteredKeys(dataQuery);
    const filteredData = availableData.filter(item => {
      let isValid = true;
      for (key in filteredKeys) {
        // loose
        isValid = isValid && item[key] == dataQuery[key];
      }
      return isValid;
    });

    // slice the products array based on the indexes
    const paginatedData = filteredData.slice(startIndex, endIndex);

    // send the paginated data and count of returned data
    // if pagination params are not passed, send filtered data
    res.json({
      data:
        dataQuery.pageIndex && dataQuery.pageSize
          ? paginatedData
          : filteredData,
      count: filteredData.length,
    });
  } catch (err) {
    res.send(err.message);
  }
});

// api/v1/${ENDPOINT_OBJECT}/:id
app.get(ENDPOINTS.GET_BY_ID, (req, res) => {
  const foundItem = getById(req.params.id);
  if (isDevMode) {
    console.info(foundItem);
  }
  if (foundItem) {
    res.send(foundItem);
  } else {
    res.status(404).send('Item not found');
  }
});

/*
  Error Handling
*/
app.get('*', function (_req, res) {
  res.status(404).send({ status: 404, message: 'Invalid endpoint.' });
});

/* 
  Server listener
*/
app.listen(API_PORT, () => {
  if (process.env.DEV_MODE)
    console.info(`Server listening on port ${API_PORT}`);
});
