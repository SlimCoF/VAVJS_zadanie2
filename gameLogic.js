module.exports = {
    controlShip: (wsConn, key) => {
        if([37, 71, 39, 74].includes(key)){
            // Move ship left (<-, G)
            if([37, 71].includes(key) && wsConn.gameValues.ship[0] > 100){
                for (i = 0; i < wsConn.gameValues.ship.length; i++) {
                    wsConn.gameValues.ship[i]--;
                }
            }
            // Move ship right (->, J)
            else if([39, 74].includes(key) && wsConn.gameValues.ship[0] < 108){
                for (i = 0; i < wsConn.gameValues.ship.length; i++) {
                    wsConn.gameValues.ship[i]++;
                }
            }
        }else if(key === 32){
            wsConn.gameValues.missiles.push(wsConn.gameValues.ship[0] - 11);
        }
    },
    RaketaKolidujeSVotrelcom: (ws) =>{
        for (var i = 0; i < ws.gameValues.aliens.length; i++) {
            if (ws.gameValues.aliens[i] > 98) {
                return true;
            }
        }
        return false;
    },
    checkCollisionsMA: (ws) => {
        for (var i = 0; i < ws.gameValues.missiles.length; i++) {
            if (ws.gameValues.aliens.includes(ws.gameValues.missiles[i])) {
                var alienIndex = ws.gameValues.aliens.indexOf(ws.gameValues.missiles[i]);
                ws.gameValues.aliens.splice(alienIndex, 1);
                ws.gameValues.missiles.splice(i, 1);
                ws.gameValues.score += 10;
                if(ws.gameValues.score > ws.gameValues.bestScore){
                    ws.gameValues.bestScore = ws.gameValues.score;
                }
            }
        }
    },
    moveMissiles: (ws) => {
        var i = 0;
        for (i = 0; i < ws.gameValues.missiles.length; i++) {
            ws.gameValues.missiles[i] -= 11;
            if (ws.gameValues.missiles[i] < 0) ws.gameValues.missiles.splice(i, 1);
        }
    },
    moveAliens: (ws) => {
        var i = 0;
        for (i = 0; i < ws.gameValues.aliens.length; i++) {
            ws.gameValues.aliens[i] = ws.gameValues.aliens[i] + ws.gameValues.direction;
        }
        return ws.gameValues.direction *= -1;
    },
    lowerAliens: (ws) => {
        var i = 0;
        for (i = 0; i < ws.gameValues.aliens.length; i++) {
            ws.gameValues.aliens[i] += 11;
        }
    }
}