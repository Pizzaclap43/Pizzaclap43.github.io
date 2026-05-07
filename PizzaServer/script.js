async function updateStatus() {
    // Usando el proxy optimizado proporcionado por ElmichiYT
    const target = "https://cc-server-proxy.elmichiyt.workers.dev/";
    
    function formatUptime(seconds) {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;

        let parts = [];
        if (h > 0) parts.push(`${h} h`);
        if (m > 0 || h > 0) parts.push(`${m} m`);
        parts.push(`${s} s`);

        return parts.join(', ');
    }

    try {
        const response = await fetch(target);
        if (!response.ok) throw new Error("Error en el servidor");
        
        const data = await response.json();
        
        const myServer = data.servers.find(s => s.hash === '73a30f1191366a1ac56bc4432bbb0225');
        
        const dot = document.getElementById('status-indicator');
        const text = document.getElementById('status-text');
        const players = document.getElementById('player-count');

        if (myServer && dot) {
            dot.className = 'status-dot dot-on';
            text.innerHTML = `ONLINE`;
            text.style.color = '#53FC18';
            players.innerHTML = `Jugadores: ${myServer.players}/${myServer.maxplayers}`;
            
            const uptime = document.getElementById('server-time');
            if (uptime) uptime.innerHTML = formatUptime(myServer.uptime);
            
        } else if (dot) {
            dot.className = 'status-dot dot-off';
            text.innerHTML = `OFFLINE`;
            text.style.color = '#ff4444';
            players.innerHTML = 'El servidor está descansando';
        }
    } catch (error) {
        console.error('Error:', error);
        const st = document.getElementById('status-text');
        if (st) st.innerHTML = "ERROR DE CONEXIÓN";
    }
}

updateStatus();

setInterval(updateStatus, 15000);
