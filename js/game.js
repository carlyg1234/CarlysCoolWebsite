// Phaser Game Configuration
const gameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    backgroundColor: '#2c3e50',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

// Game variables
let player;
let platforms;
let cursors;
let stars;
let bombs;
let score = 0;
let gameOver = false;
let scoreText;

// Initialize the game
const game = new Phaser.Game(gameConfig);

function preload() {
    // Create simple colored rectangles as sprites since we don't have image files
    
    // Player (blue rectangle)
    this.add.graphics()
        .fillStyle(0x3498db)
        .fillRect(0, 0, 32, 48)
        .generateTexture('player', 32, 48);
    
    // Ground platform (green rectangle)
    this.add.graphics()
        .fillStyle(0x27ae60)
        .fillRect(0, 0, 400, 32)
        .generateTexture('ground', 400, 32);
    
    // Small platform (green rectangle)
    this.add.graphics()
        .fillStyle(0x27ae60)
        .fillRect(0, 0, 400, 32)
        .generateTexture('platform', 400, 32);
    
    // Star (yellow circle)
    this.add.graphics()
        .fillStyle(0xf1c40f)
        .fillCircle(16, 16, 12)
        .generateTexture('star', 32, 32);
    
    // Bomb (red circle)
    this.add.graphics()
        .fillStyle(0xe74c3c)
        .fillCircle(8, 8, 8)
        .generateTexture('bomb', 16, 16);
}

function create() {
    // Create platforms group
    platforms = this.physics.add.staticGroup();
    
    // Create ground and platforms
    platforms.create(400, 568, 'ground').setScale(2, 1).refreshBody();
    platforms.create(600, 400, 'platform');
    platforms.create(50, 250, 'platform');
    platforms.create(750, 220, 'platform');
    
    // Create player
    player = this.physics.add.sprite(100, 450, 'player');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    
    // Player physics
    this.physics.add.collider(player, platforms);
    
    // Create stars group
    stars = this.physics.add.group({
        key: 'star',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 }
    });
    
    stars.children.entries.forEach(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });
    
    this.physics.add.collider(stars, platforms);
    this.physics.add.overlap(player, stars, collectStar, null, this);
    
    // Create bombs group
    bombs = this.physics.add.group();
    this.physics.add.collider(bombs, platforms);
    this.physics.add.collider(player, bombs, hitBomb, null, this);
    
    // Score text
    scoreText = this.add.text(16, 16, 'Score: 0', { 
        fontSize: '32px', 
        color: '#fff' 
    });
    
    // Create cursor keys
    cursors = this.input.keyboard.createCursorKeys();
    
    // Instructions text
    this.add.text(16, 50, 'Use arrow keys to move and jump!', { 
        fontSize: '16px', 
        color: '#ecf0f1' 
    });
}

function update() {
    if (gameOver) {
        return;
    }
    
    // Player movement
    if (cursors.left.isDown) {
        player.setVelocityX(-160);
    }
    else if (cursors.right.isDown) {
        player.setVelocityX(160);
    }
    else {
        player.setVelocityX(0);
    }
    
    // Jumping
    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-330);
    }
}

function collectStar(player, star) {
    star.disableBody(true, true);
    
    // Update score
    score += 10;
    scoreText.setText('Score: ' + score);
    
    // Check if all stars collected
    if (stars.countActive(true) === 0) {
        // Reset stars
        stars.children.entries.forEach(function (child) {
            child.enableBody(true, child.x, 0, true, true);
        });
        
        // Create a bomb
        const x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
        const bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    }
}

function hitBomb(player, bomb) {
    this.physics.pause();
    player.setTint(0xff0000);
    gameOver = true;
    
    // Game over text
    this.add.text(400, 300, 'GAME OVER', {
        fontSize: '64px',
        color: '#e74c3c'
    }).setOrigin(0.5);
    
    this.add.text(400, 350, 'Refresh page to play again', {
        fontSize: '24px',
        color: '#ecf0f1'
    }).setOrigin(0.5);
}