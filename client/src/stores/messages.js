import { writable } from 'svelte/store';

const messageStore = writable(JSON.stringify({}));

let socket = {};

if (typeof WebSocket !== 'undefined') {
	// Client-side only
	socket = new WebSocket('ws://localhost:8080');

	// Connection opened
	socket.addEventListener('open', () => {
		console.log("It's open");
	});

	// Listen for messages
	socket.addEventListener('message', (event) => {
		messageStore.set(event.data);
	});
}

const sendMessage = (message) => {
	if (socket.readyState <= 1) {
		socket.send(message);
	}
};

// const storeMessage = (message) => {
//   messageStore.set(`You: ${message}`);
// };

export default {
	subscribe: messageStore.subscribe,
	sendMessage
};
