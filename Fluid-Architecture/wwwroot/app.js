async function callApi() {
    const res = await fetch('/api/hello');
    const data = await res.json();

    document.getElementById('output').textContent =
        JSON.stringify(data, null, 2);
}