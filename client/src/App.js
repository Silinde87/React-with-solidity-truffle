import { useState, useEffect } from 'react';
import SimpleStorageContract from './contracts/SimpleStorage.json';
import getWeb3 from './utils/web3';

const App = () => {
	const [storageValue, setStorageValue] = useState(0);
	const [web3, setWeb3] = useState(null);
	const [accounts, setAccounts] = useState(null);
	const [contract, setContract] = useState(null);

	useEffect(() => {
		try {
			fetchData();
		} catch (error) {
			// Catch any errors for any of the above operations.
			alert(`Failed to load web3, accounts, or contract. Check console for details.`);
			console.error(error);
		}
	}, []);

	const fetchData = async () => {
		// Get network provider and web3 instance.
		const web3 = await getWeb3();

		// Use web3 to get the user's accounts.
		const accounts = await web3.eth.getAccounts();

		// Get the contract instance.
		const networkId = await web3.eth.net.getId();

		const deployedNetwork = SimpleStorageContract.networks[networkId];
		const instance = new web3.eth.Contract(
			SimpleStorageContract.abi,
			deployedNetwork && deployedNetwork.address
		);

		// Set web3, accounts, and contract to the state, and then proceed with an
		// example of interacting with the contract's methods.
		setWeb3(web3);
		setAccounts(accounts);
		setContract(instance);
	};

	const storeValue = async () => {
		// Stores a given value, 5 by default.
		await contract.methods.set(5).send({ from: accounts[0] });
		console.log(`accounts`, accounts)

		// Get the value from the contract to prove it worked.
		const response = await contract.methods.get().call();
		console.log(`response`, response)
		// Update state with the result.
		setStorageValue(response);
		console.log(`storageValue`, storageValue)
	};

	return (
		<>
			{web3 ? (
				<div className="App">
					<h2>Smart Contract Example</h2>
					<p>
						If your contracts compiled and migrated successfully, below will show a stored value
						of 5 (by default).
					</p>
					<p>
						Try changing the value stored on <strong>line 42</strong> of App.js.
					</p>
					<button onClick={storeValue}>Store it!</button>
					<div>The stored value is: <strong>{storageValue}</strong></div>
				</div>
			) : (
				<div>Loading Web3, accounts, and contract...</div>
			)}
		</>
	);
};

export default App;
