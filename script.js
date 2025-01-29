const mindmap = document.getElementById('mindmap');
const canvas = document.getElementById('connections');
const ctx = canvas.getContext('2d');

const saveBtn = document.getElementById('saveBtn');
const loadBtn = document.getElementById('loadBtn');
const exportBtn = document.getElementById('exportBtn');
const importBtn = document.getElementById('importBtn');

let nodes = [];
let connections = [];
let scale = 1;
let translateX = 0;
let translateY = 0;

// Adjust canvas size on window resize
window.addEventListener('resize', () => {
    canvas.width = mindmap.offsetWidth;
    canvas.height = mindmap.offsetHeight;
});
canvas.width = mindmap.offsetWidth;
canvas.height = mindmap.offsetHeight;

// Add new node
mindmap.addEventListener('dblclick', (e) => {
    const node = document.createElement('div');
    node.className = 'node';
    node.style.left = `${e.clientX}px`;
    node.style.top = `${e.clientY}px`;
    node.contentEditable = true;
    node.draggable = true;

    mindmap.appendChild(node);

    // Add node to array
    nodes.push({ x: e.clientX, y: e.clientY, text: '' });

    // Handle text updates
    node.oninput = () => {
        const index = Array.from(mindmap.querySelectorAll('.node')).indexOf(node);
        nodes[index].text = node.innerText;
    };

    // Drag functionality
    node.addEventListener('mousedown', startDragging);
});

function startDragging(e) {
    const node = e.target;
    let offsetX = e.clientX - node.offsetLeft;
    let offsetY = e.clientY - node.offsetTop;

    const moveNode = (event) => {
        node.style.left = `${event.clientX - offsetX}px`;
        node.style.top = `${event.clientY - offsetY}px`;
        drawConnections(); // Redraw connections
    };

    const stopDragging = () => {
        document.removeEventListener('mousemove', moveNode);
        document.removeEventListener('mouseup', stopDragging);
    };

    document.addEventListener('mousemove', moveNode);
    document.addEventListener('mouseup', stopDragging);
}

// Draw connections
function drawConnections() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    connections.forEach(({ from, to }) => {
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.stroke();
    });
}

// Add connection logic
mindmap.addEventListener('click', (e) => {
    const selectedNode = e.target;
    if (selectedNode.classList.contains('node')) {
        const rect = selectedNode.getBoundingClientRect();
        const center = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };

        if (!connections.temp) {
            connections.temp = center; // First node
        } else {
            connections.push({ from: connections.temp, to: center });
            delete connections.temp; // Clear temp
            drawConnections();
        }
    }
});

// Zoom and pan
mindmap.addEventListener('wheel', (e) => {
    e.preventDefault();
    scale += e.deltaY * -0.001;
    scale = Math.min(Math.max(0.5, scale), 2);
    mindmap.style.transform = `scale(${scale}) translate(${translateX}px, ${translateY}px)`;
});

let isPanning = false;
let startX, startY;

mindmap.addEventListener('mousedown', (e) => {
    isPanning = true;
    startX = e.clientX;
    startY = e.clientY;
});

mindmap.addEventListener('mousemove', (e) => {
    if (isPanning) {
        translateX += e.clientX - startX;
        translateY += e.clientY - startY;
        startX = e.clientX;
        startY = e.clientY;
        mindmap.style.transform = `scale(${scale}) translate(${translateX}px, ${translateY}px)`;
    }
});

mindmap.addEventListener('mouseup', () => {
    isPanning = false;
});

// Save mind map
saveBtn.addEventListener('click', () => {
    const data = { nodes, connections };
    localStorage.setItem('mindmap', JSON.stringify(data));
    alert('Mind map saved!');
});

// Load mind map
loadBtn.addEventListener('click', () => {
    const data = JSON.parse(localStorage.getItem('mindmap'));
    if (!data) return;
    nodes = data.nodes || [];
    connections = data.connections || [];

    mindmap.innerHTML = '<canvas id="connections" width="2000" height="2000"></canvas>';
    nodes.forEach(({ x, y, text }) => {
        const node = document.createElement('div');
        node.className = 'node';
        node.style.left = `${x}px`;
        node.style.top = `${y}px`;
        node.contentEditable = true;
        node.innerText = text;
        mindmap.appendChild(node);
    });
    drawConnections();
});

// Export mind map
exportBtn.addEventListener('click', () => {
    const data = { nodes, connections };
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mindmap.json';
    a.click();
    URL.revokeObjectURL(url);
});

// Import mind map
importBtn.addEventListener('change', (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
        const data = JSON.parse(reader.result);
        nodes = data.nodes || [];
        connections = data.connections || [];
        mindmap.innerHTML = '<canvas id="connections" width="2000" height="2000"></canvas>';
        nodes.forEach(({ x, y, text }) => {
            const node = document.createElement('div');
            node.className = 'node';
            node.style.left = `${x}px`;
            node.style.top = `${y}px`;
            node.contentEditable = true;
            node.innerText = text;
            mindmap.appendChild(node);
        });
        drawConnections();
    };

    reader.readAsText(file);
});
