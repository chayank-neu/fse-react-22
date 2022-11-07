import {
  createTuit, deleteTuit, findAllTuits, findTuitById
} from "../services/tuits-service";

import {
  createUser,
  deleteUsersByUsername, findAllUsers,
  findUserById
} from "../services/users-service";

describe('create Tuit', () => {
   // sample user to insert
   const ripley = {
    username: 'ellenripley',
    password: 'lv426',
    email: 'ellenripley@aliens.com'
  };

  // setup test before running test
  beforeAll(() => {
    // remove any/all users to make sure we create it in the test
    return deleteUsersByUsername(ripley.username);
  })

  // clean up after test runs
  afterAll(() => {
    // remove any data we created
    return deleteUsersByUsername(ripley.username);
  })

  test('can create tuit with REST API', async () => {
    // insert new user in the database
    const newUser = await createUser(ripley);

    // verify inserted user's properties match parameter user
    expect(newUser.username).toEqual(ripley.username);
    expect(newUser.password).toEqual(ripley.password);
    expect(newUser.email).toEqual(ripley.email);

    const postTuit = {
      tuit: 'Hello World',
      postedBy: newUser._id,
    };
    const tuitCreated = await createTuit(newUser._id,postTuit)

    // verify inserted tuit's properties match parameter tuit
    expect(tuitCreated.tuit).toEqual(postTuit.tuit);
    expect(tuitCreated.postedBy).toEqual(postTuit.postedBy);

    // delete tuit after created
    deleteTuit(tuitCreated._id)

  });
});

describe('delete Tuit', () => {
   // sample user to insert
   const ripley = {
    username: 'ellenripley',
    password: 'lv426',
    email: 'ellenripley@aliens.com'
  };

  // setup test before running test
  beforeAll(() => {
    // remove any/all users to make sure we create it in the test
    return deleteUsersByUsername(ripley.username);
  })

  // clean up after test runs
  afterAll(() => {
    // remove any data we created
    return deleteUsersByUsername(ripley.username);
  })

  test('can delete tuit wtih REST API', async () => {

    // insert new user in the database
    const newUser = await createUser(ripley);

    // verify inserted user's properties match parameter user
    expect(newUser.username).toEqual(ripley.username);
    expect(newUser.password).toEqual(ripley.password);
    expect(newUser.email).toEqual(ripley.email);

    const postTuit = {
      tuit: 'Hello World',
      postedBy: newUser._id,
    };
    const tuitCreated = await createTuit(newUser._id,postTuit)

    // verify inserted tuit's properties match parameter tuit
    expect(tuitCreated.tuit).toEqual(postTuit.tuit);
    expect(tuitCreated.postedBy).toEqual(postTuit.postedBy);

     // delete a user by their username. Assumes user already exists
    const status = await deleteTuit(tuitCreated._id);

    // verify we deleted at least one user by their username
    expect(status.deletedCount).toBeGreaterThanOrEqual(1);
  });
});

describe('find tuit by id', () => {
  // sample user to insert
  const ripley = {
    username: 'ellenripley',
    password: 'lv426',
    email: 'ellenripley@aliens.com'
  };

  // setup test before running test
  beforeAll(() => {
    // remove any/all users to make sure we create it in the test
    return deleteUsersByUsername(ripley.username);
  })

  // clean up after test runs
  afterAll(() => {
    // remove any data we created
    return deleteUsersByUsername(ripley.username);
  })

  test('can retrieve a tuit by their primary key with REST API', async () => {
    // insert new user in the database
    const newUser = await createUser(ripley);

    // verify inserted user's properties match parameter user
    expect(newUser.username).toEqual(ripley.username);
    expect(newUser.password).toEqual(ripley.password);
    expect(newUser.email).toEqual(ripley.email);

    const postTuit = {
      tuit: 'Hello World',
      postedBy: newUser._id,
    };
    const tuitCreated = await createTuit(newUser._id,postTuit)

    // verify inserted tuit's properties match parameter tuit
    expect(tuitCreated.tuit).toEqual(postTuit.tuit);
    expect(tuitCreated.postedBy).toEqual(postTuit.postedBy);


    const tuitPresent = await findTuitById(tuitCreated._id);
    // verify inserted tuit's properties match parameter tuit
    expect(tuitPresent.tuit).toEqual(tuitCreated.tuit);
    expect(tuitPresent.postedBy).toEqual(tuitCreated.postedBy);

    // delete tuit after created
    deleteTuit(tuitCreated._id)

  });
});

describe('find all tuits', () => {
  // sample user to insert
  const ripley = {
    username: 'ellenripley',
    password: 'lv426',
    email: 'ellenripley@aliens.com'
  };

  // setup test before running test
  beforeAll(() => {
    // remove any/all users to make sure we create it in the test
    return deleteUsersByUsername(ripley.username);
  })

  // clean up after test runs
  afterAll(() => {
    // remove any data we created
    return deleteUsersByUsername(ripley.username);
  })

  test('can retrieve all tuits with REST API', async () => {
    // insert new user in the database
    const newUser = await createUser(ripley);

    const tuits = [

      {
        "tuit": "xb0",
        "postedBy": newUser._id,
    },
    {
      "tuit": "xb1",
        "postedBy":  newUser._id,
    },
    {
        "tuit": "xb2",
        "postedBy":  newUser._id,
    }
      
    ];

    
    tuits[0] = await createTuit(newUser._id,tuits[0])
    tuits[1] = await createTuit(newUser._id,tuits[1])
    tuits[2] = await createTuit(newUser._id,tuits[2])

    // retrieve all the tuit
    const allTuitsFromDb = await findAllTuits();

    // there should be a minimum number of tuits
    expect(allTuitsFromDb.length).toBeGreaterThanOrEqual(tuits.length);

    // let's check each tuit we inserted
    const tuitsWeInserted = allTuitsFromDb.filter(
      tuit => tuits.indexOf(tuit.tuit) >= 0);

    // compare the actual tuits in database with the ones we sent
    tuitsWeInserted.forEach(tuit => {
      const tt = tuits.find(tuit2 => tuit2.tuit === tuit.tuit);
      expect(tuit.tuit).toEqual(tt.tuit);
      expect(tuit.postedBy).toEqual(newUser._id);
    });

    // delete the tuits we inserted
    tuits.map(tuit =>
      deleteTuit(tuit._id)
    )

  });
});