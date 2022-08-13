const createPromise = (endpoint) =>
  fetch(`http://localhost:3000${endpoint}`).then((res) => {
    if (!res.ok) {
      throw new Error(`${res.status}`);
    }
    return res.json();
  });

function fetchAll(endpoint, concurrentRequests) {
  // Need to fill and then map otherwise promises all have the same reference
  // and resolve at the same time
  console.log('concurrentRequests', concurrentRequests);
  const reqs = Array(concurrentRequests)
    .fill(null)
    .map(() => createPromise(endpoint));
  return Promise.all(reqs);
}

export function createRequester(url) {
  const root = document.getElementById('root');
  const button = document.createElement('button');
  const output = document.createElement('div');
  const input = document.createElement('input');
  const wrapper = document.createElement('form');

  button.textContent = url;
  button.type = 'submit';
  input.placeholder = '1';
  output.textContent = 'Click to request';
  output.classList.add('output');
  wrapper.classList.add('container');

  wrapper.appendChild(input);
  wrapper.appendChild(button);
  wrapper.appendChild(output);

  root.appendChild(wrapper);

  wrapper.onsubmit = (e) => {
    e.preventDefault();
    output.textContent = 'Fetching...';
    const start = Date.now();
    fetchAll(url, Number(input.value) || 1)
      .then((res) => {
        console.log('res', res);
        const elapsed = Date.now() - start;
        output.textContent = `Elapsed: ${elapsed}`;
      })
      .catch((err) => {
        output.textContent = `Error: ${err.message}`;
      });
  };
}
