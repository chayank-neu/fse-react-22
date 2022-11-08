import Tuits from "../components/tuits/index";
import {screen, render} from "@testing-library/react";
import {HashRouter} from "react-router-dom";
import {findAllTuits} from "../services/tuits-service";
import axios from "axios";

//jest.mock('axios');

const MOCKED_USERS = [
  {username: 'alice', password: 'lv426', email: 'alice@weyland.com', _id: "123"},
  {username: 'bob', password: 'lv426', email: 'bob@weyland.com', _id: "567"},
  {username: 'charlie', password: 'illbeback', email: 'charlie@bigjeff.com', _id: "234"}
];

const MOCKED_TUITS = [
  "alice's tuit", "bob's tuit", "charlie's tuit"
];

test('tuit list renders static tuit array', () => {

  // inserting tuit into mock 
	const mkTuits = []
	for(var i = 0; i < MOCKED_TUITS.length; i++) {
		mkTuits.push({_id: "ID" + i, tuit: MOCKED_TUITS[i], postedBy: MOCKED_USERS[i]._id});
	}

	render(
		<HashRouter>
			<Tuits tuits={mkTuits}/>
		</HashRouter>);

	const linkElement = screen.getByText(/charlie's tuit/i);
	expect(linkElement).toBeInTheDocument();
});

test('tuit list renders async', async () => {
	const tuits = await findAllTuits();
	
	render(
		<HashRouter>
			<Tuits tuits ={tuits}/>
		</HashRouter>);
		
		const linkElement = screen.getByText(/Mars rover/i);
		expect(linkElement).toBeInTheDocument();
})

test('tuit list renders mocked', async () => {

   // inserting tuit into mock 
	const mkTuits = []
	for(var i = 0; i < MOCKED_TUITS.length; i++) {
		mkTuits.push({_id: "ID" + i, tuit: MOCKED_TUITS[i], postedBy: MOCKED_USERS[i]._id});
	}
	
	const mock = jest.spyOn(axios, 'get');
	mock.mockImplementation(() =>
	Promise.resolve({data:{tuits:mkTuits}}));
	const response = await findAllTuits();
	const lisOfTuits = response.tuits;
	
	render(
		<HashRouter>
			<Tuits tuits={lisOfTuits}/>
		</HashRouter>);
	
	const linkElement = screen.getByText(/charlie's tuit/i);
	expect(linkElement).toBeInTheDocument();
});
